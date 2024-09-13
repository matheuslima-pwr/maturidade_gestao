'use client'

import { redirect } from 'next/navigation'; // para redirecionar de forma server-side
import Swal from 'sweetalert2';
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
                Sua empresa está em um nível crítico de maturidade em gestão. 
                É como conduzir um barco à deriva ou um carro sem painel, sem
                conseguir tomar decisões estratégicas fundamentais para a
                prosperidade do seu negócio.<br/><br/>
                Seu cenário de <strong>planejamento e execução</strong> apresenta falhas que
                impactam todos os setores da empresa: financeiro, comercial e de
                pessoas.<br/><br/>
                Recomendamos uma <strong>análise detalhada</strong> para diagnosticar os pontos
                de melhoria e a criação de um plano de ação focado na estruturação
                dos pilares básicos de gestão, permitindo que você saia dessa Zona
                Crítica.<br/><br/>
            </>
        ),
        min: 0,
        max: 5
    },
    {
        id: 2,
        name: "Zona de Aperfeiçoamento",
        description: (
            <>
                Sua empresa iniciou a estruturação dos <strong>pilares básicos de gestão</strong>, 
                mas ainda enfrenta desafios na execução de rotinas consolidadas de melhoria contínua
                para garantir sua saúde.<br/><br/>
                Neste ponto, é importante <strong>analisar as pessoas da empresa</strong> 
                e compreender se elas serão capazes de ajudar a dar novos passos em direção à evolução.
                Muitas vezes, o empreendedor enfrenta dificuldades ao tentar gerar inovações com as 
                mesmas pessoas, cujo potencial pode ser limitado.<br/><br/>
                Recomendamos também <strong>revisar as rotinas de gestão</strong> 
                para garantir discussões e debates que gerem mais planos de melhoria de maneira contínua e progressiva.<br/><br/>
            </>
        ),
        min: 6,
        max: 10
    },
    {
        id: 3,
        name: "Zona de Qualidade",
        description: ( 
            <>
                Seu negócio apresenta
                bases intermediárias de gestão, permitindo
                acessar dados que possibilitam tomar decisões satisfatórias em
                algumas áreas.<br/><br/>
                Neste estágio, é comum que os setores da empresa estejam em <strong>diferentes níveis de maturidade</strong>. 
                Cabe ao líder buscar ajuda para identificar e priorizar as áreas que mais necessitam de atenção no
                momento atual.<br/><br/>
                Recomendamos buscar <strong>visões estratégicas</strong> externas para "forçar” a
                gestão a continuar evoluindo. Por estar em um nível intermediário, é
                fácil acreditar que já se alcançou um bom patamar e acabar perdendo
                diversas oportunidades de mercado. Isso ocorre, muitas vezes, devido
                à falta de maturidade na interpretação dos dados disponíveis.<br/><br/>
            </>
        ),
        min: 11,
        max: 15
    },
    {
        id: 4,
        name: "Zona de Excelência",
        description: (
            <>
                Seu negócio já apresenta pontos avançados de gestão,
                compreendendo a importância do planejamento estratégico, da
                gestão comercial, de finanças e de pessoas, além de demonstrar um
                time alinhado com os objetivos da empresa.<br/><br/>
                Agora, o desafio é focar na <strong>inovação de produtos, serviços, estrutura
                e processos</strong>, garantindo que a empresa continue crescendo e não
                estagne no mercado.<br/><br/>
                Existe a armadilha de acreditar que "está tudo bem" e que nenhuma
                ajuda é necessária para prosperar. No entanto, é justamente neste
                estágio que grandes empresas consolidam suas histórias. Elas buscam <strong>capacitações técnicas adicionais</strong>, realizam <strong>melhorias
                organizacionais profundas</strong> e promovem o apri<strong>moramento contínuo
                de seu time de gestão</strong>.<br/><br/>
                Recomendamos que você revisite a Formação de Lideranças da sua
                empresa, garantindo que a próxima geração do negócio seja tão forte
                e competente quanto a primeira, permitindo que a trajetória da
                empresa continue próspera.<br/><br/>
            </>
        ),
        min: 16,
        max: 20
    }
];

const getZoneInfo = (value: number): Zone => {
    for (const zone of zones) {
        if (value >= zone.min && value <= zone.max) {
            return zone;
        }
    }
    return zones[0];
}

export default function Devolutiva({ params }: DevolutivaProps) {
    const [zone, setZone] = useState<Zone>({ id: 0, name: '', description: <></>, min: 0, max: 0 });
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);

    const { userId } = params;
    const whatsapp = 'https://api.whatsapp.com/send/?phone=5585991636298&text=Quero+entender+meu+nivel+de+maturidade+em+gestao&type=phone_number&app_absent=0'
    
    if (!userId) {
        redirect('/');
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/users/${userId}/zone`);
                setValue(res.data);
                setZone(getZoneInfo(value));
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [userId]);

    const data = [{
        target: 20 - Number(value),
        zone: Number(value)
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
                                Você preencheu o diagnóstico de maturidade em gestão da PWR Gestão.<br/>Suas respostas apontam que seu negócio está na:
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
                    <p className="text-sm sm:text-base lg:text-lg sm:mb-4 md:mb-6 lg:mb-8">
                        {`Que tal passar no Stand da PWR Gestão para tomar um café e
                        discutir com um especialista um plano de ação para potencializar o
                        estado atual da sua empresa?
                        `}
                    </p>
                    <div className="w-full text-white rounded-lg h-auto bg-[#004477] px-2 py-3 sm:px-4 sm:py-4 mt-4 text-center z-10">
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
        </section>
    );
}
