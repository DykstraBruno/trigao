import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../../services/loyalty.service';
import { LoyaltyBalance, LoyaltyTransaction } from '../../models/loyalty.model';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {
  balance: LoyaltyBalance | null = null;
  history: LoyaltyTransaction[] = [];
  loading = true;

  constructor(private loyaltyService: LoyaltyService) {}

  ngOnInit(): void {
    this.loyaltyService.balance().subscribe(b => this.balance = b);
    this.loyaltyService.history(0, 100).subscribe({
      next: p => { this.history = p.content; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  typeLabel(t: string): string {
    return { EARN: 'Crédito', REDEEM: 'Resgate', ADJUST: 'Ajuste', EXPIRE: 'Expirado' }[t] || t;
  }
}
