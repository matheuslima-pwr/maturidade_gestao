import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { clsx, type ClassValue } from "clsx"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    return handler(req, res)
  }
}