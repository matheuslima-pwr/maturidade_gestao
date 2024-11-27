import { saveUserHandler } from '@/controllers/maturidade-empresarial/user.controller';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    return saveUserHandler(body);
}