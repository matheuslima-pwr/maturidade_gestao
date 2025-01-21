'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import sectors from '@/app/demo-valuation/database/sectors.json'
import { AutoComplete } from '@/components/AutoComplete'
import { redirect, useParams } from 'next/navigation'
import api from '@/app/api'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/loading'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ValuationResultDesktop from '../../resultado/desktop'
import ValuationResultMobile from '../../resultado/mobile'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

const invoiceMask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
    let decimalPart = '';

    if (value.length === 0) {
        input.value = '';
    } else if (value.length > 2) {
        decimalPart = ',' + value.slice(-2);
        value = value.slice(0, -2);
    } else {
        decimalPart = ',' + value;
        value = '';
    }

    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separadores de milhar

    input.value = input.value ? 'R$ ' + value + decimalPart : '';
}



interface FormState {
    employee: number
    lastYearRevenue: number
    ttmRevenue: number
    lastYearEbitda: number
    ttmEbitda: number
    grossDebt: number
    availability: number
    sectorId: number
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateFormData = (data: any) => {
    if (data.employee === '' || data.lastYearRevenue === '' || data.ttmRevenue === '' || data.lastYearEbitda === '' || data.ttmEbitda === '' || data.grossDebt === '' || data.availability === '') {
        return false
    }
    return true
}

export default function CompanyValuationCalculator() {
    const [data, setData] = useState<FormState>({
        employee: 1,
        lastYearRevenue: 0,
        ttmRevenue: 0,
        lastYearEbitda: 0,
        ttmEbitda: 0,
        grossDebt: 0,
        availability: 0,
        sectorId: 0
    })
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [openEmailDialog, setOpenEmailDialog] = useState(false)
    const { id } = useParams()

    const { data: isUserVerified, isFetching } = useQuery({
        queryKey: ['isUserVerified', id],
        queryFn: async () => {
            const response = await api.get(`/api/valuation/verify-user/${id}`)
            return response.data
        }
    })

    const handleSendEmail = async () => {
        const element = document.getElementById('result-desktop')
        if (!element) return

        try {
            setLoadingEmail(true)
            await api.post(`/api/valuation/users/${id}/send-email`, data)
            toast.success('Email enviado com sucesso!')
        } catch (error) {
            toast.error('Ocorreu um erro ao enviar o email. Tente novamente mais tarde.')
        } finally {
            setLoadingEmail(false)
            setOpenEmailDialog(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData.entries())

        setLoading(true)
        setShowResult(true)
        if (validateFormData(data)) {
            try {
                await api.post(`/api/valuation/users/${id}`, data)
                setData({
                    ...data,
                    lastYearRevenue: Number((data.lastYearRevenue as string).replace(/[R$.\s]/g, '').replace(',', '.')),
                    ttmRevenue: Number((data.ttmRevenue as string).replace(/[R$.\s]/g, '').replace(',', '.')),
                    lastYearEbitda: Number((data.lastYearEbitda as string).replace(/[R$.\s]/g, '').replace(',', '.')),
                    ttmEbitda: Number((data.ttmEbitda as string).replace(/[R$.\s]/g, '').replace(',', '.')),
                    grossDebt: Number((data.grossDebt as string).replace(/[R$.\s]/g, '').replace(',', '.')),
                    availability: Number((data.availability as string).replace(/[R$.\s]/g, '').replace(',', '.')),
                    sectorId: Number(data.sector),
                    employee: Number(data.employee)
                })
            } catch (error) {
                setShowResult(false)
                toast.error('Ocorreu um erro ao realizar o cálculo. Tente novamente mais tarde.')
                console.error('Erro ao validar os dados:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    if (isFetching) return <Loading />

    if (!isUserVerified) redirect('/demo-valuation')

    return (
        <div className="container lg:flex mx-auto p-4">
            <Card className={cn("w-full max-w-md mx-auto",
                showResult ? 'hidden lg:block' : 'block')}
            >
                <CardHeader>
                    <CardTitle className='text-base lg:text-lg'>Formulário de Avaliação</CardTitle>
                    <CardDescription className='text-sm lg:text-base'>Insira os dados financeiros da sua empresa para calcular seu valuation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4" id='form'>
                        <div className="space-y-2">
                            <Label htmlFor="sector">Segmento</Label>
                            <AutoComplete
                                name='sector'
                                options={sectors.map((s) => ({
                                    value: s.id.toString(),
                                    label: s.industry_group
                                }))}
                                placeholder='Selecione seu segmento'
                                emptyMessage='Nenhum segmento encontrado'
                                visibleItemsCount={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employee">Quantidade de Colaboradores</Label>
                            <Input
                                id="employee"
                                type="number"
                                name="employee"
                                placeholder="Insira a quantidade de colaboradores"
                                min={1}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="revenue">Receita Líquida do Último Ano</Label>
                            <Input
                                id="last-year-revenue"
                                name="lastYearRevenue"
                                placeholder="Insira a receita anual"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="revenue">Receita Líquida dos Últimos 12 Meses</Label>
                            <Input
                                id="ttm-revenue"
                                name="ttmRevenue"
                                placeholder="Insira a receita anual"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-year-ebitda">EBITDA do Último Ano</Label>
                            <Input
                                id="last-year-ebitda"
                                name="lastYearEbitda"
                                placeholder="Insira o EBITDA do último ano"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ttm-ebitda">EBITDA dos Últimos 12 Meses</Label>
                            <Input
                                id="ttm-ebitda"
                                name="ttmEbitda"
                                placeholder="Insira o EBITDA dos últimos 12 meses"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gross-debt">Dívida Bruta (Amortização do Endividamento)</Label>
                            <Input
                                id="gross-debt"
                                name="grossDebt"
                                placeholder="Insira a dívida bruta"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Disponibilidade (Caixa e Equivalentes)</Label>
                            <Input
                                id="availability"
                                name="availability"
                                placeholder="Insira a disponibilidade"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                    </form>
                    <Button
                        type="submit"
                        form="form"
                        className="bg-black text-white hover:bg-black/80 w-full lg:h-12 h-8 text-sm lg:text-base mt-4"
                    >
                        Calcular Valor de Mercado
                    </Button>
                </CardContent>
            </Card>

            <Card className={cn("w-full lg:ml-4 mt-4 lg:mt-0",
                showResult ? 'block' : 'hidden lg:block')}
            >
                {loading ? <Loading /> : (
                    <>
                        <CardHeader>
                            <CardTitle className='text-base md:text-lg lg:text-lg'>
                                <p>Resultado</p>
                            </CardTitle>
                            <CardDescription className='text-sm md:text-base lg:text-base text-gray-600'>
                                Aqui você verá o valuation da sua empresa e sua comparação com o mercado.
                            </CardDescription>
                            <span className='text-xs md:text-sm lg:text-sm text-gray-600 font-semibold'>As empresas que usamos de benchmark se encontram nos seguintes paises: China, India, América Latina, Asia e demais regiões emergentes.</span>
                        </CardHeader>
                        <CardContent>
                            <div className="lg:hidden block">
                                <ValuationResultMobile data={data} />
                            </div>
                            <div className="hidden lg:block">
                                <ValuationResultDesktop data={data} />
                            </div>
                            <AlertDialog open={openEmailDialog} onOpenChange={setOpenEmailDialog}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className='bg-black text-white hover:bg-black/80 w-full lg:w-auto lg:h-12 h-10 text-sm lg:text-base mt-4'
                                        disabled={!data.ttmRevenue || !data.ttmEbitda || !data.lastYearRevenue || !data.lastYearEbitda || !data.grossDebt || !data.availability || !data.employee}
                                    >
                                        Receber resultado por email
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className='bg-white'>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Deseja receber o resultado por email?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className='text-gray-600'>
                                            O resultado será enviado para o email que você inseriu no formulário de cadastro.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className='bg-black text-white hover:bg-black/80'
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleSendEmail()
                                            }}
                                            disabled={loadingEmail}>
                                            {loadingEmail ?
                                                <p className='flex items-center gap-2'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12">
                                                            <animateTransform attributeName="transform" attributeType="XML" dur="560ms" from="0,12,12" repeatCount="indefinite" to="360,12,12" type="rotate" />
                                                        </path>
                                                    </svg>
                                                    <span>Enviando...</span>
                                                </p>
                                                : 'Sim, enviar por email'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className="lg:hidden my-4">
                                <Button
                                    onClick={() => {
                                        setShowResult(false)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}
                                    className="w-full bg-black text-white hover:bg-black/80 h-10"
                                >
                                    Voltar para o Formulário
                                </Button>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    )
}
