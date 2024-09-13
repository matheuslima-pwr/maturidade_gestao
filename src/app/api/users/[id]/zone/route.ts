import { getZoneByUserHandler } from "@/controllers/user.controller";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userId = params.id;
    return getZoneByUserHandler(userId);
}