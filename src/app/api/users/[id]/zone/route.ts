import { getZoneByUserHandler } from "@/controllers/user.controller";
import { corsMiddleware } from "@/lib/cors-middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await corsMiddleware(request, NextResponse.next())

    const userId = params.id;
    return getZoneByUserHandler(userId);
}