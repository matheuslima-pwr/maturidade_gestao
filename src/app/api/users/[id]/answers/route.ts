// src/app/api/users/[id]/answers/route.ts
import { getAnswersByUserIdHandler, saveAnswersHandler } from '@/controllers/user.controller';
import { corsMiddleware } from '@/lib/cors-middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await corsMiddleware(request, NextResponse.next())
    const userId = params.id;
    return getAnswersByUserIdHandler(userId);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await corsMiddleware(request, NextResponse.next())
    
    const userId = params.id;

    // Extrai o corpo da requisição (as respostas)
    const body = await request.json();
    const answers = body;
    // Chama o controlador para salvar as respostas
    return saveAnswersHandler(userId, answers);
}

