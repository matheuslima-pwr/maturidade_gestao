import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { createEmailTemplate } from '@/lib/valuation/email';
import { ValuationData } from '@/@types/valuation';
import puppeteer from 'puppeteer';
import { google } from 'googleapis';
import { SendMailOptions } from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const OAuth2 = google.auth.OAuth2

export const sendEmailService = async (userId: string, body: ValuationData) => {
    const user = await prisma.userValuation.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    try {
        const emailData = {
            companyName: user.empresa,
            data: body
        };

        // Generate PDF
        const htmlContent = createEmailTemplate(emailData)
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/opt/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage()
        await page.setContent(htmlContent)
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        })
        await browser.close()

        // Send Email
        const createTransporter = async () => {
            const oauth2Client = new OAuth2(
              process.env.CLIENT_ID,
              process.env.CLIENT_SECRET_KEY,
              "https://developers.google.com/oauthplayground"
            );
            
            oauth2Client.setCredentials({
              refresh_token: process.env.REFRESH_TOKEN
            });
          
            const accessToken = oauth2Client.getAccessToken()
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: "OAuth2", 
                user: process.env.SMTP_USER,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET_KEY,
                refreshToken: process.env.REFRESH_TOKEN
              },
              tls: {
                rejectUnauthorized: false
              }
            } as nodemailer.TransportOptions);
          
            return transporter;
          };
          
          const sendEmail = async (emailOptions: SendMailOptions) => {
            const emailTransporter = await createTransporter();
            emailTransporter.sendMail(emailOptions, (error: Error | null, response: nodemailer.SentMessageInfo) => {
                error ? console.log(error) : console.log(response);
                emailTransporter.close();
           });
          };
          
          await sendEmail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Resultado do seu Valuation',
            text: 'Segue em anexo o resultado do seu Valuation fornecido pela PWR Gestão.',
            attachments: [{
                filename: 'resultado-valuation.pdf',
                content: Buffer.from(pdfBuffer),
                contentType: 'application/pdf'
            }]
        });
        return NextResponse.json({ message: 'Email sent' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            return NextResponse.json({ message: 'Error sending email: ' + error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
    }
}
