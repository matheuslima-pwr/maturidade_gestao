'use client';

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

import { Icon } from "@iconify/react"

import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartConfig
} from "@/components/ui/chart"

import { useEffect, useState } from "react";
import api from "@/app/api";

const chartConfig = {
    Media: {
        label: "Média Geral",
        color: "#444444",
    }, Resposta: {
        label: "Sua Média",
        color: "#ff5b00",
    },
} satisfies ChartConfig

import questions from "@/data/questions.json";
import { AnswerMaturidadeGestao, UserMaturidadeGestao } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserMaturidadeGestao | null>(null);
    const [leads, setLeads] = useState<UserMaturidadeGestao[]>([]);
    const [answers, setAnswers] = useState<AnswerMaturidadeGestao[]>([]);
    const [averageAnswers, setAverageAnswers] = useState<{ grupo: string, media: number }[]>([]);
    const [userAvgAnswers, setUserAvgAnswers] = useState<{ grupo: string, media: string }[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Filter emails based on search query
    const filteredEmails = leads.map((lead) => lead.email).filter((email) => email.includes(searchQuery));

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const leadsResponse = await api.get(`/api/matges/users`);
                const averageResponse = await api.get(`/api/matges/users/answers/average`);
                setLeads(leadsResponse.data);
                setAverageAnswers(averageResponse.data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLeads();
    }, []);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/matges/users/${selectedUser?.id}/answers`);
                const res = await api.get(`/api/matges/users/${selectedUser?.id}/answers/average`);
                setAnswers(response.data);
                setUserAvgAnswers(res.data);
                console.log(res.data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnswers();
    }, [selectedUser]);

    const handleSelectEmail = (email: string) => {
        const selectedLead = leads.find((lead) => lead.email === email);
        setSelectedUser(selectedLead || null);
    };

    const calculateAverage = (answers: { grupo: string, media: string }[]) => {
        return (100 * answers.reduce((acc, curr) => acc + Number(curr.media), 0) / answers.length).toFixed(0);
    }

    const dataset = [
        {
            name: "Estratégia e Gestão",
            Media: 100 * (Number(averageAnswers.find(item => item.grupo === 'Estrategia e Gestao')?.media) || 0),
            Resposta: 100 * (Number(userAvgAnswers.find(item => item.grupo === 'Estrategia e Gestao')?.media) || 0),
            icon: 'fa-solid:chess-knight'
        },
        {
            name: "Financeiro",
            Media: 100 * (Number(averageAnswers.find(item => item.grupo === 'Financeiro')?.media) || 0),
            Resposta: 100 * (Number(userAvgAnswers.find(item => item.grupo === 'Financeiro')?.media) || 0),
            icon: 'hugeicons:coins-dollar'
        },
        {
            name: "Comercial e Vendas",
            Media: 100 * (Number(averageAnswers.find(item => item.grupo === 'Comercial / Vendas')?.media) || 0),
            Resposta: 100 * (Number(userAvgAnswers.find(item => item.grupo === 'Comercial / Vendas')?.media) || 0),
            icon: 'carbon:sales-ops'
        },
        {
            name: "Liderança e Gestão",
            Media: 100 * (Number(averageAnswers.find(item => item.grupo === 'Liderança e Gestão de Pessoas')?.media) || 0),
            Resposta: 100 * (Number(userAvgAnswers.find(item => item.grupo === 'Liderança e Gestão de Pessoas')?.media) || 0),
            icon: 'fa-solid:user-tie'
        }
    ];

    const CustomLegend = (props: { payload: any; }) => {
        const { payload } = props
        return (
            <ul className="flex justify-center space-x-4 mt-4">
                {payload.map((entry: { color: any; payload: { dataKey: string; }; }, index: any) => (
                    <li key={`item-${index}`} className="flex items-center">
                        <span
                            className="w-3 h-3 mr-2"
                            style={{ backgroundColor: entry.payload.dataKey === "Resposta" ? chartConfig.Resposta.color : chartConfig.Media.color }}
                        ></span>
                        <span className="text-sm">{entry.payload.dataKey === "Resposta" ? "Usuário" : "Geral"}</span>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className=" flex-1 flex w-full flex-col bg-muted/50">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                    <div className="grid auto-rows-max items-start gap-4 md:gap-4 lg:col-span-2">
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
                            {dataset.map((data, index) => (
                                loading ? <Skeleton key={index} className="h-[132px] w-full" /> :
                                    <Card key={index} x-chunk={`A stats card showing the value of ${data.name} pillar.`}>
                                        <CardHeader className="pb-2">
                                            <CardDescription>{data.name}</CardDescription>
                                            <CardTitle className="text-4xl flex items-center gap-2"><Icon icon={data.icon} width={24} height={24} />{data.Resposta ? `${data.Resposta}%` : 'N/A'}</CardTitle>
                                        </CardHeader>
                                        <CardFooter>
                                            <Progress value={data.Resposta} aria-label={`${data.Resposta}% of ${data.name} pillar`} />
                                        </CardFooter>
                                    </Card>

                            ))}
                            {loading ? <Skeleton className="h-[132px] w-full" /> :
                                <Card x-chunk="A stats card showing the average value of all pillars">
                                    <CardHeader className="pb-2">
                                        <CardDescription>Média Geral</CardDescription>
                                        <CardTitle className="text-4xl flex items-center">{userAvgAnswers?.length > 0 ? `${calculateAverage(userAvgAnswers)}%` : 'N/A'}</CardTitle>
                                    </CardHeader>
                                </Card>}
                        </div>
                        <Card x-chunk="A table of answers from test." className="max-h-[600px] overflow-y-scroll">
                            <CardHeader className="px-7">
                                <CardTitle>Tabela das Respotas: {selectedUser?.nome}</CardTitle>
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
                                        {questions.map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 max-w-[500px]">
                                                        <div className="flex flex-col">
                                                            <div className="text-sm text-primary">{questions[index]?.content}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    {questions[index]?.pillar}
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    {loading ? <Skeleton className="w-10 h-6" /> :
                                                        answers[index] ?
                                                            <Badge color='#ff5b00'>{answers[index]?.resposta === "yes" ? "Sim" : "Não"}</Badge> :
                                                            <></>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
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
                                                <DropdownMenuItem key={index} onClick={() => handleSelectEmail(email)}>{email}</DropdownMenuItem>
                                            ))
                                        ) : (
                                            <DropdownMenuItem disabled>Nenhum resultado</DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>



                        <div className="grid gap-3">
                            <Card className="">
                                <CardHeader className="items-center pb-4">
                                    <CardTitle>Gráfico Radar</CardTitle>
                                    <CardDescription>
                                        Com os percentuais de acerto por pilar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full aspect-square h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={dataset}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                                                <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }} />
                                                <Radar name="Media" dataKey="Media" stroke="hsl(var(--primary))" fill={chartConfig.Media.color} fillOpacity={0.4} />
                                                <Radar name="Resposta" dataKey="Resposta" stroke="hsl(var(--secondary))" fill={chartConfig.Resposta.color} fillOpacity={0.6} />
                                                <Legend content={<CustomLegend payload={undefined} />} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
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