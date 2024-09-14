import { NextRequest, NextResponse } from "next/server";

type Middleware = (req: NextRequest, res: NextResponse, next: (err?: any) => void) => void;

export function initMiddleware(middleware: Middleware) {
    return async (req: NextRequest, res: NextResponse) => {
        return new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => {
                if(result instanceof Error) {
                    return reject(result);
                }
                resolve(result);
            })
        })
    }

}