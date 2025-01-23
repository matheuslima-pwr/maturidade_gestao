'use client';

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

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
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { AutoComplete } from "@/components/AutoComplete";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    const [selectedUser, setSelectedUser] = useState<UserMaturidadeGestao | null>(null);
    const [leads, setLeads] = useState<UserMaturidadeGestao[]>([]);
    const [answers, setAnswers] = useState<AnswerMaturidadeGestao[]>([]);
    const [averageAnswers, setAverageAnswers] = useState<{ grupo: string, media: number }[]>([]);
    const [userAvgAnswers, setUserAvgAnswers] = useState<{ grupo: string, media: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const [leadsResponse, averageResponse] = await Promise.all([
                    api.get(`/api/matges/users`),
                    api.get(`/api/matges/users/answers/average`)
                ])
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
                if (!selectedUser) return;
                const [response, res] = await Promise.all([
                    api.get(`/api/matges/users/${selectedUser?.id}/answers`),
                    api.get(`/api/matges/users/${selectedUser?.id}/answers/average`)
                ])
                setAnswers(response.data);
                setUserAvgAnswers(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnswers();
    }, [selectedUser]);

    const handleSelectEmail = (id: string) => {
        const selectedLead = leads.find((lead) => lead.id === id);
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
        },
        {
            name: "Jurídico",
            Media: 100 * (Number(averageAnswers.find(item => item.grupo === 'Jurídico')?.media) || 0),
            Resposta: 100 * (Number(userAvgAnswers.find(item => item.grupo === 'Jurídico')?.media) || 0),
            icon: 'fa-solid:balance-scale'
        },
    ];

    const CustomLegend = (props: { payload: { color: string; payload: { dataKey: string; }; }[] }) => {
        const { payload } = props
        return (
            <ul className="flex justify-center space-x-4 mt-4">
                {payload.map((entry, index) => (
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
        <div className=" flex-1 flex w-full flex-col bg-background">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Button onClick={() => router.push('/admin/forms')} className="mx-6 flex items-center w-min gap-2 bg-[#004477] text-white hover:bg-[#004477]/80">
                    <Undo2 size={20} />
                    Voltar para seleção
                </Button>
                <main className="flex items-start gap-4 sm:px-6 sm:py-0">
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex gap-4">
                            {dataset.map((data, index) => (
                                loading ? <Skeleton key={index} className="h-[132px] w-[150px]" /> :
                                    <Card key={index} className="bg-gray-100">
                                        <CardHeader className="pb-2">
                                            <CardDescription>{data.name}</CardDescription>
                                            <CardTitle className="text-4xl flex items-center gap-2">
                                                <Icon icon={data.icon} width={24} height={24} />{data.Resposta ? `${data.Resposta}%` : 'N/A'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardFooter>
                                            <Progress value={data.Resposta} aria-label={`${data.Resposta}% of ${data.name} pillar`} />
                                        </CardFooter>
                                    </Card>

                            ))}
                            {loading ?
                                <Skeleton className="h-[132px] w-[150px]" /> :
                                <Card className="bg-gray-100">
                                    <CardHeader className="pb-2">
                                        <CardDescription>Média Geral</CardDescription>
                                        <CardTitle className="text-4xl flex items-center">{userAvgAnswers?.length > 0 ? `${calculateAverage(userAvgAnswers)}%` : 'N/A'}</CardTitle>
                                    </CardHeader>
                                </Card>
                            }
                        </div>

                        <Card className="flex-1">
                            <CardHeader className="px-7">
                                <CardTitle className="text-black">Tabela das Respostas: {selectedUser?.nome}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col h-[472px] overflow-hidden">
                                    <div className="bg-black/80 sticky top-0 z-10">
                                        <Table>
                                            <TableHeader className="bg-black/80">
                                                <TableRow>
                                                    <TableHead className="w-[60%] text-white">Pergunta</TableHead>
                                                    <TableHead className="w-[30%] text-white">
                                                        Pilar
                                                    </TableHead>
                                                    <TableHead className="w-[10%] text-white">
                                                        Resposta
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                        </Table>
                                    </div>
                                    <div className="flex-1 overflow-auto">
                                        <Table>
                                            <TableBody>
                                                {questions.map((_, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-100">
                                                        <TableCell className="w-[60%]">
                                                            <div className="flex items-center gap-2 max-w-[80%]">
                                                                <div className="flex flex-col">
                                                                    <div className="text-sm text-foreground">{questions[index]?.content}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="w-[30%] font-bold">
                                                            {questions[index]?.pillar}
                                                        </TableCell>
                                                        <TableCell className="w-[10%] text-center">
                                                            {loading ? <Skeleton className="w-10 h-6" /> :
                                                                answers[index] ?
                                                                    <Badge className={cn("text-white", answers[index]?.resposta === "yes" ? "bg-[#2CB25A]" : "bg-[#A51B1B]")}>
                                                                        {answers[index]?.resposta === "yes" ? "Sim" : "Não"}
                                                                    </Badge> :
                                                                    <></>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-start-3 row-start-2 row-span-4">
                        <div className="flex flex-col gap-4">
                            <Card className="max-h-[132px]">
                                <CardHeader className="pb-2">
                                    <CardTitle>Filtro de Email</CardTitle>
                                    <CardDescription className="text-gray-600">Escolha o Email do respondente</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AutoComplete
                                        options={leads.map((lead) => ({ label: lead.email, value: lead.id }))}
                                        onValueChange={(option) => handleSelectEmail(option.value)}
                                        placeholder="Digite o email..."
                                        emptyMessage="Email não encontrado"
                                        visibleItemsCount={5}
                                    />
                                </CardContent>
                            </Card>

                            <div className="gap-3">
                                <Card >
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
                                                    <Legend content={<CustomLegend payload={[]} />} />
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
                    </div>
                </main>
            </div >
        </div >
    )
}