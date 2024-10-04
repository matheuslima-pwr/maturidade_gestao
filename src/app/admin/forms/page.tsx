'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function AdminHome() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Bem vindo a seleção de formulário</h1>
      <div className="space-y-4">
        <Button 
          onClick={() => router.push('/admin/forms/posest')}
          className="w-full"
        >
            Posicionamento Estratégico
        </Button>
        <Button 
          onClick={() => router.push('/admin/forms/dashboard')}
          className="w-full"
        >
            Maturidade em Gestão
        </Button>
      </div>
    </div>
  )
}