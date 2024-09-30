
interface DiagnosticoLayoutProps {
    children: React.ReactNode;
}

export default function DiagnosticoLayout({ children }: DiagnosticoLayoutProps) {
    return (
        <main className="flex flex-col justify-center items-center">
            {children}
        </main>
    )
}