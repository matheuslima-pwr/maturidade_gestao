import { saveValuationHandler } from "@/controllers/valuation/user.controller";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    
    const userId = params.id;

    // Extrai o corpo da requisição (as respostas)
    const body = await request.json();
    // Chama o controlador para salvar as respostas
    return saveValuationHandler(userId, body);
}
