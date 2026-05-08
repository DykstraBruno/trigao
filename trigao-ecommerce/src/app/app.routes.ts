import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsPageComponent } from './features/products/pages/products-page/products-page.component';
import { CartPageComponent } from './features/cart/pages/cart-page/cart-page.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'produtos',
		component: ProductsPageComponent,
	},
	{
		path: 'carrinho',
		component: CartPageComponent,
	},
	{
		path: 'login',
		loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
	},
];
