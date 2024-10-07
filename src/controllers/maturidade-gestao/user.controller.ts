import { UserDto } from '@/@types/user';
import { getAnswersByUserId, getAverageAnswersByUserId, getUsers, getUsersAverageAnswers, getZoneByUser, saveUser, saveUserAnswers } from '@/services/maturidade-gestao/user.service';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// controllers/answerController.ts

export async function getUsersHandler() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Unauthorized
    }

    try {
        // Chama o serviço para buscar os usuários
        const users = await getUsers();
        return NextResponse.json(users, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 }); // Internal Server Error
    }
}

export async function getUsersAverageAnswersHandler() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Unauthorized
    }
    // Chama o serviço para buscar as respostas
    const result = await getUsersAverageAnswers();

    // Cria a resposta com o status e o cookie
    const response = NextResponse.json(result, { status: 200 }); // OK
    return response;
}

export async function getAverageAnswersByUserIdHandler(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Unauthorized
    }
    
    try {
        // Chama o serviço para buscar as respostas
        const answers = await getAverageAnswersByUserId(userId);
        return NextResponse.json(answers, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 }); // Internal Server Error
    }
}

export async function getAnswersByUserIdHandler(userId: string) {
    try {
        // Chama o serviço para buscar as respostas
        const answers = await getAnswersByUserId(userId);
        return NextResponse.json(answers, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 }); // Internal Server Error
    }
}

export async function getZoneByUserHandler(userId: string) {
    try {
        // Chama o serviço para buscar a zona do usuário
        const zone = await getZoneByUser(userId);
        return NextResponse.json(zone, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar zona do usuário' }, { status: 500 }); // Internal Server Error
    }
}

export async function saveUserHandler(body: UserDto) {
    try {
        // Chama o serviço para salvar o usuário
        const result = await saveUser(body);

        // Cria o token JWT
        const token = await new SignJWT({ email: body.email })
                            .setProtectedHeader({ alg: 'HS256' })
                            .setExpirationTime('5h')
                            .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

        // Cria a resposta com o status e o cookie
        const response = NextResponse.json(result, { status: 201 }); // Created
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Só define como secure em produção
            maxAge: 5 * 3600, // Tempo de expiração em segundos
            path: '/',
            sameSite: 'strict', // Pode ajustar conforme necessário
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 }); // Internal Server Error
    }
}

export async function saveAnswersHandler(userId: string, answers: { questionId: number, answer: string }[]) {
    try {
        // Chama o serviço para salvar as respostas
        const result = await saveUserAnswers(userId, answers);
        return NextResponse.json(result, { status: 201 }); // Created
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar respostas' }, { status: 500 }); // Internal Server Error
    }
}
