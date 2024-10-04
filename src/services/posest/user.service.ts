import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findAll() {
  try {
    const result = await prisma.userPosEst.findMany({
      select: {
        email: true,
        nome: true,
        telefone: true,
        empresa: true,
        segmento: true,
        faturamento: true,
        respostas: {
          select: {
            pergunta_id: true,
            pontuacao: true
          }
        }
      }
    });

    // Processamento para cálculo
    const processedResult = result.map(user => {
      const operacional = user.respostas
        .filter(r => [1, 4, 8].includes(r.pergunta_id))
        .reduce((acc, r) => acc + (r.pergunta_id === 8 ? r.pontuacao * 2 : r.pontuacao * 1.5), 0);

      const cliente = user.respostas
        .filter(r => [5, 7, 9].includes(r.pergunta_id))
        .reduce((acc, r) => acc + (r.pergunta_id === 7 ? r.pontuacao * 2 : r.pontuacao * 1.5), 0);

      const produto = user.respostas
        .filter(r => [2, 3, 6].includes(r.pergunta_id))
        .reduce((acc, r) => acc + (r.pergunta_id === 2 ? r.pontuacao * 2 : r.pontuacao * 1.5), 0);

      return {
        ...user,
        operacional: (operacional / 20 * 100).toFixed(2),
        cliente: (cliente / 20 * 100).toFixed(2),
        produto: (produto / 20 * 100).toFixed(2)
      };
    });

    return processedResult;
  } catch (error) {
    throw new Error('Erro ao buscar respostas');
  }
}
