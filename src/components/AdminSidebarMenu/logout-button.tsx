'use client';
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {

    return (
        <button
        onClick={() => signOut({ callbackUrl: '/admin' })}
        className="mt-4 flex w-full items-center space-x-2 rounded-md bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
            <LogOut size={16} />
            <span>Log out</span>
        </button>
    )
}