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

export async function getAnswersByUserId(userId: string) {
    try {
        // Buscar as respostas no banco de dados
        const answers = await prisma.answer.findMany({
            where: {
                user_id: parseInt(userId),
            },
        });

        return answers;
    } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        throw new Error('Erro ao buscar respostas');
    }
}

export async function saveUserAnswers(userId: string, answers: { question: string, answer: string }[]) {
    try {
        // Salvar as respostas no banco de dados
        console.log(answers)
        // const savedAnswers = await prisma.answer.createMany({
        //     data: answers.map(answer => ({
        //         user_id: userId,
        //         resposta: answer.answer,
        //         questionId: '', // Add the missing property 'questionId'
        //         answers: [], // Add the missing property 'answers'
        //     })),
        // });

        return {
            success: true,
            message: 'Respostas salvas com sucesso!',
            // data: savedAnswers,
        };
    } catch (error) {
        console.error('Erro ao salvar respostas:', error);
        throw new Error('Erro ao salvar respostas');
    }
}