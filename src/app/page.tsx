'use client'

import api from "@/app/api";
import { useRef } from "react";
import { UserDto } from "@/@types/user";
import styles from '@/app/styles/input.module.css';
import Swal from 'sweetalert2'

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const lastYear = new Date().getFullYear() - 1;

  const submitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { isConfirmed } = await Swal.fire({
      title: 'Termos de Uso',
      html: `
            <span>
                <p>
                    Para continuar, você precisa aceitar nossos termos de uso.<br/>
                    Para acessá-los clique <a href="/termos" target="_blank" style="color: #2563eb;">aqui</a>
                </p>
            </span>`,
      icon: 'warning',
      width: '550px',
      showCancelButton: true,
      confirmButtonText: 'Aceitar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#004477',
      cancelButtonColor: '#c70000',
    })

    if (isConfirmed) {
      Swal.fire({
        title: 'Enviando dados...',
        html: `<div id="loading-container">
                            <img id="loading" src="/img/loading.gif" alt="Carregando..."/>
                        </div>`,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        showCloseButton: false,
      })

      try {
        const form = formRef.current;
        const body: UserDto = {
          email: form?.email.value,
          nome: form?.nome.value,
          cargo: form?.cargo.value,
          empresa: form?.empresa.value,
          segmento: form?.segmento.value,
          telefone: form?.telefone.value,
          faturamento: form?.faturamento.value
        }
        await api.post('/api/users', body);
        Swal.fire({
          title: 'Sucesso',
          text: 'Seus dados foram cadastrados com sucesso!',
          icon: 'success'
        })
      } catch (error) {
        Swal.fire({
          title: `Erro`,
          text: 'Ocorreu um erro ao cadastrar seus dados. Tente novamente mais tarde.',
          icon: 'error'
        })
      }
    }
  }

  const phoneMask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/)
    if (value) {
      event.target.value = !value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : '')
    }
  }

  const invoiceMask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
    let decimalPart = '';

    if (value.length === 0) {
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
    <main className="h-full flex flex-col items-center px-4">
      <div className="w-full max-w-[650px] mx-auto mt-8 sm:mt-8 md:mt-12 lg:mt-12 shadow-md shadow-form-shadow rounded-2xl py-8 px-4 sm:px-4 md:px-12 lg:mx-16 bg-form">
        <form ref={formRef} onSubmit={submitInfo} className="flex flex-col gap-2 items-center">
          <h1 className="text-xl sm:text-2xl md:text-xl lg:text-3xl text-form-foreground mb-4">Cadastro de Usuário</h1>
          <input className={styles.input} type="email" id="email" name="email" placeholder="Email" required />
          <label htmlFor="email"></label>
          <input className={styles.input} type="text" id="nome" name="nome" placeholder="Nome" required />
          <label htmlFor="nome"></label>
          <input className={styles.input} type="text" id="cargo" name="cargo" placeholder="Cargo" required />
          <label htmlFor="cargo"></label>
          <input className={styles.input} type="text" id="empresa" name="empresa" placeholder="Empresa" required />
          <label htmlFor="empresa"></label>
          <input className={styles.input} type="text" id="segmento" name="segmento" placeholder="Segmento" required />
          <label htmlFor="segmento"></label>
          <input className={styles.input} type="text" id="telefone" onChange={phoneMask} name="telefone" placeholder="Telefone" required />
          <label htmlFor="telefone"></label>
          <input className={styles.input} type="text" id="faturamento" onChange={invoiceMask} name="faturamento" placeholder={`Faturamento Anual de ${lastYear}`} required />
          <label htmlFor="faturamento"></label>
          <button type="submit" className="bg-[#004477] h-12 w-[60%] text-white rounded-md hover:bg-[#003366]">Enviar</button>
        </form>
      </div>
    </main>
  );
}
