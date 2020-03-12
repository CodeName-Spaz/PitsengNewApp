import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
})
export class OrderTrackingPage implements OnInit {
  prod_id: any;
  dbOrder = firebase.firestore().collection("Order");
  myOrder = [];
  constructor(public route: ActivatedRoute, public navCtrl: NavController) {
    this.route.queryParams.subscribe(params => {
      this.prod_id = params["id"];
      /* this.prod_name = params["name"];
      this.prod_image = params["image"];
      this.sizes = params["sizes"];
      this.desc = params["description"];
      this.price = params["price"];
      this.category = params["category"]; */
    })
  }

  ngOnInit() {
    this.getItem();
  }
  popBack() {
    this.navCtrl.pop();
  }
  getItem() {
    this.dbOrder.doc(this.prod_id).onSnapshot((doc) => {
      // this.myOrder = [];
      this.myOrder = doc.data().product
    })
  }
  getTotal() {
    let total = 0;
    for (let i = 0; i < this.myOrder.length; i++) {
      // let product = this.myOrder[i];
      // console.log("my orders ", this.myOrder[i]);
      total += (this.myOrder[i].cost * this.myOrder[i].quantity)
      /*  this.myOrder[i].forEach((item) => {
         total += (item.cost * item.quantity);
       }) */
    }
    // console.log("total ", total);

    return total;
  }
  status = "received"

  changeState() {
    let a = "received"
    let b = "processed"
    let c = "ready"
    let d = "delivered"
    if (this.status == "received") {
      this.status = "processed"
    }
    else if (this.status == "processed") {
      this.status = "ready"
    }
    else if (this.status == "ready") {
      this.status = "delivered"
    }
    else {
      this.status = "received"
    }
    console.log(this.status);
  }
  done() {
    this.navCtrl.pop();
  }
}
