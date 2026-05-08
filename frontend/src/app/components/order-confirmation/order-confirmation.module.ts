import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderConfirmationComponent } from './order-confirmation.component';

@NgModule({
  declarations: [OrderConfirmationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrderConfirmationComponent }])
  ]
})
export class OrderConfirmationModule {}
