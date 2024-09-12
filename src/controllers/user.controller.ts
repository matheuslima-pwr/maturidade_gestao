// controllers/answerController.ts
import { UserDto } from '@/@types/user';
import { getAnswersByUserId, getZoneByUser, saveUser, saveUserAnswers } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function getAnswersByUserIdHandler(userId: number) {
    try {
        // Chama o serviço para buscar as respostas
        const answers = await getAnswersByUserId(userId);
        return NextResponse.json(answers, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 });
    }
}

export async function getZoneByUserHandler(userId: number) {
    try {
        // Chama o serviço para buscar a zona do usuário
        const zone = await getZoneByUser(userId);
        return NextResponse.json(zone, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar zona do usuário' }, { status: 500 });
    }
}

export async function saveUserHandler(body: UserDto) {
    try {
        // Chama o serviço para salvar o usuário
        const result = await saveUser(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 });
    }
}

export async function saveAnswersHandler(userId: number, answers: { questionId: number, answer: string }[]) {
    try {
        if (!answers || answers.length === 0) {
            return NextResponse.json({ error: 'Nenhuma resposta fornecida.' }, { status: 400 });
        }

        // Chama o serviço para salvar as respostas
        const result = await saveUserAnswers(userId, answers);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar respostas' }, { status: 500 });
    }
}    
