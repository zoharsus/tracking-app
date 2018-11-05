import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Order } from './order.model';

const BACKEND_URL = environment.apiUrl + '/orders/';

@Injectable({providedIn: 'root'})
export class OrdersService {
  private orders: Order[] = [];
  private ordersUpdated = new Subject<{orders: Order[], orderCount: number}>();

  constructor(private http: HttpClient, public router: Router) {}

  getOrders(ordersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${ordersPerPage}&page=${currentPage}`;
    this.http
    .get<{ message: string, orders: any, maxOrders: number }>(BACKEND_URL + queryParams)
    .pipe(
      map(orderData => {
        return {
          orders: orderData.orders.map(order => {
            return {
              id: order._id,
              title: order.title,
              seller: order.seller,
              tracking: order.tracking,
              origin: order.origin,
              destination: order.destination,
              status: order.status,
              expectedDate: order.expectedDate,
              creator: order.creator
            };
          }),
          maxOrders: orderData.maxOrders
        };
      })
    )
    .subscribe(transformedOrderData => {
      this.orders = transformedOrderData.orders;
      this.ordersUpdated.next({
        orders: [...this.orders],
        orderCount: transformedOrderData.maxOrders
    });
  });
  }

  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  getOrder(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      seller: string;
      tracking: string;
      status: string;
      origin: string;
      destination: string;
      expectedDate: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addOrder(title: string, seller: string, tracking: string, status: string, origin: string, destination: string, expectedDate: string) {
    const order = {
      title: title,
      seller: seller,
      tracking: tracking,
      status: status,
      origin: origin,
      destination: destination,
      expectedDate: expectedDate
    };
    this.http
      .post<{ message: string, order: Order }>(BACKEND_URL, order)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateOrder(id: string, title: string,  seller: string, tracking: string, status: string,
    origin: string, destination: string, expectedDate: string) {
    const order = {
      title: title,
      seller: seller,
      tracking: tracking,
      status: status,
      origin: origin,
      destination: destination,
      expectedDate: expectedDate
    };
    this.http
    .put(BACKEND_URL + id, order)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deleteOrder(orderId: string) {
    return this.http.delete(BACKEND_URL + orderId);
  }
}
