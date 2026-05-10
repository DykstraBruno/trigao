import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  cards = [
    { label: 'Receita Hoje', value: 'R$ 1.247,50', icon: 'payments' },
    { label: 'Pedidos', value: '37', icon: 'inventory_2' },
    { label: 'Economia Taxas', value: 'R$ 89,20', icon: 'savings' }
  ];

  topProducts = [
    { name: 'Pao Frances', qty: 245 },
    { name: 'Croissant', qty: 89 },
    { name: 'Bolo Nega Maluca', qty: 12 }
  ];

  quickActions = [
    { label: 'Gerenciar Produtos', icon: 'edit_note',     route: '/admin/produtos', desc: 'Adicionar, editar e remover produtos' },
    { label: 'Gerenciar Pedidos',  icon: 'local_shipping', route: '/admin/pedidos',  desc: 'Atualizar status de entregas e retirada' },
    { label: 'Lojas',              icon: 'storefront',     route: '/admin/lojas',    desc: 'Cadastrar e editar lojas físicas' },
    { label: 'Gerentes',           icon: 'badge',          route: '/admin/gerentes', desc: 'Atribuir gerentes às lojas' }
  ];

  weekBars = [65, 78, 59, 82, 74, 91];
  weekLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  alerts = [
    { type: 'warning', icon: 'warning', text: 'Farinha de trigo em estoque baixo' },
    { type: 'success', icon: 'check_circle', text: 'Todos os pedidos entregues hoje' }
  ];

  constructor(private router: Router) {}
  navigate(route: string): void { this.router.navigate([route]); }
}
