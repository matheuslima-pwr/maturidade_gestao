import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import sectors from '@/app/demo-valuation/database/sectors.json';
import { lastYearRange, ttmRange } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generatePdf = (data: any) => {
    const sector = sectors.find((sector) => sector.id === data.sectorId)
    if (!sector) return null

    pdfMake.vfs = pdfFonts.vfs;
    const docDefinition = {
        pageOrientation: 'landscape',
        content: [
            {
                text: "Resultado da Avaliação",
                bold: true,
                fontSize: 18,
            },
            { text: " ", margin: [0, 4, 0, 4] },
            {
                table: {
                    widths: ["52%", "16%", "16%", "16%"],
                    heights: [20, 20, 20, 20],
                    body: [
                        [
                            { text: "", bold: true, color: '#ffffff', margin: [0, 6] },
                            { text: "Mercado", bold: true, color: '#ffffff', margin: [0, 6] },
                            { text: "Sua Empresa", bold: true, color: '#ffffff', margin: [0, 6] },
                            { text: "Comparação", bold: true, color: '#ffffff', margin: [0, 6] },
                        ],
                        [
                            { text: "Receita Líquida / Colaborador / Mês:", bold: true, margin: [0, 6] },
                            { text: `R$ ${Math.round(sector.monthly_net_revenue_per_employee).toLocaleString("pt-BR")}`, margin: [0, 6] },
                            { text: `R$ ${Math.round(data.ttmRevenue / data.employee / 12).toLocaleString("pt-BR")}`, margin: [0, 6] },
                            { text: data.ttmRevenue / data.employee / 12 > sector.monthly_net_revenue_per_employee ? "Acima do Mercado" : "Abaixo do Mercado", margin: [0, 6] },
                        ],
                        [
                            { text: "Média de Receita Líquida Anual X Receita Líquida do Último Ano:", bold: true, margin: [0, 6] },
                            { text: sector.annual_net_revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), margin: [0, 6] },
                            { text: data.lastYearRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), margin: [0, 6] },
                            { text: data.lastYearRevenue > sector.annual_net_revenue ? "Acima do Mercado" : "Abaixo do Mercado", margin: [0, 6] },
                        ],
                        [
                            { text: "Média de Receita Líquida Anual X Receita Líquida dos Últimos 12 Meses:", bold: true, margin: [0, 6] },
                            { text: sector.annual_net_revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), margin: [0, 6] },
                            { text: data.ttmRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }), margin: [0, 6] },
                            { text: data.ttmRevenue > sector.annual_net_revenue ? "Acima do Mercado" : "Abaixo do Mercado", margin: [0, 6] },
                        ],
                    ],
                },

                layout: {
                    fillColor: (rowIndex: number) => {
                        return rowIndex === 0 ? '#333333' : '#ffffff'
                    },
                    vLineWidth: () => 0,
                    hLineWidth: () => 1,
                },
            },
            { text: " ", margin: [0, 4, 0, 4] },
            {
                table: {
                    widths: ["52%", "24%", "24%"],
                    heights: [20, 20, 20, 20],
                    body: [
                        // Cabeçalho com cor de fundo e texto
                        [
                            { text: "Avaliação do Último Ano", bold: true, color: "#FFFFFF", margin: [0, 6] },
                            { text: "Mínimo", bold: true, color: "#FFFFFF", margin: [0, 6] },
                            { text: "Máximo", bold: true, color: "#FFFFFF", margin: [0, 6] },
                        ],
                        // Linhas do corpo
                        [
                            { text: "Múltiplo Aplicado:", bold: true, color: "#333333", margin: [0, 6] },
                            { text: lastYearRange(data)?.min.toFixed(1), color: "#333333", margin: [0, 6] },
                            { text: lastYearRange(data)?.max.toFixed(1), color: "#333333", margin: [0, 6] },
                        ],
                        [
                            { text: "Valor da Firma:", bold: true, color: "#333333", margin: [0, 6] },
                            {
                                text: (data.lastYearEbitda * (lastYearRange(data)?.min ?? 0)).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }),
                                margin: [0, 6]
                            },
                            {
                                text: (data.lastYearEbitda * (lastYearRange(data)?.max ?? 0)).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }),
                                margin: [0, 6]
                            },
                        ],
                        [
                            { text: "Valor para Acionistas:", bold: true, color: "#333333", margin: [0, 6] },
                            {
                                text: (
                                    data.lastYearEbitda * (lastYearRange(data)?.min ?? 0) -
                                    data.grossDebt +
                                    data.availability
                                ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }),
                                margin: [0, 6]
                            },
                            {
                                text: (
                                    data.lastYearEbitda * (lastYearRange(data)?.max ?? 0) -
                                    data.grossDebt +
                                    data.availability
                                ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }), // Vermelho
                                margin: [0, 6]
                            },
                        ],
                    ],
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        return rowIndex === 0 ? '#333333' : '#ffffff'
                    },
                    vLineWidth: () => 0,
                    hLineWidth: () => 1,
                },
            },
            { text: " ", margin: [0, 4, 0, 4] },
            {
                table: {
                    widths: ["52%", "24%", "24%"],
                    heights: [20, 20, 20, 20],
                    body: [
                        // Cabeçalho com cor de fundo e texto
                        [
                            { text: "Avaliação dos Últimos 12 Meses", bold: true, color: "#FFFFFF", margin: [0, 6] },
                            { text: "Mínimo", bold: true, color: "#FFFFFF", margin: [0, 6] },
                            { text: "Máximo", bold: true, color: "#FFFFFF", margin: [0, 6] },
                        ],
                        // Linhas do corpo
                        [
                            { text: "Múltiplo Aplicado:", bold: true, color: "#333333", margin: [0, 6] },
                            { text: ttmRange(data)?.min.toFixed(1), color: "#333333", margin: [0, 6] },
                            { text: ttmRange(data)?.max.toFixed(1), color: "#333333", margin: [0, 6] },
                        ],
                        [
                            { text: "Valor da Firma:", bold: true, color: "#333333", margin: [0, 6] },
                            {
                                text: (data.ttmEbitda * (ttmRange(data)?.min ?? 0)).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }),
                                margin: [0, 6]
                            },
                            {
                                text: (data.ttmEbitda * (ttmRange(data)?.max ?? 0)).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }),
                                margin: [0, 6]
                            },
                        ],
                        [
                            { text: "Valor para Acionistas:", bold: true, color: "#333333", margin: [0, 6] },
                            {
                                text: (
                                    data.ttmEbitda * (ttmRange(data)?.min ?? 0) -
                                    data.grossDebt +
                                    data.availability
                                ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }),
                                margin: [0, 6]
                            },
                            {
                                text: (
                                    data.ttmEbitda * (ttmRange(data)?.max ?? 0) -
                                    data.grossDebt +
                                    data.availability
                                ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    maximumFractionDigits: 0,
                                }), // Vermelho
                                margin: [0, 6]
                            },
                        ],
                    ],
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        return rowIndex === 0 ? '#333333' : '#ffffff'
                    },
                    vLineWidth: () => 0,
                    hLineWidth: () => 1,
                },
            }
        ],
    } as TDocumentDefinitions;
    return pdfMake.createPdf(docDefinition)
}