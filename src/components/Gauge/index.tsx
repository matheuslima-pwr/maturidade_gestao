"use client"

import { Globe, Phone } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

export const description = "Excelency zone gauge chart"

const chartConfig = {
  target: {
    label: "target",
    color: "#5686ab",
  },
  zone: {
    label: "zone",
    color: "#004477",
  },
} satisfies ChartConfig

interface GaucheProps {
    data: {
        target: number
        zone: number
    }[]
    title: string
    description: string | JSX.Element
}

export default function Gauche({ data, title, description }: GaucheProps) {
  
    const result = data[0].zone
    const whatsapp = 'https://api.whatsapp.com/send/?phone=5585991636298&text=Quero+entender+meu+nivel+de+maturidade+em+gestao&type=phone_number&app_absent=0'
    return (
        <Card className="flex flex-col m-2 sm:m-4 md:m-6 lg:m-8 sm:w-full md:max-w-[620px]">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    <div className="text-center flex flex-col gap-4 sm:gap-6 lg:gap-8">
                        <span className="font-normal leading-normal text-sm sm:text-base lg:text-lg">
                            Você preencheu o diagnóstico de maturidade em gestão da PWR Gestão.<br/>Suas respostas apontam que seu negócio está na:
                        </span>
                        <span className="text-[#ff5900] text-2xl sm:text-3xl lg:text-4xl">
                            {title}
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0 mt-[-8px]">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full mt-4 max-w-[180px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] sm:mt-0 md:mt-[-8px] lg:mt-[-16px]"
                >
                    <RadialBarChart
                        data={data}
                        endAngle={180}
                        innerRadius={70}
                        outerRadius={160}
                    >
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}/>
                        <RadialBar
                            dataKey="target"
                            stackId="a"
                            fill="var(--color-target)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="zone"
                            fill="var(--color-zone)"
                            stackId="a"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col mt-[-36px] sm:mt-[-48px] md:mt-[-64px] lg:mt-[-92px]">
                <p className="text-sm sm:text-base lg:text-lg">{description}</p>
                <p className="text-sm sm:text-base lg:text-lg sm:mb-4 md:mb-6 lg:mb-8">
                    {`Que tal passar no Stand da PWR Gestão para tomar um café e
                    discutir com um especialista um plano de ação para potencializar o
                    estado atual da sua empresa?
                    `}
                </p>
                <div className="w-full text-white rounded-lg h-auto bg-[#004477] px-2 py-3 sm:px-4 sm:py-4 mt-4 text-center hidden sm:block">
                    <p className="text-center text-base sm:text-lg lg:text-xl font-semibold mb-2">
                        Agende sua devolutiva hoje mesmo!
                    </p>
                    <div className="inline-flex items-center text-sm sm:text-base lg:text-lg">
                        <Phone size={18} color="#ff5900"/><a href={whatsapp} target='_blank' className="mr-8 ml-2">(85) 9 9163-6298</a>
                    </div>
                    <div className="inline-flex items-center text-sm sm:text-base lg:text-lg">
                        <Globe size={18} color="#ff5900"/><a href="https://pwrgestao.com" target="_blank" className="ml-2">www.pwrgestao.com.br</a>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
