import { PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
}

export default function Gauche({ data }: GaucheProps) {
    return (
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
                    isAnimationActive={false}
                    dataKey="target"
                    stackId="a"
                    fill="var(--color-target)"
                    className="stroke-transparent stroke-2"
                />
                <RadialBar
                    isAnimationActive={false}
                    dataKey="zone"
                    fill="var(--color-zone)"
                    stackId="a"
                    className="stroke-transparent stroke-2"
                />
            </RadialBarChart>
        </ChartContainer>
    )
}