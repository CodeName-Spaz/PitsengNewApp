import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  prod_id;
  dbOrder = firebase.firestore().collection("Order");
  myOrder = [];
  order = {
    name: '',
    picture: '',
    productCode: '',
    cost: 0,
    description: '',
    size: ''
  }
  status: string;
  constructor(params: NavParams,public modalController: ModalController) {
    // console.log(params.get('id'));
    this.prod_id = params.get('id');
  }

  ngOnInit() {
    this.getItem();
    this.changeState();
    setTimeout(() => {
      this.viewProduct(0);
    }, 1000);
  }
  viewProduct(index) {
    // console.log(index);
    
    this.order.name = this.myOrder[index].product_name;
    this.order.picture = this.myOrder[index].picture;
    this.order.productCode = this.myOrder[index].productCode;
    this.order.description = this.myOrder[index].description;
    this.order.cost = this.myOrder[index].cost;
    this.order.size = this.myOrder[index].size
  }
  dismiss() {
    this.modalController.dismiss();
  }
  changeState() {
    // let a = "received"
    // let b = "processed"
    // let c = "ready"
    // let d = "delivered"
    this.dbOrder.doc(this.prod_id).onSnapshot((doc)=>{
      // console.log(doc.data());
      
       if (doc.data().status === "received") {
      this.status = "received"
    }
    else if (doc.data().status === "processed") {
      this.status = "processed"
      
    }
    else if (doc.data().status === "ready") {
      this.status = "ready"
      
    }
    else {
      this.status = "delivered"
    }
    // console.log(this.status); 
     })
   
     
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
}
