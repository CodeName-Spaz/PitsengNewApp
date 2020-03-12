import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  dbCart = firebase.firestore().collection("Cart");
  prodCart = [];
  product = [];
  constructor(public alertCtrl : AlertController, public navCtrl : NavController) { }

  ngOnInit() {
    this.checkUser();
  }
  checkUser() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          this.dbCart.where('customerUID', '==', res.uid).onSnapshot((info) => {
            // this.cartCount = info.size;
            this.prodCart = [];
            // this.totalCost = 0;
            info.forEach((doc) => {
              this.prodCart.push({ data: doc.data(), id: doc.id });
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
  plus(prod, index) {
    let num = index.data.product[0].quantity++
    index.data.product[0].cost = index.data.product[0].cost
    let id = index.id
    let product = [prod]
    this.dbCart.doc(id).update({ product: product }).then(res => {
  
    })
  }
  minus(prod, index) {
    if (index.data.product[0].quantity === 1) {
      this.presentAlertConfirm(index.id);
    } else {
      let num = index.data.product[0].quantity--
      index.data.product[0].cost = index.data.product[0].cost
      let id = index.id
      let product = [prod]
      this.dbCart.doc(id).update({ product: product }).then(res => {

      })
    }
  }
  async presentAlertConfirm(id) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Do you want to remove this product?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Okay',
          handler: () => {
            //console.log('Id is ', id);
            this.removeProd(id)
          }
        }
      ]
    });

    await alert.present();
  }
  removeProd(id) {
    this.dbCart.doc(id).delete().then((res) => {
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
  currentNumber: number = 1;
  increment(p) {
    this.currentNumber = this.currentNumber + 1;
    // this.event.quantity = this.currentNumber
  }
  decrement(p) {
    if (this.currentNumber > 1) {
      this.currentNumber = this.currentNumber - 1;
      // this.event.quantity = this.currentNumber;
    }
    return this.currentNumber;
  }
  getTotal() {
    let total = 0;
    for (let i = 0; i < this.prodCart.length; i++) {
      let product = this.prodCart[i].data.product;
      product.forEach((item) => {
        total += (item.cost * item.quantity);
      })
    }
    return total;
  }
  closeWish() {
    this.navCtrl.pop();
  }
  confirmOrder() {
    // let product = {name:'', cost:0 , pic:'',quantity:0, size: [], id: '' };
    // this.prodCart.forEach((res)=>{
    //   product.id = res.id;
    //   res.data.product.forEach((item)=>{
    //     this.product.push(item);
    //     product.name = item.product_name;
    //     product.cost = item.cost;
    //     product.pic = item.picture;
    //     product.quantity = item.quantity;
    //     product.size = item.size;
    //   })
    // })
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     id: product.id,
    //     image: product.pic,
    //     name: product.name,
    //     sizes : product.size,
    //     quantity : product.quantity,
    //     price : product.cost,
    //     arr: this.product
    //   }
    // };
    this.navCtrl.navigateForward(['confirmation']);
  }
}
