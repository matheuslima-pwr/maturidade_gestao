interface DevolutivaLayoutProps {
    children: React.ReactNode;
}

export default function DevolutivaLayout({ children }: DevolutivaLayoutProps) {
    return (
        <main className="flex flex-col justify-center items-center">
            {children}
        </main>
    )
}