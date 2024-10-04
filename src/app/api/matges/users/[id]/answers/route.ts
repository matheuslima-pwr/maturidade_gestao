import { getAnswersByUserIdHandler, saveAnswersHandler } from '@/controllers/maturidade-gestao/user.controller';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    return getAnswersByUserIdHandler(userId);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    
    const userId = params.id;

    // Extrai o corpo da requisição (as respostas)
    const body = await request.json();
    const answers = body;
    // Chama o controlador para salvar as respostas
    return saveAnswersHandler(userId, answers);
}

