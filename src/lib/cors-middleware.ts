import { NextRequest, NextResponse } from "next/server";
import { initMiddleware } from "@/lib/init-middleware";
import * as dotenv from "dotenv";
dotenv.config();

export const corsMiddleware = initMiddleware((req: NextRequest, res: NextResponse, next) => {
    const baseUrl = process.env.BASE_URL;
    const allowedOrigins = ['http://localhost:3000', baseUrl];
    const origin = req.headers.get('origin') || '';

    if(allowedOrigins.includes(origin)) {
        res.headers.set('Access-Control-Allow-Origin', origin);
        res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.headers.set('Access-Control-Allow-Credentials', 'true');
    
        next()
        
    } else {
        return new NextResponse('Origin not allowed', { status: 403 });
    }
})