import { getZoneByUserHandler } from "@/controllers/user.controller";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userId = parseInt(params.id);
    return getZoneByUserHandler(userId);
}