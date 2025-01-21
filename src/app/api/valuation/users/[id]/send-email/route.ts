import { sendEmailHandler } from '@/controllers/valuation/email.controller';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    const body = await req.json();
    return sendEmailHandler(userId, body);
}