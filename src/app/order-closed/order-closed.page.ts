import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-order-closed',
  templateUrl: './order-closed.page.html',
  styleUrls: ['./order-closed.page.scss'],
})
export class OrderClosedPage implements OnInit {
  prod_id: any;
  dbOrder = firebase.firestore().collection("orderHistory");
  myOrder = [];
  status: string;
  reciept;
  oderType;
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
    // this.getItem();
    this.changeState();
  }
 
  changeState() {
    // let a = "received"
    // let b = "processed"
    // let c = "ready"
    // let d = "delivered"
    this.dbOrder.doc(this.prod_id).onSnapshot((doc) => {
      // console.log(doc.data());
      this.reciept = doc.data().pdfLink;
      this.myOrder = doc.data().product;
      this.status = doc.data().status;
      // console.log(this.status); 
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
  dismissHistory() {
    this.navCtrl.pop();
  }
}
