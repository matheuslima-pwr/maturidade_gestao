import { getZoneByUserHandler } from "@/controllers/maturidade-gestao/user.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    return getZoneByUserHandler(userId);
}