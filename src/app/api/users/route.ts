import { saveUserHandler } from '@/controllers/user.controller';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    return saveUserHandler(body);
}