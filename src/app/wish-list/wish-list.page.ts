import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.page.html',
  styleUrls: ['./wish-list.page.scss'],
})
export class WishListPage implements OnInit {
  dbWishlist = firebase.firestore().collection('Wishlist');
  dbProfile = firebase.firestore().collection('UserProfile');
  dbProduct = firebase.firestore().collection('Products');
  myWish = [];
  myArr = [];
  cart = [];
  itemChecked: boolean;
  prodId;
  prod_image;
  prod_name;
  productCode;
  price;
  category;
  desc
  quantity: number;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public toastCtrl: ToastController) { }

  ngOnInit() {
    this.checkUser();
  }
  goHome() {
    this.navCtrl.navigateRoot('/home')
  }
  currentNumber: number = 1;
  increment(p) {
    this.currentNumber = this.currentNumber + 1;
    // this.event.quantity = this.currentNumber
  }
  delete(id) {
    this.dbProfile.doc(firebase.auth().currentUser.uid).collection('wishlists').doc(id).delete().then((res) => {
    })
  }
  check(ev, id) {
    // 
    this.itemChecked = ev.detail.checked;
    this.prodId = id;
    console.log(this.prodId);
  }
  closeWish() {
    this.navCtrl.pop();
  }
  decrement(p) {
    if (this.currentNumber > 1) {
      this.currentNumber = this.currentNumber - 1;
      // this.event.quantity = this.currentNumber;
    }
    return this.currentNumber;
  }


  addToCart(productCode) {

    console.log(productCode);

    // let wish = firebase.firestore().collection('Wishlist')
    // let increment: number = 0
    // wish.where('productCode', '==', productCode).get().then((snapshot => {
    // if(snapshot.size > 0){
    //  console.log('Do not add to wish list');
    //   snapshot.forEach(data => {
    //     increment = data.data().quantity + this.quantity
    //     wish.doc(data.id).set({quantity: increment }, {merge: true});
    //     console.log('items increment by one');

    //   })
    // }else{
    //   firebase.firestore().collection("WishList").onSnapshot(data => {
    //     this.cart = []
    //     data.forEach(item => {
    //       this.cart.push(item.data())
    //     })
    //     this.cart.forEach(item => {
    //       if(item.checked === true){
    //   this.dbWishlist.doc(this.prodId).set({
    //                 customerUID: firebase.auth().currentUser.uid, price: this.price,
    //                 image: this.prod_image, name: this.prod_name, id: this.prodId, category: this.category, productCode : this.productCode,
    //                 description : this.desc
    //               }).then(() => {
    //                 // this.myProduct[index].wish = 'heart';
    //                 // this.toastCtrl('Added to Cart..');
    //               })
    //             }
    //           })
    // }
    //   )}
    // })) 


  }

  async CheckBoxes(obj) {
    console.log(obj)

  }

  checkUser() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.dbProfile.doc(user.uid).collection('wishlists').onSnapshot((res) => {
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
          // }9
        }
      })
    }, 0);
  }
  viewProduct(val) {
    // if (this.itemChecked === true) {
    let image;
    let imageBack;
    let imageSide;
    let imageTop;
    let item;
    let name;
    let sizes;
    let description;
    let productCode;
    let category;
    let price;

    this.dbProduct.doc(val.id).onSnapshot((doc) => {

      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: val.id,
          image: doc.data().image,
          imageBack: doc.data().imageBack,
          imageSide: doc.data().imageSide,
          imageTop: doc.data().imageTop,
          // item: val.info.item,
          name: doc.data().name,
          sizes: doc.data().sizes,
          description: doc.data().description,
          productCode: doc.data().productCode,
          category: doc.data().category,
          price: doc.data().price
        }
      };

      this.navCtrl.navigateForward(['/item-view'], navigationExtras).then(() => {
       
      });
      this.delete(val.id);
    })
    // } 
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
