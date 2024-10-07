'use client';
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminLoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { status } = useSession();

    return (
        <>
            {status === 'unauthenticated' && redirect('/admin')}
            {status === 'loading' && <Loading />}
            {status === 'authenticated' && children}
        </>
    );
}
