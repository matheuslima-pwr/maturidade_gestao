import { PrismaClient } from '@prisma/client';
import { UserDto } from "@/@types/user";
import { ValuationDto } from '@/@types/valuation';

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
        }
        const savedUser = await prisma.userValuation.create({
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

export async function verifyUser(id: string) {
    const user = await prisma.userValuation.findUnique({
        where: { id }
    });

    return user ? true : false;
}

export async function saveValuation(id: string, body: ValuationDto) {
    try {
        // Validar se o usuário existe antes de tentar salvar
        const userExists = await prisma.userValuation.findUnique({
            where: { id }
        });

        if (!userExists) {
            throw new Error('Usuário não encontrado');
        }

        const data = {
            colaboradores: Number(body.employee),
            segmento: Number(body.sector),
            receita_anual: Number(body.lastYearRevenue.replace(/[R$.\s]/g, '').replace(',', '.')),
            receita_ttm: Number(body.ttmRevenue.replace(/[R$.\s]/g, '').replace(',', '.')),
            ebitda_anual: Number(body.lastYearEbitda.replace(/[R$.\s]/g, '').replace(',', '.')),
            ebitda_ttm: Number(body.ttmEbitda.replace(/[R$.\s]/g, '').replace(',', '.')),
            divida_bruta: Number(body.grossDebt.replace(/[R$.\s]/g, '').replace(',', '.')),
            disponibilidade: Number(body.availability.replace(/[R$.\s]/g, '').replace(',', '.')),
            usuario_id: id,
        }

        // Validar se todos os números são válidos
        for (const [key, value] of Object.entries(data)) {
            if (isNaN(Number(value)) && key !== 'usuario_id') {
                throw new Error(`Valor inválido para ${key}`);
            }
        }

        const savedValuation = await prisma.dataValuation.upsert({
            where: {
                usuario_id: id
            },
            update: data,
            create: data
        });

        return {
            success: true,
            message: 'Avaliação salva com sucesso!',
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao salvar avaliação:', error.message);
            throw new Error(error.message);
        }
        
        console.error('Erro ao salvar avaliação:', error);
        throw new Error('Erro ao salvar avaliação');
    }
}