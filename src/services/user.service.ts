import { PrismaClient } from '@prisma/client';
import { UserDto } from "@/@types/user";

const prisma = new PrismaClient();

export async function saveUser(body: UserDto) {
    try {
        // Salvar o usuário no banco de dados
        const data = {
            email: body.email,
            nome: body.nome,
            empresa: body.empresa,
            segmento: body.segmento,
            telefone: body.telefone.replace(/\D/g, ''),
            faturamento: parseFloat(body.faturamento.replace(/[R$.\s]/g, '').replace(',', '.'))
        }
        console.log(data)
        const savedUser = await prisma.user.create({
            data
        });

        return {
            success: true,
            message: 'Usuário salvo com sucesso!',
            data: savedUser,
        };
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw new Error('Erro ao salvar usuário');
    }
}

export async function getAnswersByUserId(userId: number) {
    try {
        // Buscar as respostas no banco de dados
        const answers = await prisma.answer.findMany({
            where: {
                usuario_id: userId
            },
        });

        return answers;
    } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        throw new Error('Erro ao buscar respostas');
    }
}

export async function getZoneByUser(userId: number) {
    try {
        // Buscar a zona do usuário no banco de dados
        const answers = await prisma.answer.findMany({
            where: {
                usuario_id: userId
            }
        });
        
        const zone = answers.reduce((acc, answer) => {
            if (answer.resposta === 'yes') {
                acc++;
            }
            return acc;
        }, 0);
        console.log(zone)

        return zone;
    } catch (error) {
        console.error('Erro ao buscar zona do usuário:', error);
        throw new Error('Erro ao buscar zona do usuário');
    }
}

export async function saveUserAnswers(userId: number, answers: { questionId: number, answer: string }[]) {
    try {
        // Salvar as respostas no banco de dados
        console.log(answers)
        const savedAnswers = await prisma.answer.createMany({
            data: answers.map(answer => ({
                usuario_id: userId,
                resposta: answer.answer,
                pergunta_id: answer.questionId, // Add the missing property 'questionId'
            })),
        });

        return {
            success: true,
            message: 'Respostas salvas com sucesso!',
            data: savedAnswers,
        };
    } catch (error) {
        console.error('Erro ao salvar respostas:', error);
        throw new Error('Erro ao salvar respostas');
    }
}