import { getAverageAnswersByUserIdHandler } from '@/controllers/maturidade-gestao/user.controller';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    return getAverageAnswersByUserIdHandler(userId);
}