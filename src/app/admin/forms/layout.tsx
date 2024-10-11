'use client';
import AdminSidebarMenu from "@/components/AdminSidebarMenu";
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
            {status === 'authenticated' && 
            <div className="flex items-center justify-center h-full">
                {/* <AdminSidebarMenu/> */}
                {children}
            </div>
            }
        </>
    );
}
