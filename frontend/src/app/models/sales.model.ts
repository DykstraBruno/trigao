export interface DailyPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesReport {
  history: DailyPoint[];
  forecast: DailyPoint[];
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  growthWoW: number;
  movingAverageWindow: number;
}
