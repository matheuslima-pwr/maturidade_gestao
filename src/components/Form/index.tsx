'use client';

import axios from "axios";
import { MouseEvent, useRef, useState } from "react"; 
import './styles.css'
import { useRouter } from "next/navigation";
import { UserDto } from "@/@types/user";

type FormProps = {
    email: string;
    username: string;
    company: string;
    segment: string;
    phone: string;
    invoice: string;
    [key: string]: string; // Add index signature
}

export default function Form() {
    const formRef = useRef<HTMLFormElement>(null);
    const lastYear = new Date().getFullYear() - 1;
    const router = useRouter();
    
    const submitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = formRef.current;

        const body: UserDto = {
            email: form?.email.value,
            nome: form?.nome.value,
            empresa: form?.empresa.value,
            segmento: form?.segmento.value,
            telefone: form?.telefone.value,
            faturamento: form?.faturamento.value
        }

        const res = await axios.post('/api/users', body);
        sessionStorage.setItem('userId', res.data.data.id);
        router.push('/diagnostico');
    }

    const phoneMask = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/)
        if (value) {
            event.target.value = !value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : '')
        }
    }

    const invoiceMask = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
        let decimalPart = '';

        if(value.length === 0) {
            input.value = '';
        } else if (value.length > 2) {
            decimalPart = ',' + value.slice(-2);
            value = value.slice(0, -2);
        } else {
            decimalPart = ',' + value;
            value = '';
        }

        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separadores de milhar
        
        input.value = input.value ? 'R$ ' + value + decimalPart : '';
    }

    return (
        <form ref={formRef} onSubmit={submitInfo} className="flex flex-col p-4 my-10 items-center bg-[#333333] gap-2 rounded-lg">
            <h3 className="text-lg">Cadastre-se</h3>
            <label htmlFor="email"></label>
            <input type="text" id="email" name="email" placeholder="Email" required/>
            <label htmlFor="nome"></label>
            <input type="text" id="nome" name="nome" placeholder="Nome" required/>
            <label htmlFor="empresa"></label>
            <input type="text" id="empresa" name="empresa" placeholder="Empresa" required/>
            <label htmlFor="segmento"></label>
            <input type="text" id="segmento" name="segmento" placeholder="Segmento" required/>
            <label htmlFor="telefone"></label>
            <input type="text" id="telefone" onChange={phoneMask} name="telefone" placeholder="Telefone" required/>
            <label htmlFor="faturamento"></label>
            <input type="text" id="faturamento" onChange={invoiceMask} name="faturamento" placeholder={`Faturamento Anual de ${lastYear}`} required/>
            <button type="submit" className="bg-[#004477] h-12 w-32">Enviar</button>
        </form>  
    );
}