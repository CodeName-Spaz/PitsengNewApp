import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { PaymentPage } from '../payment/payment.page';
import { FaqsPage } from '../faqs/faqs.page'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('rating', {static: true}) rating : any;
  dbProduct = firebase.firestore().collection('Products');
  dbCart = firebase.firestore().collection("Cart");
  dbWishlist = firebase.firestore().collection('Wishlist');
  dbOrder = firebase.firestore().collection('Order');
  dbProfile = firebase.firestore().collection('UserProfile');
  profile = {
    image: '',
    name: '',
    number: '',
    address: '',
    email: '',
    uid: '',
  }

  showInputs = false

  myProduct = [];
  prodCart = [];
  Products=[]
  val = '';
  viewBackdrop = false;
  viewCart = false;
  viewProfile = false;
  viewWishlist = false;
  buttonActive: boolean = true;
  viewPending = false;
  pendingOrders = false;
  orderHistory = false;
  loaderMessages = 'Loading...';
  loaderAnimate: boolean = true;
  delCost: number;
  delType: string;
  myOrder = [];
  myWish = [];
  History = [];
  Allorders = [];
  itemAvailable = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalController: ModalController,
    public toastCtrl: ToastController) { }

  ngOnInit() {
    setTimeout(() => {
      this.loaderAnimate = false;
    }, 4000);
    this.checkUser();
    this.getProductsbyCategory('Deco')

    // this.getProducts();
  }

  getProducts(){

    firebase.firestore().collection("Products").onSnapshot(snapshot => {
      this.myProduct=[]
      snapshot.forEach(item =>{
        this.myProduct.push(item.data());
      })
    })

  }
  getProductsbyCategory(name: string) {
    this.val = name.toLowerCase();
    this.dbProduct.where('category', '==', name).onSnapshot((res) => {
      this.myProduct = [];
      res.forEach((doc) => {

        this.myProduct.push({ data: doc.data(), id: doc.id })
      })
      console.log("My items ", this.myProduct);

    })
  }

  displayRating(rates) {
    
  }

  checkUser() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          firebase.firestore().collection("orderHistory").where('userID', '==', res.uid).onSnapshot((data) => {
            this.History = [];
            data.forEach((item) => {
              this.History.push({ ref: item.id, info: item.data() })
            })
            //  console.log("orders ", this.Allorders);

          })
          firebase.firestore().collection("Order").where('userID', '==', res.uid).onSnapshot((data) => {
            this.Allorders = [];
            data.forEach((item) => {
              this.Allorders.push({ ref: item.id, info: item.data() })
            })
          })
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
              this.itemAvailable = [];
              this.dbProduct.doc(doc.id).onSnapshot((data) => {
                if (data.data().hideItem === true) {
                  this.itemAvailable.push("Out of stock");
                } else {
                  this.itemAvailable.push("In stock");
                }
              })
              this.myWish.push({ info: doc.data(), id: doc.id });
            })
          })
          this.dbProfile.doc(res.uid).onSnapshot(snapshot => {
            this.profile.image = snapshot.data().image;
            this.profile.name = snapshot.data().name;
            this.profile.number = snapshot.data().number;
            this.profile.address = snapshot.data().address;
            this.profile.email = snapshot.data().email;
          })
        }
      })
    }, 0);
  }
  logout() {
    firebase.auth().signOut();
  }
  viewReciept(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
      }
    };
    this.navCtrl.navigateForward(['order-closed'], navigationExtras)
  }
  trackOrder(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
      }
    };
    this.navCtrl.navigateForward(['order-tracking'], navigationExtras)
  }
  editProfile() {
    this.navCtrl.navigateForward('/edit-profile')
  }
  viewProd(id) {
    // if (this.itemChecked === true) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
      }
    };
    this.navCtrl.navigateForward(['/item-view'], navigationExtras).then(() => {
      this.delete(id);
    });
    // } 
  }
  delete(id) {
    this.dbWishlist.doc(id).delete().then((res) => {
    })
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
  visitWish() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.dbWishlist.where('customerUID', '==', user.uid).onSnapshot((info) => {
          if (info.size == 0) {
            this.presentAlert('Wishlist');
          } else {
            this.navCtrl.navigateForward('wish-list');
          }
        })

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
        this.dbCart.where('customerUID', '==', user.uid).onSnapshot((info) => {
          if (info.size == 0) {
            this.presentAlert('Cart');
          } else {
            this.navCtrl.navigateForward('cart');
          }
        })
      } else {
        this.presentAlertConfirm1();
      }
    })
  }
  async presentAlert(name) {
    const alert = await this.alertCtrl.create({
      header: name + ' empty',
      message: 'Please view our new products and add to ' + name.toLowerCase(),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // this.alertView = true;
            // this.localSt.store('alertShowed', this.alertView);
          }
        }
      ]
    });

    await alert.present();
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

  updateProfile() {
    this.dbProfile.doc(firebase.auth().currentUser.uid).update({
      name: this.profile.name, email: this.profile.email, address: this.profile.address,
      number: this.profile.number
    }).then(() => {
      // this.editprofile = !this.editprofile;
      this.toastController();
    })
    //console.log('My profile ', p);
  }
  async toastController() {
    let toast = await this.toastCtrl.create({ message: 'Profile update', duration: 2000 })
    return toast.present()
  }

  viewProduct(val) {
    this.dbProduct.doc(val.id).update({ viewed: firebase.firestore.FieldValue.increment(1) })
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: val.id,
        image: val.data.image,
        imageBack: val.data.imageBack,
        imageSide: val.data.imageSide,
        imageTop: val.data.imageTop,
        item: val.data.item,
        name: val.data.name,
        sizes: val.data.sizes,
        description: val.data.description,
        productCode: val.data.productCode,
        category: val.data.category,
        price: val.data.price
      }
    };

    this.navCtrl.navigateForward(['/item-view'], navigationExtras);
  }
  placeOrder() {
    let docname = 'PITSENG' + new Date().getTime();
    this.dbOrder.doc(docname).set({
      product: this.myOrder, timestamp: new Date().getTime(), status: 'received', userID: firebase.auth().currentUser.uid, totalPrice: this.getTotal(),
      deliveryType: this.delType, deliveryCost: this.delCost
    }).then(() => {
      this.myOrder = [];
      this.delType = '';
      this.delCost = 0;
      this.prodCart.forEach((i) => {
        this.dbCart.doc(i.id).delete().then(() => {
        });
      })
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
  getCart() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.viewCart = !this.viewCart
        this.viewBackdrop = !this.viewBackdrop
      } else {
        this.presentAlertConfirm1();
      }
    })
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

  reviewed() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.viewWishlist = !this.viewWishlist
        this.viewBackdrop = !this.viewBackdrop
      } else {
        this.presentAlertConfirm1();
      }
    })

  }

  gotoProfile() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.viewProfile = !this.viewProfile
        this.viewBackdrop = !this.viewBackdrop
      } else {
        this.presentAlertConfirm1();
      }
    })


  }

  viewPendingOrders() {
    this.viewPending = !this.viewPending
  }

  pending() {
    this.pendingOrders = !this.pendingOrders
  }

  history() {
    this.orderHistory = !this.orderHistory
  }

  editInputs() {
    this.showInputs = !this.showInputs
  }

  async presentModal(id, name) {
    const modal = await this.modalController.create({
      component: PaymentPage,
      cssClass: "home",
      componentProps: {
        id: id,
        name: name
      }
    });
    return await modal.present();
  }
  search() {
    this.navCtrl.navigateForward('search');
  }
  async presentHistory(id) {
    const modal = await this.modalController.create({
      component: FaqsPage,
      cssClass: "home",
      componentProps: {
        id: id,
        name: name
      }
    });
    return await modal.present();
  }
}
