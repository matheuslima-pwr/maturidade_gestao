'use client';

import Card from "@/components/Card";
import { useEffect, useState } from "react";
import questions from "@/data/questions.json";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import styles from '@/app/styles/button.module.css';
import api from "@/app/api";
import Swal from "sweetalert2";

interface DiagnosticoProps {
    params: {
        userId: string;
    }
}

export default function Diagnostico({ params }: DiagnosticoProps) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState<{ questionId: number, answer: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [border, setBorder] = useState(false);
    const router = useRouter();
    
    const questionsPerPage = 10;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const { userId } = params;
    
    useEffect(() => {
        if(!userId ) {
            router.push('/');
        } else {
            setLoading(false);
        }
    }, [router]);

    const allAnswersGiven = () => {
        const indexOfLastQuestion = currentPage * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
        const answeredQuestionIds = answers.map(a => a.questionId);
        
        return currentQuestions.every(q => answeredQuestionIds.includes(q.id));
    };

    const handleAnswerChange = (id: number, answer: string) => {
        setAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(a => a.questionId === id);
            
            if (existingAnswerIndex !== -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex].answer = answer;
                return updatedAnswers;
            } else {
                return [...prevAnswers, { questionId: id, answer }];
            }
        });
    };

    const submitAnswers = async () => {
        if(!allAnswersGiven()) {
            setBorder(true);
            toast.warning("Ainda há perguntas sem resposta!", {
                description: "Você deve responder todas as perguntas antes de enviar.",
            })
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: 'Deseja enviar suas respostas?',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2cb25a',
            cancelButtonColor: '#c70000',
            icon: 'question'
        });

        if(isConfirmed) {
            Swal.fire({
                title: 'Enviando respostas...',
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                html: `<div id="loading-container">
                            <img id="loading" src="/img/loading.gif" alt="Loading" />
                        </div>`
            })
            try {
                const body = [
                    ...answers
                ]
                const res = await api.post(`/api/users/${userId}/answers`, body);
                Swal.close();
                router.push(`/${userId}/devolutiva`);
            } catch (error: any) {
                Swal.fire({
                    title: `Erro ${error.response.status}`,
                    text: 'Ocorreu um erro ao enviar suas respostas. Tente novamente mais tarde.',
                    icon: 'error'
                })    
            }
        }
    }

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        let form = document.querySelector('.form');
        form?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleNextPage = () => {
        if(!allAnswersGiven()) {
            setBorder(true);
            toast.warning("Ainda há perguntas sem resposta!", {
                description: "Você deve responder todas as perguntas antes de avançar.",
            })
            return;
        }
        setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        let form = document.querySelector('.form');
        form?.scrollTo({ top: 0, behavior: 'smooth' });
        setBorder(false);
    }

    // const removeAllAnswers = () => {
    //     Swal.fire({
    //         text: 'Deseja limpar todas as respostas?',
    //         showCancelButton: true,
    //         confirmButtonText: 'Limpar',
    //         cancelButtonText: 'Cancelar',
    //         confirmButtonColor: '#004477',
    //         cancelButtonColor: '#004477',
    //         width: '30rem',
    //         icon: 'warning'
    //     }).then(({ isConfirmed }) => {
    //         if(isConfirmed) {
    //             setAnswers([]);
    //         }
    //     });
    //     setAnswers([]);
    // }

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    
    if(loading) return <></>
    return (
        <section className="h-full flex flex-col items-center py-4 px-4 sm:px-4 md:px-8 lg:px-12">
            <header className="mt-1 bg-[#004477] w-full h-12 rounded-t-md flex justify-center items-center">
                <span className="text-md sm:text-md md:text-lg lg:text-lg font-semibold text-gray-200">Diagnóstico de Maturidade Empresarial</span>
            </header>
            <div className="h-96 sm:h-96 md:h-176 overflow-y-scroll flex flex-col gap-4 form">
                {currentQuestions?.map((question, index) => {
                    const answer = answers.find(a => a.questionId === question.id)?.answer || "";
                    return <Card 
                                border={border && !answer ? 'border-2 border-rose-500': ''}
                                key={index} 
                                id={question.id} 
                                body={question.content}
                                onChange={handleAnswerChange}
                                selectedAnswer={answer}
                            />;
                })}
            </div>
            <div className="flex justify-between w-full mt-4 items-center">
                <div className="flex justify-start gap-2">
                    <button className={styles.button}
                        onClick={handlePreviousPage}
                        disabled={currentPage <= 1}
                    >Voltar</button>
                    {currentPage === totalPages ? 
                        <button 
                        className={styles.button}
                        onClick={submitAnswers}>Enviar</button>
                        :
                        <button className={styles.button} 
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages}
                        >Próximo
                        </button> 
                    }
                </div>
                {/* <button className="text-slate-500 mr-2" onClick={removeAllAnswers}>Limpar</button> */}
            </div>
            <span className="text-sm text-gray-500 my-2">Página {currentPage} de {totalPages}</span>
        </section>
    )
}