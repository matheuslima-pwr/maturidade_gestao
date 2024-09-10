'use client';

import axios from "axios";
import { MouseEvent, useRef } from "react"; 
import './styles.css'
import { useRouter } from "next/navigation";

export default function Form() {
    const formRef = useRef<HTMLFormElement>(null);
    const lastYear = new Date().getFullYear() - 1;
    const router = useRouter();
    
    const submitInfo = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const form = formRef.current;

        const body = {
            email: form?.email.value,
            name: form?.username.value,
            company: form?.company.value,
            segment: form?.segment.value,
            phone: form?.phone.value,
            invoice: form?.invoice.value
        }

        const res = await axios.post('/api/users', body);
        router.push('/diagnostico');
    }

    return (
        <form ref={formRef} className="flex flex-col p-4 my-10 items-center bg-[#333333] gap-2 rounded-lg">
            <h3 className="text-lg">Cadastre-se</h3>
            <label htmlFor="email"></label>
            <input type="text" id="email" name="email" placeholder="Email"/>
            <label htmlFor="username"></label>
            <input type="text" id="username" name="username" placeholder="Nome"/>
            <label htmlFor="company"></label>
            <input type="text" id="company" name="company" placeholder="Empresa"/>
            <label htmlFor="segment"></label>
            <input type="text" id="segment" name="segment" placeholder="Segmento"/>
            <label htmlFor="phone"></label>
            <input type="text" id="phone" name="phone" placeholder="Telefone"/>
            <label htmlFor="invoice"></label>
            <input type="text" id="invoice" name="invoice" placeholder={`Faturamento Anual de ${lastYear}`}/>
            <button type="submit" onClick={submitInfo} className="bg-[#004477] h-12 w-32">Enviar</button>
        </form>  
    );
}