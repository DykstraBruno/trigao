import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store.model';
import { DailyPoint, SalesReport } from '../../../models/sales.model';

interface ChartPoint {
  x: number;
  y: number;
  date: string;
  revenue: number;
  orders: number;
  forecast: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  report: SalesReport | null = null;
  range = 30;
  forecastDays = 7;

  // SVG geometry
  readonly chartWidth = 720;
  readonly chartHeight = 220;
  readonly padding = { top: 20, right: 20, bottom: 30, left: 50 };

  historyPath = '';
  forecastPath = '';
  areaPath = '';
  yTicks: { y: number; label: string }[] = [];
  xTicks: { x: number; label: string }[] = [];
  hoverPoint: ChartPoint | null = null;
  points: ChartPoint[] = [];

  // Export
  stores: Store[] = [];
  exportFrom = '';
  exportTo = '';
  exportStoreId: number | null = null;
  exporting = false;

  quickActions = [
    { label: 'Gerenciar Produtos', icon: 'edit_note',      route: '/admin/produtos', desc: 'Adicionar, editar e remover produtos' },
    { label: 'Gerenciar Pedidos',  icon: 'local_shipping', route: '/admin/pedidos',  desc: 'Atualizar status de entregas e retirada' },
    { label: 'Lojas',              icon: 'storefront',     route: '/admin/lojas',    desc: 'Cadastrar e editar lojas físicas' },
    { label: 'Gerentes',           icon: 'badge',          route: '/admin/gerentes', desc: 'Atribuir gerentes às lojas' }
  ];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.load();
    this.initExportDates();
    this.storeService.list(false).subscribe(s => this.stores = s);
  }

  private initExportDates(): void {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 29);
    this.exportFrom = this.toIsoDate(start);
    this.exportTo   = this.toIsoDate(today);
  }

  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  downloadCsv(): void {
    if (!this.exportFrom || !this.exportTo) return;
    this.exporting = true;
    this.adminService.downloadSalesCsv(this.exportFrom, this.exportTo, this.exportStoreId ?? undefined)
      .subscribe({
        next: blob => {
          this.triggerBlobDownload(blob, `vendas-trigao-${this.exportFrom}-a-${this.exportTo}.csv`);
          this.exporting = false;
        },
        error: () => { this.exporting = false; alert('Falha ao baixar CSV.'); }
      });
  }

  openPrintReport(): void {
    if (!this.exportFrom || !this.exportTo) return;
    this.exporting = true;
    this.adminService.fetchSalesHtml(this.exportFrom, this.exportTo, this.exportStoreId ?? undefined)
      .subscribe({
        next: blob => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          this.exporting = false;
        },
        error: () => { this.exporting = false; alert('Falha ao gerar relatório.'); }
      });
  }

  private triggerBlobDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  navigate(route: string): void { this.router.navigate([route]); }

  setRange(days: number): void {
    if (days === this.range) return;
    this.range = days;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.adminService.getSalesReport(this.range, this.forecastDays).subscribe({
      next: r => { this.report = r; this.buildChart(r); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  showPoint(p: ChartPoint): void { this.hoverPoint = p; }
  hidePoint(): void { this.hoverPoint = null; }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  }

  formatDateShort(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  private buildChart(report: SalesReport): void {
    const series: { p: DailyPoint; forecast: boolean }[] = [
      ...report.history.map(p => ({ p, forecast: false })),
      ...report.forecast.map(p => ({ p, forecast: true }))
    ];
    if (!series.length) {
      this.points = [];
      this.historyPath = this.forecastPath = this.areaPath = '';
      return;
    }

    const maxRevenue = Math.max(1, ...series.map(s => s.p.revenue));
    const innerW = this.chartWidth - this.padding.left - this.padding.right;
    const innerH = this.chartHeight - this.padding.top - this.padding.bottom;

    this.points = series.map((s, i) => {
      const x = this.padding.left + (series.length === 1 ? innerW / 2 : (i * innerW) / (series.length - 1));
      const y = this.padding.top + innerH - (s.p.revenue / maxRevenue) * innerH;
      return { x, y, date: s.p.date, revenue: s.p.revenue, orders: s.p.orders, forecast: s.forecast };
    });

    const histPts = this.points.filter(p => !p.forecast);
    const fcstPts = this.points.filter(p => p.forecast);

    this.historyPath = this.toPath(histPts);
    // Bridge entre último histórico e primeiro forecast
    this.forecastPath = fcstPts.length && histPts.length
      ? this.toPath([histPts[histPts.length - 1], ...fcstPts])
      : this.toPath(fcstPts);

    // Área sombreada sob histórico
    if (histPts.length) {
      const baseline = this.padding.top + innerH;
      this.areaPath =
        `M ${histPts[0].x} ${baseline} ` +
        histPts.map(p => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${histPts[histPts.length - 1].x} ${baseline} Z`;
    } else {
      this.areaPath = '';
    }

    this.buildYTicks(maxRevenue, innerH);
    this.buildXTicks(series);
  }

  private buildYTicks(maxRevenue: number, innerH: number): void {
    const steps = 4;
    this.yTicks = [];
    for (let i = 0; i <= steps; i++) {
      const v = (maxRevenue * i) / steps;
      const y = this.padding.top + innerH - (v / maxRevenue) * innerH;
      this.yTicks.push({ y, label: this.shortMoney(v) });
    }
  }

  private buildXTicks(series: { p: DailyPoint }[]): void {
    const innerW = this.chartWidth - this.padding.left - this.padding.right;
    const total = series.length;
    const desired = Math.min(6, total);
    const step = Math.max(1, Math.floor((total - 1) / Math.max(1, desired - 1)));
    this.xTicks = [];
    for (let i = 0; i < total; i += step) {
      const x = this.padding.left + (total === 1 ? innerW / 2 : (i * innerW) / (total - 1));
      this.xTicks.push({ x, label: this.formatDateShort(series[i].p.date) });
    }
  }

  private toPath(pts: ChartPoint[]): string {
    if (!pts.length) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  private shortMoney(v: number): string {
    if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toFixed(0)}`;
  }
}
