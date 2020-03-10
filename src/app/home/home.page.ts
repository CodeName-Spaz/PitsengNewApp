import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  dbProduct = firebase.firestore().collection('Products');
  myProduct = [];
  val = '';
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    this.getProductsbyCategory('Pottery')
  }
  getProductsbyCategory(name) {
    this.val='active';
    this.dbProduct.where('category','==',name).onSnapshot((res)=>{
      this.myProduct = [];
      res.forEach((doc)=>{
        this.myProduct.push({data: doc.data(), id : doc.id})
      })
      console.log("My items ", this.myProduct);
      
    })
  }
  openWish(){
    
  }
  
  viewProduct(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: val.id,
        image: val.data.image,
        name: val.data.name,
        productCode: val.data.productCode,
        quantity: val.data.quantity,
        price: val.data.price,
        description: val.data.description
      }
    };
    this.navCtrl.navigateForward(['/item-view'], navigationExtras);
  }
}
