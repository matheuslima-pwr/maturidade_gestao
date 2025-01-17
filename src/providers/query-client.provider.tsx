'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface QueryClientProviderProps {
    children: React.ReactNode;
}

export default function QueryProvider({ children }: Readonly<QueryClientProviderProps>) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 5 * 60 * 1000, // 5 minutos
                cacheTime: 10 * 60 * 1000, // 10 minutos
                refetchOnMount: true,
            },
        },
    })
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}