import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { StoreManagementComponent } from './store-management/store-management.component';
import { ManagerManagementComponent } from './manager-management/manager-management.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    StoreManagementComponent,
    ManagerManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '',         component: DashboardComponent },
      { path: 'produtos', component: ProductManagementComponent },
      { path: 'pedidos',  component: OrderManagementComponent },
      { path: 'lojas',    component: StoreManagementComponent },
      { path: 'gerentes', component: ManagerManagementComponent }
    ])
  ]
})
export class AdminModule {}
