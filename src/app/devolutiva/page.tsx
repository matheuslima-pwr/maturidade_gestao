'use client'

import Gauge from "@/components/Gauge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/app/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Zone = {
    id: number;
    name: string;
    description: JSX.Element;
    min: number;
    max: number;
}

export default function Devolutiva() {
    const [value, setValue] = useState(0);
    const [zone, setZone] = useState<Zone>({ id: 0, name: "", description: <></>, min: 0, max: 0 });
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    const zones = [
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
                </>),
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
                </>),
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
                </>),
            min: 11,
            max: 15
        },
        {
            id: 4,
            name: "Zone de Excelência",
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
                </>),
            min: 16,
            max: 20
        }
    ]

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
        const fetchZone = async () => {
            const userId = sessionStorage.getItem('userId');
            if(!userId) {
                router.push('/');
                return;
            }
            try {
                const res = await api.get(`/api/users/${userId}/zone`);
                setValue(res.data);
                setAuthorized(true);
                getZoneInfo(res.data)
                setLoading(false);
            } catch (error) {
                const { isConfirmed } = await Swal.fire({
                    title: 'Erro',
                    text: 'Ocorreu um erro ao buscar a zona do usuário. Tente novamente mais tarde.',
                    icon: 'error'
                })
                if(isConfirmed) {
                    sessionStorage.removeItem('userId');
                    router.push('/');
                }
            }
        }
        fetchZone();
    }, [router]);

    if(!authorized) return <></>

    if(loading) {
        return (
        <div className="w-[620px] h-[90vh] bg-white relative overflow-hidden rounded-xl mt-8">
                    <Skeleton className="h-full w-full rounded-xl animate-pulse" />
        </div>
        )}
    return (
        <section>
            <Gauge 
                title={zone.name}
                description={zone.description}
                data={[{
                    target: 20 - Number(value),
                    zone: Number(value)
            }]}/>
        </section>
        
    )
}