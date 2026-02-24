export interface StatCard {
    title: string;
    value?: string;
    amount?: number;
    percentage: string;
    trend: 'up' | 'down';
    caption: string;
}

export interface SalesLine {
    day: string;
    coffeetalk: number;
    lowSlow: number;
    coldBrew: number;
    eplus: number;
    sinergy: number;
}

export interface SalesBar {
    hour: string;
    value: number;
}

export interface TopSellingItem {
    id: number;
    name: string;
    image: string;
    price: number;
    percentage: string;
    trend: 'up' | 'down';
}

export interface StaffPerformance {
    id: number;
    name: string;
    avatar: string;
    amount: number;
    subAmount: number;
}
