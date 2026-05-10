import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ManagerOrdersComponent } from './manager-orders/manager-orders.component';

@NgModule({
  declarations: [ManagerOrdersComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '',        redirectTo: 'pedidos', pathMatch: 'full' },
      { path: 'pedidos', component: ManagerOrdersComponent }
    ])
  ]
})
export class ManagerModule {}
