// src/app/api/users/[id]/answers/route.ts
import { getAnswersByUserIdHandler, saveAnswersHandler } from '@/controllers/user.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userId = parseInt(params.id);
    return getAnswersByUserIdHandler(userId);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const userId = parseInt(params.id);

    // Extrai o corpo da requisição (as respostas)
    const body = await request.json();
    const answers = body;
    // Chama o controlador para salvar as respostas
    return saveAnswersHandler(userId, answers);
}

