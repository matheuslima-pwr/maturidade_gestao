import { getUsers } from '@/controllers/posest/user.controller';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const response = await getUsers();
    console.log(response);
    return response;
}