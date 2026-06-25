import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoyaltyComponent } from './loyalty.component';

@NgModule({
  declarations: [LoyaltyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LoyaltyComponent }])
  ]
})
export class LoyaltyModule {}
