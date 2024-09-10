'use client';

import Card from "@/components/Card";
import { useState } from "react";

export default function Diagnostico() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <main className="h-full flex flex-col gap-4 p-4">
            {Array.from({ length: 10 }).map((_, index) => (
                <Card key={index}/>
            ))}
            <div className="flex gap-2">
                <button className="bg-[#004477] text-white rounded-md px-4 py-2 mt-4"
                    onClick={() => setCurrentPage(currentPage-1)}
                    disabled={currentPage === 1}
                >Voltar</button>
                {currentPage===1 ? <button className="bg-[#004477] text-white rounded-md px-4 py-2 mt-4"
                    onClick={() => setCurrentPage(currentPage+1)}
                    disabled={currentPage >= 2}
                        >Avançar
                    </button> :
                    <button className="bg-[#004477] text-white rounded-md px-4 py-2 mt-4" disabled>Enviar</button>
                }
            </div>
        </main> 
    )
}