import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { createEmailTemplate } from '@/lib/valuation/email';
import { ValuationData } from '@/@types/valuation';
import { google } from 'googleapis';
import { SendMailOptions } from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const OAuth2 = google.auth.OAuth2

console.log('[Email Service] Verificando variáveis de ambiente:', {
    hasClientId: !!process.env.CLIENT_ID,
    hasClientSecret: !!process.env.CLIENT_SECRET_KEY,
    hasRefreshToken: !!process.env.REFRESH_TOKEN,
    hasSmtpUser: !!process.env.SMTP_USER
});

export const sendEmailService = async (userId: string, body: ValuationData) => {
    console.log(`[Email Service] Iniciando envio de email para usuário ID: ${userId}`);

    const user = await prisma.userValuation.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        console.log(`[Email Service] Usuário não encontrado - ID: ${userId}`);
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    try {
        console.log(`[Email Service] Preparando dados do email para ${user.email}`);
        const emailData = {
            companyName: user.empresa,
            data: body
        };

        const htmlContent = createEmailTemplate(emailData)
        console.log('[Email Service] Template do email gerado com sucesso');

        // Send Email
        const createTransporter = async () => {
            try {
                console.log('[Email Service] Configurando transporter OAuth2');
                const oauth2Client = new OAuth2(
                    process.env.CLIENT_ID,
                    process.env.CLIENT_SECRET_KEY,
                    "https://developers.google.com/oauthplayground"
                );

                oauth2Client.setCredentials({
                    refresh_token: process.env.REFRESH_TOKEN
                });

                console.log('[Email Service] Obtendo access token...');
                const accessTokenResponse = await oauth2Client.getAccessToken();
                console.log('[Email Service] Access token obtido:', !!accessTokenResponse);

                if (!accessTokenResponse.token) {
                    throw new Error('Access token não obtido');
                }

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: process.env.SMTP_USER,
                        accessToken: accessTokenResponse.token,
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET_KEY,
                        refreshToken: process.env.REFRESH_TOKEN
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                } as nodemailer.TransportOptions);

                return transporter;
            } catch (error) {
                console.error('[Email Service] Erro ao criar transporter:', error);
                throw error;
            }
        };

        const sendEmail = async (emailOptions: SendMailOptions) => {
            console.log('[Email Service] Iniciando processo de envio do email');
            const emailTransporter = await createTransporter();

            return new Promise((resolve, reject) => {
                emailTransporter.sendMail(emailOptions, (error: Error | null, response: nodemailer.SentMessageInfo) => {
                    if (error) {
                        console.error('[Email Service] Erro no envio:', error);
                        reject(error);
                    } else {
                        console.log('[Email Service] Email enviado com sucesso:', response.messageId);
                        resolve(response);
                    }
                    emailTransporter.close();
                });
            });
        };

        try {
            await sendEmail({
                from: '"PWR Gestão" <' + process.env.SMTP_USER + '>', // Nome do remetente adicionado
                to: user.email,
                subject: 'Resultado do seu Valuation',
                text: 'Segue em anexo o resultado do seu Valuation fornecido pela PWR Gestão.',
                html: htmlContent
            });
        } catch (error) {
            console.error('[Email Service] Erro no envio:', error);
            return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
        }

        console.log(`[Email Service] Processo finalizado com sucesso para ${user.email}`);
        return NextResponse.json({ message: 'Email sent' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('[Email Service] Erro crítico:', error.message);
            return NextResponse.json({ message: 'Error sending email: ' + error.message }, { status: 500 });
        }
        console.error('[Email Service] Erro desconhecido durante o envio');
        return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
    }
}
