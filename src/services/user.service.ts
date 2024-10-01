import { PrismaClient } from '@prisma/client';
import { UserDto } from "@/@types/user";

const prisma = new PrismaClient();

export async function saveUser(body: UserDto) {
    try {
        // Salvar o usuário no banco de dados
        const data = {
            email: body.email,
            nome: body.nome,
            cargo: body.cargo,
            empresa: body.empresa,
            segmento: body.segmento,
            telefone: body.telefone.replace(/\D/g, ''),
            faturamento: parseFloat(body.faturamento.replace(/[R$.\s]/g, '').replace(',', '.'))
        }
        const savedUser = await prisma.user.create({
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
