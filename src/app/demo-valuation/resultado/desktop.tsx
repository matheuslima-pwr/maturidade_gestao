import { TableBody } from "@/components/ui/table"
import FlexTooltip from "@/components/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import sectors from '@/app/demo-valuation/database/sectors.json'
import ranges from '@/app/demo-valuation/database/ranges.json'

interface ValuationResultProps {
    employee: number
    lastYearRevenue: number
    ttmRevenue: number
    lastYearEbitda: number
    ttmEbitda: number
    grossDebt: number
    availability: number
    sectorId: number
}

const CustomTableHeader = ({ children }: { children: React.ReactNode }) => {
    return <TableHeader className='text-base md:text-lg bg-black/80'>{children}</TableHeader>
}

const CustomTableHead = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <TableHead className={cn('text-white', className)}>{children}</TableHead>
}

const CustomTableRow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <TableRow className={cn('hover:bg-gray-100', className)}>{children}</TableRow>
}

const CustomTableCell = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <TableCell className={cn('text-sm md:text-base', className)}>{children}</TableCell>
}

export default function ValuationResultDesktop({ data }: { data: ValuationResultProps }) {
    const sector = sectors.find(sector => sector.id === data.sectorId)

    const lastYearRange = () => {
        if (!sector?.annual_net_revenue) return null

        const range = ranges.find(r => 100 * data.lastYearRevenue / sector.annual_net_revenue >= r.inicio && 100 * data.lastYearRevenue / sector.annual_net_revenue <= r.fim)

        if (!range) return null
        return {
            min: (1 - range.piso / 100) * sector.ev_ebitda,
            max: (1 - range.teto / 100) * sector.ev_ebitda
        }
    }

    const ttmRange = () => {
        if (!sector?.annual_net_revenue) return null

        const range = ranges.find(r => 100 * data.ttmRevenue / sector.annual_net_revenue >= r.inicio && 100 * data.ttmRevenue / sector.annual_net_revenue <= r.fim)

        if (!range) return null
        return {
            min: (1 - range.piso / 100) * sector.ev_ebitda,
            max: (1 - range.teto / 100) * sector.ev_ebitda
        }
    }

    return (
        <>
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
                                <p>Quantidade de empresas do segmento selecionado em mercados emergentes</p>
                            </FlexTooltip>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <p className='text-2xl font-semibold'>{sector ? sector.number_of_companies : '-'}</p>
                    </CardContent>
                </Card>
                <Card className='shadow shadow-base w-full lg:w-auto'>
                    <CardHeader className='p-4 text-center'>
                        <CardTitle className='text-base lg:text-lg'>Múltiplo EBITDA</CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <p className='text-2xl font-semibold'>{sector ? sector.ev_ebitda.toFixed(1) : '-'}</p>
                    </CardContent>
                </Card>
            </div>
            <div className='mt-4'>
                <Table >
                    <CustomTableHeader>
                        <CustomTableRow className='hover:bg-black/50'>
                            <TableHead className='w-[52%]'></TableHead>
                            <CustomTableHead className='w-[16%]'>Mercado</CustomTableHead>
                            <CustomTableHead className='w-[16%]'>Sua Empresa</CustomTableHead>
                            <CustomTableHead className='w-[16%]'>Comparação</CustomTableHead>
                        </CustomTableRow>
                    </CustomTableHeader>
                    <TableBody>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Margem EBITDA do Segmento: </CustomTableCell>
                            <CustomTableCell>{sector ? `${(100 * sector.ebitda_margin).toFixed(1)}%` : '-'}</CustomTableCell>
                            <CustomTableCell>{data.ttmRevenue ? `${(100 * data.ttmEbitda / data.ttmRevenue).toFixed(1)}%` : '-'}</CustomTableCell>
                            <CustomTableCell>{sector ? (100 * data.ttmEbitda / data.ttmRevenue) > sector.ebitda_margin ? 'Acima do Mercado' : 'Abaixo do Mercado' : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Receita Líquida / Colaborador / Mês: </CustomTableCell>
                            <CustomTableCell>{sector ? Math.round(sector.monthly_net_revenue_per_employee).toLocaleString('pt-BR') : '-'}</CustomTableCell>
                            <CustomTableCell>{data.ttmRevenue ? Math.round(data.ttmRevenue / data.employee / 12).toLocaleString('pt-BR') : '-'}</CustomTableCell>
                            <CustomTableCell>{sector ? (data.ttmRevenue / data.employee / 12) > (sector.monthly_net_revenue_per_employee) ? 'Acima do Mercado' : 'Abaixo do Mercado' : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Média de Receita Líquida Anual X Receita Líquida do Último Ano: </CustomTableCell>
                            <CustomTableCell>{sector ? sector.annual_net_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{data.lastYearRevenue ? data.lastYearRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{sector ? `${(100 * data.lastYearRevenue / sector.annual_net_revenue).toFixed(1)}%` : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Média de Receita Líquida Anual X Receita Líquida ds Últimos 12 meses: </CustomTableCell>
                            <CustomTableCell>{sector ? sector.annual_net_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{data.ttmRevenue ? data.ttmRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{sector ? `${(100 * data.ttmRevenue / sector.annual_net_revenue).toFixed(1)}%` : '-'}</CustomTableCell>
                        </CustomTableRow>
                    </TableBody>
                </Table>
            </div>
            <div className='mt-4'>
                <Table>
                    <CustomTableHeader>
                        <CustomTableRow className='hover:bg-black/50'>
                            <CustomTableHead className='w-[52%]'>Avaliação do Último Ano</CustomTableHead>
                            <CustomTableHead className='w-[24%]'>Mínimo</CustomTableHead>
                            <CustomTableHead className='w-[24%]'>Máximo</CustomTableHead>
                        </CustomTableRow>
                    </CustomTableHeader>
                    <TableBody>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Múltiplo Aplicado: </CustomTableCell>
                            <CustomTableCell>{lastYearRange() ? lastYearRange()?.min.toFixed(1) : '-'}</CustomTableCell>
                            <CustomTableCell>{lastYearRange() ? lastYearRange()?.max.toFixed(1) : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Valuation da Firma: </CustomTableCell>
                            <CustomTableCell>{lastYearRange() ? (data.lastYearEbitda * (lastYearRange()?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{lastYearRange() ? (data.lastYearEbitda * (lastYearRange()?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Valuation para Acionistas: </CustomTableCell>
                            <CustomTableCell>{lastYearRange() ? (data.lastYearEbitda * (lastYearRange()?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{lastYearRange() ? (data.lastYearEbitda * (lastYearRange()?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                        </CustomTableRow>
                    </TableBody>
                </Table>
            </div>
            <div className='mt-4'>
                <Table>
                    <CustomTableHeader>
                        <CustomTableRow className='hover:bg-black/50'>
                            <CustomTableHead className='w-[52%]'>Avaliação dos Últimos 12 Meses</CustomTableHead>
                            <CustomTableHead className='w-[24%]'>Mínimo</CustomTableHead>
                            <CustomTableHead className='w-[24%]'>Máximo</CustomTableHead>
                        </CustomTableRow>
                    </CustomTableHeader>
                    <TableBody>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Múltiplo Aplicado: </CustomTableCell>
                            <CustomTableCell>{ttmRange() ? ttmRange()?.min.toFixed(1) : '-'}</CustomTableCell>
                            <CustomTableCell>{ttmRange() ? ttmRange()?.max.toFixed(1) : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Valuation da Firma: </CustomTableCell>
                            <CustomTableCell>{ttmRange() ? (data.ttmEbitda * (ttmRange()?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{ttmRange() ? (data.ttmEbitda * (ttmRange()?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <CustomTableCell className='font-semibold'>Valuation para Acionistas: </CustomTableCell>
                            <CustomTableCell>{ttmRange() ? (data.ttmEbitda * (ttmRange()?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                            <CustomTableCell>{ttmRange() ? (data.ttmEbitda * (ttmRange()?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</CustomTableCell>
                        </CustomTableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    )
}