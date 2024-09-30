import { UserDto } from "@/@types/user";
import { saveUser } from "@/services/user.service";
import { NextResponse } from "next/server";

export async function saveUserHandler(body: UserDto) {
    try {
        // Chama o serviço para salvar o usuário
        const result = await saveUser(body);

        // Cria a resposta com o status e o cookie
        const response = NextResponse.json(result, { status: 201 }); // Created
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 }); // Internal Server Error
    }
}