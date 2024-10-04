'use client';
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AdminLoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    useEffect(() => {
        console.log('Session:', session);
        console.log('Status:', status);
    
        if (status === "loading") return; // Enquanto a sessão está carregando
        if (!session) {
          signIn(); // Redireciona para a página de login se não estiver autenticado
        }
      }, [session, status]);

    return (
        <>
            { children }
        </>
    );
}
