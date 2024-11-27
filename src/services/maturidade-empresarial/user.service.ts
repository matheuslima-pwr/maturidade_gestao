import { PrismaClient } from '@prisma/client';
import { UserDto } from "@/@types/user";

const prisma = new PrismaClient();

export async function getUsers() {
    try {
        // Buscar os usuários no banco de dados
        const users = await prisma.userMaturidadeEmpresarial.findMany();
        return users;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error('Erro ao buscar usuários');
    }
}

export async function getUsersAverageAnswers() {
    try {
        // Buscar as respostas dos usuários
        const averageAnswers = await prisma.$queryRaw`
            SELECT
            CASE
                WHEN pergunta_id BETWEEN 1 AND 5 THEN 'Estrategia e Gestao'
                WHEN pergunta_id BETWEEN 6 AND 10 THEN 'Financeiro'
                WHEN pergunta_id BETWEEN 11 AND 15 THEN 'Comercial / Vendas'
                WHEN pergunta_id BETWEEN 16 AND 20 THEN 'Liderança e Gestão de Pessoas'
            END AS grupo,
            AVG(CASE WHEN resposta = 'yes' THEN 1 ELSE 0 END) AS media
            FROM
            maturidade_gestao.respostas r 
            GROUP BY
            grupo;
        `;
        return averageAnswers;
    } catch (error) {
        console.error('Erro ao buscar média das respostas:', error);
        throw new Error('Erro ao buscar média das respostas');
    }
}

export async function getAverageAnswersByUserId(userId: string) {
    try {
        // Buscar as respostas do usuário no banco de dados
        const averageAnswers = await prisma.$queryRaw`
            SELECT
            CASE
                WHEN pergunta_id BETWEEN 1 AND 5 THEN 'Estrategia e Gestao'
                WHEN pergunta_id BETWEEN 6 AND 10 THEN 'Financeiro'
                WHEN pergunta_id BETWEEN 11 AND 15 THEN 'Comercial / Vendas'
                WHEN pergunta_id BETWEEN 16 AND 20 THEN 'Liderança e Gestão de Pessoas'
            END AS grupo,
            AVG(CASE WHEN resposta = 'yes' THEN 1 ELSE 0 END) AS media
            FROM
            maturidade_empresarial.respostas r 
            WHERE usuario_id = CAST(${userId} as uuid)
            GROUP BY
            grupo;
        `;
        return averageAnswers;
    } catch (error) {
        console.error('Erro ao buscar média das respostas do usuário:', error);
        throw new Error('Erro ao buscar média das respostas do usuário');
    }
}

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
        const savedUser = await prisma.userMaturidadeEmpresarial.create({
            data
        });

        return {
            success: true,
            message: 'Usuário salvo com sucesso!',
            userId: savedUser.id,
        };
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw new Error('Erro ao salvar usuário');
    }
}

export async function getAnswersByUserId(userId: string) {
    try {
        // Buscar as respostas no banco de dados
        const answers = await prisma.answerMaturidadeEmpresarial.findMany({
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

export async function getZoneByUser(userId: string) {
    try {
        // Buscar a zona do usuário no banco de dados
        const answers = await prisma.answerMaturidadeEmpresarial.findMany({
            where: {
                usuario_id: userId
            }
        });

        if (answers.length === 0) {
            throw new Error('Usuário não possui respostas');
        }

        const zone = answers.reduce((acc, answer) => {
            if (answer.resposta === 'yes') {
                acc++;
            }
            return acc;
        }, 0);

        return zone;
    } catch (error) {
        console.error('Erro ao buscar zona do usuário:', error);
        throw new Error('Erro ao buscar zona do usuário');
    }
}

export async function saveUserAnswers(userId: string, answers: { questionId: number, answer: string }[]) {
    try {
        if (!answers || answers.length === 0) {
            throw new Error('Nenhuma resposta fornecida.');
        }

        const savedAnswers = await prisma.answerMaturidadeEmpresarial.createMany({
            data: answers.map(answer => ({
                usuario_id: userId,
                resposta: answer.answer,
                pergunta_id: answer.questionId,
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