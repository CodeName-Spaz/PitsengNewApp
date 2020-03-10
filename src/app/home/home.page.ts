import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
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
  constructor(public navCtrl: NavController, public alertCtrl : AlertController) {}

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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateForward('wish-list');
      } else {
        this.presentAlertConfirm1();
      }

    })
    
  }
  async presentAlertConfirm1() {
    const alert = await this.alertCtrl.create({
      header: 'Message',
      message: 'Please Sign-in',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // this.alertView = true;
            // this.localSt.store('alertShowed', this.alertView);
          }
        }, {
          text: 'Sign In',
          handler: () => {
            // this.alertView = true;
            // this.localSt.store('alertShowed', this.alertView);
            this.navCtrl.navigateForward('login');
          }
        }
      ]
    });

    await alert.present();
  }
  visitCart() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateForward('cart');
      } else {
        this.presentAlertConfirm1();
      }
    })
  }
  visitProfile() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateForward('profile');
      } else {
        this.presentAlertConfirm1();
      }
    })
    
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
