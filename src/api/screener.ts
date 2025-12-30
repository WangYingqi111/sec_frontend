// src/api/screener.ts
import request from './request';

export interface ScreenerRequest {
    start_date: string;
    industry_name?: string[];
    min_consecutive_periods: number;
    revenue_growth_rate: number;
    profit_growth_rate: number;
    condition: 'AND' | 'OR';
    period_type: 'year' | 'season';
}

export function fetchScreenerList(data: ScreenerRequest) {
    return request.post('/api/stock_screener/list', data);
}

export function fetchStockChart(secCode: string, periodType: string) {
    return request.get(`/api/stock_screener/chart/${secCode}`, {
        params: { period_type: periodType }
    });
}
