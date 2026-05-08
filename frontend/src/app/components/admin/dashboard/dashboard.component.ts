import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  cards = [
    { label: 'Gerenciar Produtos', icon: 'inventory_2', route: '/admin/produtos', desc: 'Adicionar, editar e remover produtos' },
    { label: 'Gerenciar Pedidos',  icon: 'receipt_long', route: '/admin/pedidos',  desc: 'Visualizar e atualizar status dos pedidos' }
  ];
  constructor(private router: Router) {}
  navigate(route: string): void { this.router.navigate([route]); }
}
