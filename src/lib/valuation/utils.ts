import sectors from "@/app/demo-valuation/database/sectors.json"
import ranges from "@/app/demo-valuation/database/ranges.json"

type ValuationData = {
    lastYearRevenue: number
    ttmRevenue: number
    lastYearEbitda: number
    ttmEbitda: number
    grossDebt: number
    availability: number
    sectorId: number
}

export const lastYearRange = (data: ValuationData) => {
    const sector = sectors.find(sector => sector.id === data.sectorId)

    if (!sector) return null
    
    const margin = 100 * data.lastYearRevenue / sector.annual_net_revenue;
    
    // Se a margem for maior que 100%, usa o último range (80-100)
    const range = margin > 100 
        ? ranges[ranges.length - 1] 
        : ranges.find(r => margin >= r.inicio && margin <= r.fim);

    if (!range) return null
    return {
        min: (1 - range.piso / 100) * sector.ev_ebitda,
        max: (1 - range.teto / 100) * sector.ev_ebitda
    }
}

export const ttmRange = (data: ValuationData) => {
    const sector = sectors.find(sector => sector.id === data.sectorId)

    if (!sector) return null
    
    const margin = 100 * data.ttmRevenue / sector.annual_net_revenue;
    
    // Se a margem for maior que 100%, usa o último range (80-100)
    const range = margin > 100 
        ? ranges[ranges.length - 1] 
        : ranges.find(r => margin >= r.inicio && margin <= r.fim);

    if (!range) return null
    return {
        min: (1 - range.piso / 100) * sector.ev_ebitda,
        max: (1 - range.teto / 100) * sector.ev_ebitda
    }
}

export const getValuation = (data: ValuationData) => {
    return {
        lastYear: {
            firm: {
                
                min: (data.lastYearEbitda * (lastYearRange(data)?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
                max: (data.lastYearEbitda * (lastYearRange(data)?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
            },
            shareholders: {
                min: (data.lastYearEbitda * (lastYearRange(data)?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
                max: (data.lastYearEbitda * (lastYearRange(data)?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
            }
        },
        ttm: {
            firm: {
                min: (data.ttmEbitda * (ttmRange(data)?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
                max: (data.ttmEbitda * (ttmRange(data)?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
            },
            shareholders: {
                min: (data.ttmEbitda * (ttmRange(data)?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
                max: (data.ttmEbitda * (ttmRange(data)?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
            }
        }
    }
}