import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: string) {
  const d = new Date(date);

  // Formatar a data
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do 0
  const year = d.getFullYear().toString().slice(-2); // Pega os últimos 2 dígitos do ano

  // Formatar a hora
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  // Retornar no formato "dd/MM/yy, hhmm"
  return `${day}/${month}/${year}, ${hours}h${minutes}`;
}

export function formatCurrency(value: string) {
  value = value.replace('.', '');
  let decimalPart = '';

  if(value.length === 0) {
      return '0,00'
  } else if (value.length > 2) {
      decimalPart = ',' + value.slice(-2);
      value = value.slice(0, -2);
  } else {
      decimalPart = ',' + value;
      value = '';
  }

  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separadores de milhar
  return 'R$ ' + value + decimalPart;
}