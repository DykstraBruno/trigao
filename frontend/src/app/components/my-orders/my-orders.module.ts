import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyOrdersComponent } from './my-orders.component';

@NgModule({
  declarations: [MyOrdersComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MyOrdersComponent }])
  ]
})
export class MyOrdersModule {}
