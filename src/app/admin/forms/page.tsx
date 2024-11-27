'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { signOut } from 'next-auth/react';

export default function AdminHome() {
  const router = useRouter()

  const logout = async () => {
    await signOut()
    router.replace('/admin')
  }

  return (
    <div className="flex flex-col my-auto items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Painel de Administração</h1>
      <div className="space-y-4 w-[300px] flex flex-col items-center">
        <Button 
          onClick={() => router.push('/admin/forms/pe')}
          className="w-full bg-black text-white hover:bg-black/90 hover:text-white"
        >
            Posicionamento Estratégico
        </Button>
        <Button 
          onClick={() => router.push('/admin/forms/mg')}
          className="w-full bg-black text-white hover:bg-black/90 hover:text-white"
        >
            Maturidade em Gestão
        </Button>
        <Button variant={'outline'} className="w-48 bg-[#004477] text-white hover:bg-[#004477]/90 hover:text-white" onClick={logout}>Sair</Button>
      </div>
    </div>
  )
}