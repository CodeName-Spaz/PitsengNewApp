import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  // cartItemCount:BehaviorSubject<number>;
  // wishItemCount: BehaviorSubject<number>;
  dbProduct = firebase.firestore().collection('Products');
  value
  yudsegment: string;
  prod_id: string;
  prod_name;
  prod_image;
  sizes = [];
  desc;
  quantity: number = 1;
  price;
  my_size: string = "";
  sizeIndex = null;
  dbCart = firebase.firestore().collection("Cart");
  dbWishlist = firebase.firestore().collection("Wishlist");
  category;
  onWish="heart-outline";
  constructor(public route: ActivatedRoute, public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.route.queryParams.subscribe(params => {
      this.prod_id = params["id"];
      /* this.prod_name = params["name"];
      this.prod_image = params["image"];
      this.sizes = params["sizes"];
      this.desc = params["description"];
      this.price = params["price"];
      this.category = params["category"]; */
    })
  }

  ngOnInit() {
    this.getProduct();
    // this.activatedRouter.queryParams.subscribe(params =>{
    //   this.Mydata.prod_id = params["id"];
    //   this.Mydata.prod_name = params["name"];
    //   this.Mydata.prod_image = params["image"];
    //   this.Mydata.prod_productCode = params["productCode"];
    //   this.Mydata.prod_imageSide = params["imageSide"];
    //   this.Mydata.prod_imageBack = params["imageBack"];
    //   this.Mydata.prod_imageTop = params["prod_imageTop"];
    //   this.Mydata.prod_categories = params["categories"];
    //   this.Mydata.prod_price = params["price"];
    //   this.Mydata.prod_quantity = params["quantity"];
    //   this.Mydata.prod_items = params["items"];
    //   this.Mydata.prod_checked = params["checked"];
    //   this.Mydata.prod_lastcreated = params["lastcreated"];
    //   this.Mydata.prod_description = params["description"]
    // console.log("rrrrrrrrrr",  this.Mydata.prod_productCode, this.Mydata.prod_price, this.Mydata.prod_name);
    // })
    this.getWishItems();
    this.yudsegment = "like";
    // this.wishItemCount = this.cartService.getWishItemCount();
    // this.cartItemCount = this.cartService.getCartItemCount();
  }
  getProduct() {
    this.dbProduct.doc(this.prod_id).onSnapshot((doc) => {
      this.prod_image = doc.data().image;
      this.prod_name = doc.data().name;
      // this.prod_image = params["image"];
      this.sizes = doc.data().sizes;
      this.desc = doc.data().description;
      this.price = doc.data().price;
      this.category = doc.data().category;
    })
  
  }
  getWishItems() {
    this.dbWishlist.doc(this.prod_id).onSnapshot((res)=>{
      if (res.exists === true) {
        if (res.data().customerUID === firebase.auth().currentUser.uid) {
          this.onWish = "heart";
        } else {
           this.onWish="heart-outline";
        }
      } else {
       console.log("No items found");
       
      }
    })
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev)
  }
  getTotal() {
    let total = 0;
    // for (let i = 0; i < this.prodCart.length; i++) {
    // let product = this.prodCart[i].data.product;
    // console.log(product);
    // product.forEach((item) => {
    total += this.price * this.quantity
    // })
    //
    // }
    //console.log('My tot ', total);

    return total;
  }
  visitWish() {
    this.navCtrl.navigateForward('wish-list');
  }
  visitCart() {
    this.navCtrl.navigateForward('cart');
  }
  sizeChosen(data, index) {
    // console.log("event ", ev);
    /*    if (ev.detail.checked === true) {
         this.myArr.push(data)
         
       } else {
         this.myArr.splice(this.myArr.indexOf(data), 1);
         
         
       } */

    this.sizeIndex = index
    this.my_size = data;
    console.log('MY size ', this.my_size);
  }
  plus() {
    this.quantity += 1
  }
  minus() {
    if (this.quantity <= 1) {
      this.toastController('Quantity must be positive')
    } else {
      this.quantity -= 1
    }
  }
  async toastController(message) {
    let toast = await this.toastCtrl.create({ message: message, duration: 2000 });
    return toast.present();
  }

  addToCart() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          let descr = "";
          if (this.my_size === "") {
            descr = "size"
          }
          if (this.my_size === "") {
            this.toastController('Missing selection of ' + descr);
          } else {
            this.dbCart.add({
              customerUID: firebase.auth().currentUser.uid, timestamp: new Date().getTime(), product: [{
                product_name: this.prod_name, size: this.my_size,
                quantity: this.quantity, cost: this.price, picture: this.prod_image,
                prod_id: this.prod_id
              }]
            }).then(() => {
              this.sizeIndex = null;
              this.quantity = 1;
              this.toastController('Added to basket')
            })
          }
        } else {
          // this.alertView = this.localSt.retrieve('alertShowed');
          this.presentAlertConfirm1();
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
  wishListAdd() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res1) => {
        if (res1) {
          // this.heartIndex = index;
          this.dbWishlist.doc(this.prod_id).get().then((res) => {
            if (res.exists == true) {
              if (res.data().customerUID === res1.uid ) {
                this.dbWishlist.doc(res.id).delete().then((res) => {
                  this.toastController('Removed from wishlist..');
                })
              } else {
                console.log("uid not found, unable to delete");
                
              }
            } else {
              this.dbWishlist.doc(this.prod_id).set({
                customerUID: firebase.auth().currentUser.uid, price: this.price,
                image: this.prod_image, name: this.prod_name, id: this.prod_id, category: this.category,
              }).then(() => {
                // this.myProduct[index].wish = 'heart';
                this.toastController('Added to wishlist..');
              })
            }
          })
        } else {
          // this.alertView = this.localSt.retrieve('alertShowed');
          this.presentAlertConfirm1();
        }
      })
    }, 0);
  }

  popBack() {
    this.navCtrl.pop();
  }

}