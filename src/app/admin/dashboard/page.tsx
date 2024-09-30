'use client';
import * as React from "react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"

import { Icon } from "@iconify/react"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
export const description = "A radar chart with a legend"
const chartData = [
  { total: "Comercial e Vendas", Media: 75, Resposta: 80 },
  { total: "Financeiro", Media: 30, Resposta: 65 },
  { total: "Estratégia e Gestão", Media: 84, Resposta: 70 },
  { total: "Liderança e Gestão", Media: 73, Resposta: 20 }
]
const chartConfig = {
    
  Resposta: {
    label: "Média Geral",
    color: "#444444",
  },Media: {
    label: "Sua Média",
    color: "#ff5b00",
  },
} satisfies ChartConfig



export default function Dashboard() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const emails = ["email1@example.com", "email2@example.com", "email3@example.com", "email4@example.com"];
    
    // Filter emails based on search query
    const filteredEmails = emails.filter((email) =>
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className=" flex-1 flex w-full flex-col bg-muted/50">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
                    <Card x-chunk="A stats card showing this week's total sales in USD, the percentage difference from last week, and a progress bar.">
                    <CardHeader className="pb-2">
                        <CardDescription>Comercail e Vendas</CardDescription>
                        <CardTitle className="text-4xl flex items-center gap-2"><Icon icon="carbon:sales-ops" width={24} height={24}/> 80%</CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Progress value={80} aria-label="25% increase" />
                    </CardFooter>
                    </Card>
                    <Card x-chunk="A stats card showing this week's total sales in USD, the percentage difference from last week, and a progress bar.">
                    <CardHeader className="pb-2">
                        <CardDescription> Financeiro</CardDescription>
                        <CardTitle className="text-4xl flex items-center gap-2"><Icon icon="hugeicons:coins-dollar" width={24} height={24}/> 65% </CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Progress value={65} aria-label="25% increase" />
                    </CardFooter>
                    </Card>
                    <Card x-chunk="A stats card showing this week's total sales in USD, the percentage difference from last week, and a progress bar.">
                    <CardHeader className="pb-2">
                        <CardDescription>Estratégia e Gestão</CardDescription>
                        <CardTitle className="text-4xl flex items-center gap-2"><Icon icon="fa-solid:chess-knight" width={24} height={24}/> 70%</CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Progress value={70} aria-label="25% increase" />
                    </CardFooter>
                    </Card>
                    
                    <Card x-chunk="A stats card showing this month's total sales in USD, the percentage difference from last month, and a progress bar.">
                    <CardHeader className="pb-2">
                        <CardDescription>Liderança e Gestão</CardDescription>
                        <CardTitle className="text-4xl flex items-center gap-2"><Icon icon="fa-solid:user-tie" width={24} height={24}/> 20%</CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Progress value={20} aria-label="12% increase" />
                    </CardFooter>
                    </Card>
                    <Card x-chunk="A stats card showing this month's total sales in USD, the percentage difference from last month, and a progress bar.">
                    <CardHeader className="pb-2">
                        <CardDescription>Média Geral</CardDescription>
                        <CardTitle className="text-4xl flex items-center">75%</CardTitle>
                    </CardHeader>
                    </Card>
                </div>
                <Tabs defaultValue="princ">
                    <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                    </div>
                    </div>
                    <TabsContent value="princ">
                    <Card x-chunk="A table of recent orders showing the following columns: Customer, Type, Status, Date, and Amount.">
                        <CardHeader className="px-7">
                            <CardTitle>Tabela das Respotas</CardTitle>
                            <CardDescription>
                                Recent orders from your store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Pergunta</TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                    Pilar
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                    Resposta
                                    </TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                <TableRow className="bg-accent">
                                    <TableCell>
                                    <div className="font-medium">Liam Johnson</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        liam@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Sale
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        Fulfilled
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Olivia Smith</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        olivia@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Refund
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="outline">
                                        Declined
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                {/* <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Liam Johnson</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        liam@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Sale
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        Fulfilled
                                    </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                    2023-06-23
                                    </TableCell>
                                    <TableCell className="text-right">$250.00</TableCell>
                                </TableRow> */}
                                <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Noah Williams</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        noah@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Subscription
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        Fulfilled
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Emma Brown</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        emma@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Sale
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        Fulfilled
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Liam Johnson</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        liam@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Sale
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        Fulfilled
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Olivia Smith</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        olivia@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Refund
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="outline">
                                        Declined
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <div className="font-medium">Emma Brown</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        emma@example.com
                                    </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    Sale
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        Fulfilled
                                    </Badge>
                                    </TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    </TabsContent>
                </Tabs>
                </div>
                <div className="grid gap-2">

                <Card>
        <CardHeader className="pb-4">
            <CardTitle>Filtro de Email</CardTitle>
            <CardDescription>Escolha o Email do respondente</CardDescription>
        </CardHeader>
        <CardContent>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                Filtro
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {/* Search Input */}
                <div className="p-2">
                <Input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                <DropdownMenuSeparator />
                
                {/* Filtered Email List */}
                {filteredEmails.length > 0 ? (
                filteredEmails.map((email, index) => (
                    <DropdownMenuItem key={index}>{email}</DropdownMenuItem>
                ))
                ) : (
                <DropdownMenuItem disabled>Nenhum resultado</DropdownMenuItem>
                )}
            </DropdownMenuContent>
            </DropdownMenu>
        </CardContent>
        </Card>



        <div className="grid gap-3">
        <Card>
        <CardHeader className="items-center pb-4">
            <CardTitle>Gráfico Radar</CardTitle>
            <CardDescription>
            Com os percentuais de acerto por pilar
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
            >
            <RadarChart
                data={chartData}
                margin={{
                top: -40,
                bottom: -10,
                }}
            >
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="total" />
                <PolarGrid />
                <Radar dataKey="Resposta" fill="var(--color-Resposta)" />
                <Radar
                dataKey="Media"
                fill="var(--color-Media)"
                fillOpacity={0.6}
                />
            
                <ChartLegend className="mt-8" content={<ChartLegendContent />} />
            </RadarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 pt-4 text-sm">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
            Pwr Gestão
            </div>
        </CardFooter>
        </Card>   
        </div>
            </div>
            </main>
            </div>
    </div>
    )
}