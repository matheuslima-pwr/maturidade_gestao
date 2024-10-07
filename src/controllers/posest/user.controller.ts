import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { findAll } from "@/services/posest/user.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type User = {
    email: string;
    nome: string;
    telefone: string;
    empresa: string;
    segmento: string;
    faturamento: number; // Update the type to number
    respostas: {
        pergunta_id: number;
        pontuacao: number;
    }[];
    operacional: string;
    cliente: string;
    produto: string;
}

export async function getUsers() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Unauthorized
    }
    
    try {
        const users: User[] = await findAll();
        return NextResponse.json(users, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 }); // Internal Server Error
    }
}
