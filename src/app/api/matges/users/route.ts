import { getUsersHandler, saveUserHandler } from '@/controllers/maturidade-gestao/user.controller';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    return saveUserHandler(body);
}

export async function GET(req: NextRequest) {
    return getUsersHandler();
}