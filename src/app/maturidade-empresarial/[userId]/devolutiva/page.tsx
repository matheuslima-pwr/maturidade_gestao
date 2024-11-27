'use client'

import { redirect } from 'next/navigation'; // para redirecionar de forma server-side
import api from '@/app/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Phone } from 'lucide-react';
import Gauche from '@/components/Gauge';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Zone = {
    id: number;
    name: string;
    description: JSX.Element;
    min: number;
    max: number;
}

interface DevolutivaProps {
    params: {
        userId: string;
    }
}

const zones: Zone[] = [
    {
        id: 1,
        name: "Zona Crítica",
        description: (
            <>
                
            </>
        ),
        min: 0,
        max: 1
    },
    {
        id: 2,
        name: "Zona de Aperfeiçoamento",
        description: (
            <>
                
            </>
        ),
        min: 2,
        max: 3
    },
    {
        id: 3,
        name: "Zona de Qualidade",
        description: ( 
            <>
               
            </>
        ),
        min: 4,
        max: 5
    },
    {
        id: 4,
        name: "Zona de Excelência",
        description: (
            <>
                
            </>
        ),
        min: 6,
        max: 7
    }
];


export default function Devolutiva({ params }: DevolutivaProps) {
    const [zone, setZone] = useState<Zone>({ id: 0, name: '', description: <></>, min: 0, max: 0 });
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);

    const { userId } = params;
    const whatsapp = 'https://api.whatsapp.com/send/?phone=5585981553698&text=Quero+entender+meu+nivel+de+maturidade+empresarial&type=phone_number&app_absent=0'
    
    if (!userId) {
        redirect('/');
    }

    const getZoneInfo = (value: number) => {
        for (const zone of zones) {
            if (value >= zone.min && value <= zone.max) {
                setZone(zone);
                return;
            }
        }
        setZone(zones[0]);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/matemp/users/${userId}/zone`);
                setValue(res.data);
                getZoneInfo(res.data);                
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [userId]);

    const data = [{
        target: 7 - value,
        zone: value
    }]

    if(loading) {
        return (
        <div className="w-full max-w-[620px] h-[90vh] bg-white relative overflow-hidden rounded-xl m-2 sm:m-4 md:m-6 lg:m-8">
                    <Skeleton className="h-full w-full rounded-xl animate-pulse" />
        </div>
    )}

    return (
        <section>
            <Card className="flex flex-col m-2 sm:m-4 md:m-6 lg:m-8 sm:w-full md:max-w-[620px] bg-[#f9f9f9] relative">
                <CardHeader className="items-center pb-0">
                    <CardTitle>
                        <div className="text-center flex flex-col gap-4 sm:gap-6 lg:gap-8">
                            <span className="font-normal leading-normal text-sm sm:text-base lg:text-lg">
                                Você preencheu o diagnóstico de maturidade empresarial da PWR Gestão.<br/>
                                Sua nota foi de <strong>{value} pontos</strong>.<br/>
                                Suas respostas apontam que seu negócio está na:
                            </span>
                            <span className="text-[#ff5900] text-2xl sm:text-3xl lg:text-4xl">
                                {zone.name}
                            </span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 items-center pb-0 mt-[-8px]">
                    <Gauche data={data}/>
                </CardContent>
                <CardFooter className="flex flex-col mt-[-36px] sm:mt-[-48px] md:mt-[-64px] lg:mt-[-92px]">
                    <p className="text-sm sm:text-base lg:text-lg">{zone.description}</p>
                    <div className="w-full text-white rounded-lg h-auto bg-[#004477] px-2 py-3 sm:px-4 sm:py-4 mt-4 text-center z-10">
                        <p className="text-center text-base sm:text-lg lg:text-xl font-semibold mb-2">
                            Agende sua devolutiva hoje mesmo!
                        </p>
                        <div className="inline-flex items-center text-sm sm:text-base lg:text-lg">
                            <Phone size={18} color="#ff5900"/><a href={whatsapp} target='_blank' className="mr-8 ml-2">(85) 9 8155-3698</a>
                        </div>
                        <div className="inline-flex items-center text-sm sm:text-base lg:text-lg">
                            <Globe size={18} color="#ff5900"/><a href="https://pwrgestao.com" target="_blank" className="ml-2">www.pwrgestao.com.br</a>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </section>
    );
}
