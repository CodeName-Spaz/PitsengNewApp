import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.page.html',
  styleUrls: ['./wish-list.page.scss'],
})
export class WishListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  currentNumber: number = 1;
  increment(p) {
    this.currentNumber = this.currentNumber + 1;
    // this.event.quantity = this.currentNumber
  }
  decrement(p) {
    if (this.currentNumber > 1) {
      this.currentNumber = this.currentNumber - 1;
      // this.event.quantity = this.currentNumber;
    }
    return this.currentNumber;
  }
}
