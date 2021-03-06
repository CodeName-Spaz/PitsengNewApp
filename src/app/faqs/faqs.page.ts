import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { NavParams, ModalController } from '@ionic/angular';

//const FileSaver = require('file-saver');
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  prod_id;
  dbOrder = firebase.firestore().collection("orderHistory");
  myOrder = [];
  order = {
    name: '',
    picture: '',
    productCode: '',
    cost: 0,
    description: '',
    size: ''
  }
  reciept=null;
  status: string;
  constructor(params: NavParams, public modalController: ModalController) {
    this.prod_id = params.get('id');
  }

  ngOnInit() {
    this.changeState();
    setTimeout(() => {
      this.viewProduct(0);
    }, 1000);
  }
  viewProduct(index) {
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
    this.dbOrder.doc(this.prod_id).onSnapshot((doc) => {
      // console.log(doc.data());
      this.reciept = doc.data().pdfLink;
      this.myOrder = doc.data().product;
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
  
  download(pdf) {
    console.log(pdf);
    
  }

  downloadUrl() {
  
     this.reciept.download();
  //  }, 1000);
    
  }


  cancelOrder() {

  }
  approveOrder() {

  }
  prepareOrder() {

  }
  concludeOrder() {

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
