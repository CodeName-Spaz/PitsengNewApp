import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemCount = new BehaviorSubject(0);
  private wishItemCount = new BehaviorSubject(0);

  

  constructor() { }


  getCartItemCount() {
    return this.cartItemCount;
  }

  getWishItemCount(){
    return this.wishItemCount;
  }
}
