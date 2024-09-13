// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verifica o token JWT
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));

        // Se a verificação é bem-sucedida, prossegue com a requisição
        return NextResponse.next();
    } catch (err) {
        // Se o token é inválido, retorna uma resposta 401
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

// Configuração do matcher para aplicar o middleware
export const config = {
  matcher: ['/api/users/:id/:path*'],
};
