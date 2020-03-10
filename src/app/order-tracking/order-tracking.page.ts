import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
})
export class OrderTrackingPage implements OnInit {


    id: '';
    product_name;
    image;
    productCode;
    cost;
  
  constructor(public route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params =>{
      this.id = params["doc.ref"]
      this.product_name = params["product_name"];
      this.image = params["image"];
      this.productCode = params["productCode"];
      this.cost = params["cost"];

      console.log("my items ", this.id);
      
  })
  }

  ngOnInit() {

  }

  getOrders(){
   
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
