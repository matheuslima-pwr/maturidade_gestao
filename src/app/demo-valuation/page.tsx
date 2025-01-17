import ValuationForm from "@/components/forms/valuation";

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center px-4">
      <ValuationForm 
        title='Formulário de Cadastro' 
        subtitle='Preencha o formulário abaixo para prosseguir com a avaliação da sua empresa.'
        route={'/api/valuation/users'}/>
    </main>  
  );
}
