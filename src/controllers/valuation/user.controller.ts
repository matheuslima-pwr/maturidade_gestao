import { UserDto } from "@/@types/user";
import { ValuationDto } from "@/@types/valuation";
import { saveUser, saveValuation, verifyUser } from "@/services/valuation/user.service";
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

export async function verifyUserHandler(id: string) {
    const result = await verifyUser(id);
    return NextResponse.json(result, { status: 200 });
}

export async function saveValuationHandler(id: string, body: ValuationDto) {
    try {
        const result = await saveValuation(id, body);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 }); // Internal Server Error
    }
}