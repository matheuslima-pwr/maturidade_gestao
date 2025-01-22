import { ValuationData, ValuationDto } from "@/@types/valuation";
import sectors from "@/app/demo-valuation/database/sectors.json"
import { lastYearRange, ttmRange } from "./utils";

interface EmailTemplateProps {
    companyName: string;
    data: ValuationData;
}

export function createEmailTemplate({
    companyName,
    data
}: EmailTemplateProps) {
    const sector = sectors.find(sector => sector.id === data.sectorId)
    if (!sector) return '<h1>Erro ao encontrar o setor</h1>'

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
            .card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 1px 3px #0000001A;
            }
            .metrics-container {
                display: flex;
                margin-bottom: 20px;
            }
            .metric-card {
                border-radius: 0.75rem; /* Rounded corners (12px) */
                border: 1px solid var(--border-color, #e0e0e0); /* Border with a fallback color */
                background-color: var(--bg-card, #ffffff); /* Background color */
                color: var(--text-card-foreground, #333333); /* Text color */
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06); /* Shadow for depth */
                width: auto; /* Full width */
                padding: 20px;
                text-align: center;
                margin-right: 20px;
            }
            .metric-title {
                font-size: 20px;
                color: #1a202c;
                font-weight: bold;
                margin-bottom: 16px;
            }
            .metric-value {
                font-size: 20px;
                font-weight: bold;
                color: #2d3748;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th {
                background-color: #000000CC;
                color: #FFFFFF;
                padding: 12px;
                text-align: left;
            }
            td {
                padding: 12px;
                border-bottom: 1px solid #e2e8f0;
            }
            .disclaimer {
                font-size: 12px;
                color: #718096;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Resultado da Avaliação - ${companyName}</h2>
            
            <div class="metrics-container">
                <div class="metric-card">
                    <div class="metric-title">Empresas¹</div>
                    <div class="metric-value">${sector.number_of_companies}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Múltiplo EBITDA²</div>
                    <div class="metric-value">${sector.ev_ebitda.toFixed(1)}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Segmento</div>
                    <div class="metric-value">${sector.industry_group}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 52%"></th>
                        <th style="width: 16%">Mercado</th>
                        <th style="width: 16%">Sua Empresa</th>
                        <th style="width: 16%">Comparação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Receita Líquida / Colaborador / Mês:</strong></td>
                        <td>R$ ${Math.round(sector.monthly_net_revenue_per_employee).toLocaleString('pt-BR')}</td>
                        <td>R$ ${Math.round(data.ttmRevenue / data.employee / 12).toLocaleString('pt-BR')}</td>
                        <td>${data.ttmRevenue / data.employee / 12 > sector.monthly_net_revenue_per_employee ? 'Acima do Mercado' : 'Abaixo do Mercado'}</td>
                    </tr>
                    <tr>
                        <td><strong>Média de Receita Líquida Anual X Receita Líquida do Último Ano:</strong></td>
                        <td>${sector.annual_net_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${data.lastYearRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${data.lastYearRevenue > sector.annual_net_revenue ? 'Acima do Mercado' : 'Abaixo do Mercado'}</td>
                    </tr>
                    <tr>
                        <td><strong>Média de Receita Líquida Anual X Receita Líquida dos Últimos 12 Meses:</strong></td>
                        <td>${sector.annual_net_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${data.ttmRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${data.ttmRevenue > sector.annual_net_revenue ? 'Acima do Mercado' : 'Abaixo do Mercado'}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th style="width: 52%">Avaliação do Último Ano</th>
                        <th style="width: 24%">Mínimo</th>
                        <th style="width: 24%">Máximo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Múltiplo Aplicado:</strong></td>
                        <td>${lastYearRange(data)?.min.toFixed(1)}</td>
                        <td>${lastYearRange(data)?.max.toFixed(1)}</td>
                    </tr>
                    <tr>
                        <td><strong>Valor da Firma:</strong></td>
                        <td>${(data.lastYearEbitda * (lastYearRange(data)?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${(data.lastYearEbitda * (lastYearRange(data)?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                    </tr>
                    <tr>
                        <td><strong>Valor para Acionistas:</strong></td>
                        <td>${(data.lastYearEbitda * (lastYearRange(data)?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${(data.lastYearEbitda * (lastYearRange(data)?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th style="width: 52%">Avaliação dos Últimos 12 Meses</th>
                        <th style="width: 24%">Mínimo</th>
                        <th style="width: 24%">Máximo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Múltiplo Aplicado:</strong></td>
                        <td>${ttmRange(data)?.min.toFixed(1)}</td>
                        <td>${ttmRange(data)?.max.toFixed(1)}</td>
                    </tr>
                    <tr>
                        <td><strong>Valor da Firma:</strong></td>
                        <td>${(data.ttmEbitda * (ttmRange(data)?.min ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${(data.ttmEbitda * (ttmRange(data)?.max ?? 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                    </tr>
                    <tr>
                        <td><strong>Valor para Acionistas:</strong></td>
                        <td>${(data.ttmEbitda * (ttmRange(data)?.min ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                        <td>${(data.ttmEbitda * (ttmRange(data)?.max ?? 0) - data.grossDebt + data.availability).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
                    </tr>
                </tbody>
            </table>

            <p class="disclaimer">
                Os valores não refletem uma avaliação formal para ser usada em negociações de compra e venda 
                e são dados estimados com base em informações das bases do site do professor Damodaran, 
                com intuito de analisar ordens de grandeza genéricas.
            </p>
            <p class="disclaimer">
                As empresas que foram usadas como benchmark se encontram nos seguintes paises: China, India, América Latina, Asia e demais regiões emergentes.
            </p>
            <p class="disclaimer">
                [1] Quantidade de empresas do seu segmento em mercados emergentes.
            </p>
            <p class="disclaimer">
                [2] Média do Múltiplo EBITDA das empresas do seu segmento em mercados emergentes.
            </p>
        </div>
    </body>
    </html>
    `;
}