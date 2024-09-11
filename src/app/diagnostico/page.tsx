'use client';

import Card from "@/components/Card";
import { useState } from "react";
import questions from "@/data/questions.json";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export default function Diagnostico() {
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState<{ id: number, answer: string }[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    const questionsPerPage = 10;
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    const handleAnswerChange = (id: number, answer: string) => {
        setAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(a => a.id === id);
            
            if (existingAnswerIndex !== -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex].answer = answer;
                return updatedAnswers;
            } else {
                return [...prevAnswers, { id, answer }];
            }
        });
    };

    const submitAnswers = async () => {
        const userId = sessionStorage.getItem('userId');
        const body = {
            answers
        }
        console.log(body)
        // const res = await axios.post(`/api/users/${userId}/answers`, body);
        router.push('/devolutiva');
    }

    const allAnswersGiven = () => {
        const indexOfLastQuestion = currentPage * questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
        const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
        const answeredQuestionIds = answers.map(a => a.id);
        
        return currentQuestions.every(q => answeredQuestionIds.includes(q.id));
    };

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    return (
        <section className="h-full flex flex-col items-center gap-4 py-4 px-8">
            <header className="mt-1 bg-[#004477] w-full h-12 rounded-md flex justify-center items-center">
                <span className="text-lg font-semibold">Questionário de Diagnóstico de Gestão</span>
            </header>
            <div className="max-h-160 overflow-y-scroll flex flex-col gap-4 ">
                {currentQuestions?.map((question, index) => {
                    return <Card 
                            key={index} 
                            id={question.id} 
                            body={question.content}
                            onChange={handleAnswerChange}
                            />;
                })}
            </div>
            <div className="flex justify-start gap-2 w-full">
                <button className="bg-[#004477] text-white rounded-md px-4 py-2"
                    onClick={() => setCurrentPage(currentPage-1)}
                    disabled={currentPage === 1}
                >Voltar</button>
                {currentPage === totalPages ? 
                    <button 
                    className="bg-primary text-white rounded-md px-4 py-2"
                    onClick={submitAnswers}>Enviar</button>
                    :
                    <button className="bg-primary text-white rounded-md px-4 py-2" 
                        onClick={() => {
                            if(allAnswersGiven()) {
                                setCurrentPage(currentPage + 1);
                            } else {
                                toast.warning("Responda as perguntas!", {
                                    description: "Você deve responder todas as perguntas antes de avançar.",
                                })
                            }
                        }}
                        disabled={currentPage >= totalPages}
                    >Avançar
                    </button> 
                }
            </div>
        </section>
    )
}