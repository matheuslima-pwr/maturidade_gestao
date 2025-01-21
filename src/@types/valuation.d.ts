export type ValuationDto = {
    availability: string;
    employee: string;
    grossDebt: string;
    lastYearEbitda: string;
    lastYearRevenue: string;
    sector: string;
    ttmEbitda: string;
    ttmRevenue: string;
}

export type ValuationData = {
    lastYearRevenue: number;
    ttmRevenue: number;
    lastYearEbitda: number;
    ttmEbitda: number;
    grossDebt: number;
    availability: number;
    sectorId: number;
    employee: number;
}