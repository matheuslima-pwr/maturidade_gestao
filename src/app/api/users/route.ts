import { saveUserHandler } from '@/controllers/user.controller';
import { corsMiddleware } from '@/lib/cors-middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    await corsMiddleware(req, NextResponse.next())
    const body = await req.json();

    return saveUserHandler(body);
}