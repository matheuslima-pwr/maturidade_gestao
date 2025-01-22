import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import sectors from "@/app/demo-valuation/database/sectors.json"
import ranges from "@/app/demo-valuation/database/ranges.json"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import FlexTooltip from "@/components/tooltip"
import { ValuationData } from "@/@types/valuation"


export default function ValuationResultMobile({ data }: { data: ValuationData }) {
    const sector = sectors.find(sector => sector.id === data.sectorId)

    const lastYearRange = () => {
        if (!sector?.annual_net_revenue) return null

        const margin = 100 * data.lastYearRevenue / sector.annual_net_revenue;

        // Se a margem for maior que 100%, usa o último range (80-100)
        const range = margin > 100
            ? ranges[ranges.length - 1]
            : ranges.find(r => margin >= r.inicio && margin <= r.fim);

        if (!range) return null
        return {
            min: (1 - range.piso / 100) * sector.ev_ebitda,
            max: (1 - range.teto / 100) * sector.ev_ebitda
        }
    }

    const ttmRange = () => {
        if (!sector?.annual_net_revenue) return null

        const margin = 100 * data.ttmRevenue / sector.annual_net_revenue;

        // Se a margem for maior que 100%, usa o último range (80-100)
        const range = margin > 100
            ? ranges[ranges.length - 1]
            : ranges.find(r => margin >= r.inicio && margin <= r.fim);

        if (!range) return null
        return {
            min: (1 - range.piso / 100) * sector.ev_ebitda,
            max: (1 - range.teto / 100) * sector.ev_ebitda
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className='flex items-center gap-2 lg:gap-4'>
                <Card className='shadow shadow-base w-full lg:w-auto'>
                    <CardHeader className='p-4 text-center'>
                        <CardTitle className='flex items-center justify-center gap-2'>
                            <p className='text-base md:text-lg'>Empresas</p>
                            <FlexTooltip
                                trigger={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#fb5500" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-5h2v2h-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1a1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355" />
                                    </svg>
                                }
                                className='w-60 bg-gray-700 text-white text-sm p-2'
                            >
                                <p>Quantidade de empresas do seu segmento em mercados emergentes</p>
                            </FlexTooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <p className='text-2xl font-semibold'>{sector ? sector.number_of_companies : '-'}</p>
                    </CardContent>
                </Card>
                <Card className='shadow shadow-base w-full lg:w-auto'>
                    <CardHeader className='p-4 text-center'>
                        <CardTitle className='flex items-center justify-center gap-2'>
                            <p className='text-base md:text-lg'>Múltiplo EBITDA</p>
                            <FlexTooltip
                                trigger={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#fb5500" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-5h2v2h-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1a1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355" />
                                    </svg>
                                }
                                className='w-60 bg-gray-700 text-white text-sm p-2'
                            >
                                <p>Média do Múltiplo EBITDA de empresas do segmento selecionado em mercados emergentes.</p>
                            </FlexTooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <p className='text-2xl font-semibold'>{sector ? sector.ev_ebitda.toFixed(1) : '-'}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="w-full">
                <Accordion type="single" collapsible defaultValue="revenue-per-employee">
                    <AccordionItem value="revenue-per-employee" className="border-none">
                        <AccordionTrigger className="px-6 py-4 text-base lg:text-lg hover:no-underline">
                            Receita Líquida / Colaborador / Mês
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                            <div className="space-y-4">
                                <div className="flex justify-between gap-2">
                                    <p className="text-gray-700 font-medium">Sua Empresa</p>
                                    <p className="text-gray-700 font-medium">
                                        {data.ttmRevenue ? `${Math.round(data.ttmRevenue / data.employee / 12).toLocaleString('pt-BR')}` : '-'}
                                    </p>
                                </div>

                                <div className="flex justify-between gap-2">
                                    <p className="text-gray-700 font-medium">Mercado</p>
                                    <p className="text-gray-700 font-medium">
                                        {sector ? `${Math.round(sector.monthly_net_revenue_per_employee).toLocaleString('pt-BR')}` : '-'}
                                    </p>
                                </div>

                                <hr className="my-4" />

                                <div className="flex justify-between gap-2">
                                    <p className="text-gray-700 font-semibold">Comparação</p>
                                    <div className="font-medium">
                                        {sector && (data.ttmRevenue / data.employee / 12) > sector.monthly_net_revenue_per_employee ? (
                                            <span className="text-green-500 flex items-center gap-1">
                                                <TrendingUpIcon className="inline w-4 h-4" />
                                                Acima do Mercado
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1">
                                                <TrendingDownIcon className="inline w-4 h-4" />
                                                Abaixo do Mercado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            <Card>
                <Accordion type="single" collapsible defaultValue="last-year-revenue">
                    <AccordionItem value="last-year-revenue" className="border-none">
                        <AccordionTrigger className="px-6 py-4 text-base lg:text-lg hover:no-underline">
                            Receita Líquida do Último Ano
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 px-6 pb-4">
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-700 font-medium">Sua Empresa</p>
                                <p className="text-gray-700 font-medium">{data.lastYearRevenue ? `${data.lastYearRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}` : '-'}</p>
                            </div>
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-700 font-medium">Média do Mercado</p>
                                <p className="text-gray-700 font-medium">{sector ? `${sector.annual_net_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}` : '-'}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-700 font-semibold">Comparação</p>
                                <p className="font-medium">
                                    {sector && data.lastYearRevenue > sector.annual_net_revenue ? (
                                        <span className="text-green-500 flex items-center gap-1">
                                            <TrendingUpIcon className="inline w-4 h-4" />
                                            Acima do Mercado
                                        </span>
                                    ) : (
                                        <span className="text-red-500 flex items-center gap-1">
                                            <TrendingDownIcon className="inline w-4 h-4" />
                                            Abaixo do Mercado
                                        </span>
                                    )}
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            <Card>
                <Accordion type="single" collapsible defaultValue="ttm-revenue">
                    <AccordionItem value="ttm-revenue" className="border-none">
                        <AccordionTrigger className="px-6 py-4 text-base lg:text-lg hover:no-underline">
                            Receita Líquida dos Últimos 12 meses
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 px-6 pb-4">
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-700 font-medium">Sua Empresa</p>
                                <p className="text-gray-700 font-medium">{data.ttmRevenue ? `${data.ttmRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}` : '-'}</p>
                            </div>
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-700 font-medium">Média do Mercado</p>
                                <p className="text-gray-700 font-medium">{sector ? `${sector.annual_net_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}` : '-'}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-700 font-semibold">Comparação</p>
                                <p className="font-medium">
                                    {sector && data.ttmRevenue > sector.annual_net_revenue ? (
                                        <span className="text-green-500 flex items-center gap-1">
                                            <TrendingUpIcon className="inline w-4 h-4" />
                                            Acima do Mercado
                                        </span>
                                    ) : (
                                        <span className="text-red-500 flex items-center gap-1">
                                            <TrendingDownIcon className="inline w-4 h-4" />
                                            Abaixo do Mercado
                                        </span>
                                    )}
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            <Card>
                <Accordion type="single" collapsible defaultValue="last-year-valuation">
                    <AccordionItem value="last-year-valuation" className="border-none">
                        <AccordionTrigger className="px-6 py-4 text-base lg:text-lg hover:no-underline">
                            Avaliação do Último Ano
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm md:text-base font-medium text-muted-foreground">Múltiplo Aplicado</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs md:text-sm text-muted-foreground">Min</span>
                                            <p className="text-lg md:text-xl font-medium">
                                                {lastYearRange()?.min.toFixed(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs md:text-sm text-muted-foreground">Max</span>
                                            <p className="text-lg md:text-xl font-medium">
                                                {lastYearRange()?.max.toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-2" />
                                <div className="space-y-2">
                                    <h3 className="text-sm md:text-base font-medium text-muted-foreground">Valor da Firma</h3>
                                    <div className="grid grid-rows-2 gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Min</span>
                                            <p className="text-lg font-medium">
                                                {(data.lastYearEbitda * (lastYearRange()?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Max</span>
                                            <p className="text-lg font-medium">
                                                {(data.lastYearEbitda * (lastYearRange()?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-2" />
                                <div className="space-y-2">
                                    <h3 className="text-sm md:text-base font-medium text-muted-foreground">Valor para Acionistas</h3>
                                    <div className="grid grid-rows-2 gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Min</span>
                                            <p className="text-lg font-medium">
                                                {(data.lastYearEbitda * (ttmRange()?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Max</span>
                                            <p className="text-lg font-medium">
                                                {(data.lastYearEbitda * (ttmRange()?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            <Card>
                <Accordion type="single" collapsible defaultValue="ttm-valuation">
                    <AccordionItem value="ttm-valuation" className="border-none">
                        <AccordionTrigger className="px-6 py-4 text-base lg:text-lg hover:no-underline">
                            Avaliação dos Últimos 12 Meses
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm md:text-base font-medium text-muted-foreground">Múltiplo Aplicado</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs md:text-sm text-muted-foreground">Min</span>
                                            <p className="text-lg font-medium">
                                                {ttmRange()?.min.toFixed(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs md:text-sm text-muted-foreground">Max</span>
                                            <p className="text-lg font-medium">
                                                {ttmRange()?.max.toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-2" />
                                <div className="space-y-2">
                                    <h3 className="text-sm md:text-base font-medium text-muted-foreground">Valor da Firma</h3>
                                    <div className="grid grid-rows-2 gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Min</span>
                                            <p className="text-lg font-medium">
                                                {(data.ttmEbitda * (ttmRange()?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Max</span>
                                            <p className="text-lg font-medium">
                                                {(data.ttmEbitda * (ttmRange()?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-2" />
                                <div className="space-y-2">
                                    <h3 className="text-sm md:text-base font-medium text-muted-foreground">Valor para Acionistas</h3>
                                    <div className="grid grid-rows-2 gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Min</span>
                                            <p className="text-lg font-medium">
                                                {(data.ttmEbitda * (ttmRange()?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs md:text-sm text-muted-foreground">Max</span>
                                            <p className="text-lg font-medium">
                                                {(data.ttmEbitda * (ttmRange()?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
            <span className='text-xs lg:text-sm text-gray-600 font-semibold'>Os valores não refletem uma avaliação formal para ser usada em negociações de compra e venda e são dados estimados com base em informações das bases do site do professor Damodaran, com intuito de analisar ordens de grandeza genéricas.</span>
        </div>
    )
}