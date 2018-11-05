import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Order } from '../order.model';
import { OrdersService } from '../orders.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})

export class OrderViewComponent implements OnInit, OnDestroy {

  isLoading = false;
  order: Order;
  userIsAuthenticated = false;
  private orderTracking: string;
  private authStatusSub: Subscription;


  constructor(public ordersService: OrdersService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('orderTracking')) {
        this.orderTracking = paramMap.get('orderTracking');
        this.isLoading = true;
        this.ordersService.getOrder(this.orderTracking).subscribe(orderData => {
          this.isLoading = false;
          this.order = {
            id: orderData._id,
            title: orderData.title,
            seller: orderData.seller,
            tracking: orderData.tracking,
            status: orderData.status,
            origin: orderData.origin,
            destination: orderData.destination,
            expectedDate: orderData.expectedDate,
            creator: orderData.creator
          };
        }, error => {
          this.ordersService.router.navigate(['/']);
        });
      } else {
        this.orderTracking = null;
      }
    });
  }

  onView() {
    return;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
