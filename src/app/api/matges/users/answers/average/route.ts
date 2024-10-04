import { getUsersAverageAnswersHandler } from '@/controllers/maturidade-gestao/user.controller';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    return getUsersAverageAnswersHandler();
}