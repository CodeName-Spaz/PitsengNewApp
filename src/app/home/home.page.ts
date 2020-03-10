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
      // console.log("My items ", this.myProduct);
      
    })
  }
  visitWish() {
    this.navCtrl.navigateForward('wish-list');
  }
  visitCart() {
    this.navCtrl.navigateForward('cart');
  }
  visitProfile() {
    this.navCtrl.navigateForward('profile');
  }
  viewProduct(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: val.id,
        image: val.data.image,
        imageBack: val.data.imageBack,
        imageSide: val.data.imageSide,
        imageTop: val.data.imageTop,
        item: val.data.item,
        name: val.data.name,
        sizes : val.data.sizes,
        description : val.data.description,
        productCode : val.data.productCode,
        category : val.data.category,
        price : val.data.price
      }
    };
    this.navCtrl.navigateForward(['/item-view'], navigationExtras);
  }
}
