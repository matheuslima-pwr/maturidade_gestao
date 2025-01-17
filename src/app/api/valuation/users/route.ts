import { saveUserHandler } from '@/controllers/valuation/user.controller';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    return saveUserHandler(body);
}