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
    // this.changeState();
  }
  getItem() {
    this.dbOrder.doc(this.prod_id).onSnapshot((doc) => {
      // this.myOrder = [];
      this.status = doc.data().status
      this.myOrder = doc.data().product
    })
  }
}
