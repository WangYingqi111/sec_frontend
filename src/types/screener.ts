export type PeriodType = 'year' | 'season';
export type ConditionOp = 'AND' | 'OR';

export interface ScreenerRequest {
    start_date: string;
    industry_name?: string[];
    min_consecutive_periods: number;
    revenue_growth_rate: number; // 0.2 表示 20%
    profit_growth_rate: number;
    condition: ConditionOp;
    period_type: PeriodType;
}

export interface StockItem {
    security_code: string;
    security_name: string;
    industry?: string | null;
}

export interface ScreenerResponse {
    stocks: StockItem[];
    count: number;
}

export interface StockChartResponse {
    dates: string[];
    revenue: (number | null)[];
    profit: (number | null)[];
}

