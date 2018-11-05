import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrdersService } from '../orders.service';
import { Order } from '../order.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})

export class OrderCreateComponent implements OnInit, OnDestroy {
  order: Order;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private orderId: string;
  private authStatusSub: Subscription;

  constructor(
    public ordersService: OrdersService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      seller: new FormControl(null, {validators: [Validators.required]}),
      tracking: new FormControl(null, {validators: [Validators.required]}),
      status: new FormControl(null, {validators: [Validators.required]}),
      origin: new FormControl(null, {validators: [Validators.required]}),
      destination: new FormControl(null, {validators: [Validators.required]}),
      expectedDate: new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('orderId')) {
        this.mode = 'edit';
        this.orderId = paramMap.get('orderId');
        this.isLoading = true;
        this.ordersService.getOrder(this.orderId).subscribe(orderData => {
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
          this.form.setValue({
            title: this.order.title,
            seller: this.order.seller,
            tracking: this.order.tracking,
            status: this.order.status,
            origin: this.order.origin,
            destination: this.order.destination,
            expectedDate: this.order.expectedDate
          });
        });
      } else {
        this.mode = 'create';
        this.orderId = null;
      }
    });
  }

  onSaveOrder() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.ordersService.addOrder(
        this.form.value.title,
        this.form.value.seller,
        this.form.value.tracking,
        this.form.value.status,
        this.form.value.origin,
        this.form.value.destination,
        this.form.value.expectedDate
        );
    } else {
      this.ordersService.updateOrder(
        this.orderId,
        this.form.value.title,
        this.form.value.seller,
        this.form.value.tracking,
        this.form.value.status,
        this.form.value.origin,
        this.form.value.destination,
        this.form.value.expectedDate
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
