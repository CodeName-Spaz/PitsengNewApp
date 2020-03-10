import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.page.html',
  styleUrls: ['./wish-list.page.scss'],
})
export class WishListPage implements OnInit {
  dbWishlist = firebase.firestore().collection('Wishlist');
  myWish = [];
  myArr = [];
  constructor(public alertCtrl : AlertController, public navCtrl : NavController) { }

  ngOnInit() {
    this.checkUser();
  }

  currentNumber: number = 1;
  increment(p) {
    this.currentNumber = this.currentNumber + 1;
    // this.event.quantity = this.currentNumber
  }
  check(ev) {

  }
  decrement(p) {
    if (this.currentNumber > 1) {
      this.currentNumber = this.currentNumber - 1;
      // this.event.quantity = this.currentNumber;
    }
    return this.currentNumber;
  }
  checkUser() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          this.dbWishlist.where('customerUID', '==', res.uid).onSnapshot((res) => {
            this.myWish = [];
            res.forEach((doc) => {
              // if (doc.data().brand === "Specials") {
              //   this.dbSales.doc(doc.id).onSnapshot((data) => {
              //     if (data.data().hideItem === true) {
              //       this.itemAvailable.push("Out of stock");
              //     } else {
              //       this.itemAvailable.push("In stock");
              //     }
              //   })
              // } else {
              //   this.itemAvailable = [];
              //   this.dbProduct.doc(doc.id).onSnapshot((data) => {
              //     if (data.data().hideItem === true) {
              //       this.itemAvailable.push("Out of stock");
              //     } else {
              //       this.itemAvailable.push("In stock");
              //     }
              //   })
              // }
              this.myWish.push({ info: doc.data(), id: doc.id });
            })
          })
        } else {
          // this.alertView = this.localSt.retrieve('alertShowed');
          // console.log('My data ',this.alertView);
          // if (this.localSt.retrieve('alertShowed') !== true) {
            this.presentAlertConfirm1();
          // }
        }
      })
    }, 0);
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
}
