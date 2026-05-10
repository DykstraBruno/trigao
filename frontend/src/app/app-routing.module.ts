import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard, ManagerGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'produtos', loadChildren: () => import('./components/products/products.module').then(m => m.ProductsModule) },
  { path: 'sacola', loadChildren: () => import('./components/cart/cart.module').then(m => m.CartModule), canActivate: [AuthGuard] },
  { path: 'checkout', loadChildren: () => import('./components/checkout/checkout.module').then(m => m.CheckoutModule), canActivate: [AuthGuard] },
  { path: 'pedido/:id/confirmacao', loadChildren: () => import('./components/order-confirmation/order-confirmation.module').then(m => m.OrderConfirmationModule), canActivate: [AuthGuard] },
  { path: 'meus-pedidos', loadChildren: () => import('./components/my-orders/my-orders.module').then(m => m.MyOrdersModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./components/auth/login/login.module').then(m => m.LoginModule) },
  { path: 'cadastro', loadChildren: () => import('./components/auth/register/register.module').then(m => m.RegisterModule) },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard, AdminGuard] },
  { path: 'gerente', loadChildren: () => import('./components/manager/manager.module').then(m => m.ManagerModule), canActivate: [AuthGuard, ManagerGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 80]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
