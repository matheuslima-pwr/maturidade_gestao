import { verifyUserHandler } from "@/controllers/valuation/user.controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    if (!id) {
        return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }
    return verifyUserHandler(id);
}