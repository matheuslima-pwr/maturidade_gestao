import { findAll } from "@/services/posest/user.service";
import { NextResponse } from "next/server";

export async function getUsers() {
    try {
        const users: any = await findAll();
        return NextResponse.json(users, { status: 200 }); // OK
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 }); // Internal Server Error
    }
}