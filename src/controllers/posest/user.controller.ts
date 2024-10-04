import { findAll } from "@/services/posest/user.service";
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
    try {
        const users: User[] = await findAll();
        return NextResponse.json(users, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 }); // Internal Server Error
    }
}
