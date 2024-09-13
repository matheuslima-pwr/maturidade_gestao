import { saveUserHandler } from '@/controllers/user.controller';

export async function POST(req: Request) {
    const body = await req.json();
    return saveUserHandler(body);
}