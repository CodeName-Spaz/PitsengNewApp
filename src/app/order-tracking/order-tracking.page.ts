import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
})
export class OrderTrackingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  status = "received"

  changeState(){
    let a = "received"
    let b = "processed"
    let c = "ready"
    let d = "delivered"
    if(this.status == "received"){
      this.status = "processed"
    }
    else if(this.status == "processed"){
      this.status = "ready"
    }
    else if(this.status == "ready"){
      this.status = "delivered"
    }
    else{
      this.status = "received"
    }
    console.log(this.status);
  }
}
