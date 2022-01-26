import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  cart: any | undefined;

  constructor() { }

  ngOnInit() {
    const cart = localStorage.getItem(environment.cartStorage);
    try {
      this.cart = ( cart ) ? JSON.parse(atob(cart)) : undefined;
    } catch (error) {
      this.cart = {};
    }
    
    
  }

}
