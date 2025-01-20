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
import FlexTooltip from '@/components/tooltip'
import { cn } from '@/lib/utils'
import ValuationResultDesktop from '../../resultado/desktop'
import ValuationResultMobile from '../../resultado/mobile'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateFormData = (data: any) => {
    if (data.employee === '' || data.lastYearRevenue === '' || data.ttmRevenue === '' || data.lastYearEbitda === '' || data.ttmEbitda === '' || data.grossDebt === '' || data.availability === '') {
        return false
    }
    return true
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
    const { id } = useParams()

    const { data: isUserVerified, isFetching } = useQuery({
        queryKey: ['isUserVerified', id],
        queryFn: async () => {
            const response = await api.get(`/api/valuation/verify-user/${id}`)
            return response.data
        }
    })

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
                    <CardDescription className='text-sm lg:text-base'>Insira os dados financeiros da sua empresa para calcular seu valor de mercado com base no EBITDA.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Label htmlFor="gross-debt">Dívida Bruta</Label>
                            <Input
                                id="gross-debt"
                                name="grossDebt"
                                placeholder="Insira a dívida bruta"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Disponibilidade</Label>
                            <Input
                                id="availability"
                                name="availability"
                                placeholder="Insira a disponibilidade"
                                onChange={invoiceMask}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-black text-white hover:bg-black/80 w-full lg:h-12 h-8 text-sm lg:text-base"
                        >
                            Calcular Valor de Mercado
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className={cn("w-full lg:ml-4 mt-4 lg:mt-0",
                showResult ? 'block' : 'hidden lg:block')}
            >
                {loading ? <Loading /> : (
                    <>
                        <CardHeader>
                            <CardTitle className='text-base lg:text-lg flex items-center gap-2'>
                                <p>Resultado</p>
                                <FlexTooltip
                                    className='w-72 lg:w-[500px] bg-gray-700 text-white text-sm'
                                    trigger={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#004477" d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
                                        </svg>
                                    }
                                >
                                    <span>Os valores não refletem uma avaliação formal para ser usada em negociações de compra e venda e são dados estimados com base em informações das bases do site do professor Damodaran, com intuito de analisar ordens de grandeza genéricas.</span>
                                </FlexTooltip>
                            </CardTitle>
                            <CardDescription className='text-sm lg:text-base text-gray-600'>Aqui você verá o valor de mercado da sua empresa e sua comparação com o mercado.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="lg:hidden block">
                                <ValuationResultMobile data={data} />
                            </div>
                            <div className="hidden lg:block">
                                <ValuationResultDesktop data={data} />
                            </div>
                            <div className="lg:hidden my-4">
                                <Button
                                    onClick={() => {
                                        setShowResult(false)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}
                                    className="w-full bg-black text-white hover:bg-black/80 mt-4"
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
