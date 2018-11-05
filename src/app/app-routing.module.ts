import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './posts/order-list/order-list.component';
import { OrderViewComponent } from './posts/order-view/order-view.component';
import { OrderCreateComponent } from './posts/order-create/order-create.component';
// import { PostListComponent } from './posts/post-list/post-list.component';
// import { PostViewComponent } from './posts/post-view/post-view.component';
// import { PostCreateComponent } from './posts/post-create/post-create.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'view/:orderTracking', component: OrderViewComponent },
  { path: 'create', component: OrderCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:orderId', component: OrderCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
