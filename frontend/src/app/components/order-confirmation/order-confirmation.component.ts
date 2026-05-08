import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';

  statusLabels: Record<string, string> = {
    PENDING:   'Aguardando Pagamento',
    PAID:      'Pago',
    PREPARING: 'Preparando',
    READY:     'Pronto',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  };

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getById(id).subscribe({
      next: order => { this.order = order; this.loading = false; },
      error: () => { this.error = 'Pedido não encontrado.'; this.loading = false; }
    });
  }
}
