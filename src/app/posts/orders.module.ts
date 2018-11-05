import { NgModule } from '@angular/core';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    OrderCreateComponent,
    OrderListComponent,
    OrderViewComponent
  ],
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class OrdersModule {}
