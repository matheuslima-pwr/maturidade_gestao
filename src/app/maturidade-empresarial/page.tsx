import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center px-4">
      <Form title='Diagnóstico de Maturidade Empresarial' route={'/api/matemp/users'} type='empresarial'/>
    </main>  
  );
}
