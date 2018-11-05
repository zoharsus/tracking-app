import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Order } from '../order.model';
import { OrdersService } from '../orders.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { ReactiveFormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] =  [];
  isLoading = false;
  totalOrders = 0;
  ordersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  form: FormGroup;
  private ordersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public ordersService: OrdersService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.ordersService.getOrders(this.ordersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.ordersSub = this.ordersService
    .getOrderUpdateListener()
    .subscribe((orderData: {orders: Order[], orderCount: number}) => {
      this.isLoading = false;
      this.totalOrders = orderData.orderCount;
      this.orders = orderData.orders;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.ordersPerPage = pageData.pageSize;
    this.ordersService.getOrders(this.ordersPerPage, this.currentPage);
  }

  onView() {
    return;
  }

  onDelete(orderId: string) {
    this.isLoading = true;
    this.ordersService.deleteOrder(orderId).subscribe(() => {
      this.ordersService.getOrders(this.ordersPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
