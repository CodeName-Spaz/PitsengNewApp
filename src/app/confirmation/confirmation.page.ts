import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { AlertController, NavController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  buttonActive: boolean = true;
  dbCart = firebase.firestore().collection("Cart");
  dbOrder = firebase.firestore().collection('Order');
  myProd = [];
  product = [];
  prodCart = [];
  delCost: number;
  delType: string;
  productCode;
  myOrder = [];
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public toastCtrl: ToastController) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.checkUser();
      this.prodCart.forEach((i) => {
        i.data.product.forEach((z) => {
          this.myOrder.push(z)
        })
      })
    }, 1000);



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
              doc.data().product.forEach((z) => {
                this.myOrder.push(z)
              })
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
  goHome() {
    // this.router.navigateByUrl('home');
    if (this.delCost === undefined) {
      this.toastController("Please select delivery type")
      //console.log("My del cost is undefined");
    } else {
      this.placeOrder();
    }
    // this.navCtrl.navigateRoot('home');
  }
  placeOrder() {
    let docname = 'PITSENG' + new Date().getTime();
    this.dbOrder.doc(docname).set({
      product: this.myOrder, timestamp: new Date().getTime(), status: 'received', userID: firebase.auth().currentUser.uid, totalPrice: this.getTotal(),
      deliveryType: this.delType, deliveryCost: this.delCost
    }).then(() => {
      this.prodCart.forEach((i) => {
        this.dbCart.doc(i.id).delete().then(() => {
        });
      })
      this.alertConfirm();
    })
  }
  async alertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Order placed',
      message: 'Thank you for shopping with us',
      buttons: [
        {
          text: 'Continue Shopping',
          handler: () => {
            this.navCtrl.navigateRoot('home');
          }
        }
      ]
    });
    await alert.present();
  }
  async toastController(message) {
    let toast = await this.toastCtrl.create({ message: message, duration: 2000 });
    return toast.present();
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
  Delivery(tot) {
    let total = 0;
    this.delCost = 100;
    this.delType = "Delivery";
    for (let i = 0; i < this.prodCart.length; i++) {
      let product = this.prodCart[i].data.product;
      product.forEach((item) => {
        total = tot + 100
      })
    }
    return total;
  }
  notDelivery(tot) {
    let total = 0;
    this.delCost = 0;
    this.delType = "Collection";
    for (let i = 0; i < this.prodCart.length; i++) {
      let product = this.prodCart[i].data.product;
      product.forEach((item) => {
        total = tot
      })
    }
    return total;
  }
  getTotal() {
    let total = 0;
    for (let i = 0; i < this.prodCart.length; i++) {
      let product = this.prodCart[i].data.product;
      product.forEach((item) => {
        total += (item.cost * item.quantity);
      })
      //
    }
    //console.log('My tot ', total);
    return total;
  }
  switchView(state) {
    switch (state) {
      case 'd':
        this.buttonActive = true;
        this.Delivery(this.getTotal());
        break;
      case 'c':
        this.buttonActive = false;
        this.notDelivery(this.getTotal());
        break;
    }
  }
}
