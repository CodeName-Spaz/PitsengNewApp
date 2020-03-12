import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
// import { IonicRatingModule } from ‘ionic4-rating’;

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  // cartItemCount:BehaviorSubject<number>;
  // wishItemCount: BehaviorSubject<number>;
  dbProduct = firebase.firestore().collection('Products');
  reviews = [];
  ratingTotal = 0;
  ratingTotalTotal;
  avgRating;
  value
  yudsegment: string;
  prod_id: string;
  prod_name;
  productCode;
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
  onWish = "heart-outline";
  imageBack: any;
  imageSide: any;
  imageTop: any;
  similarItems = [];
  uid=firebase.auth().currentUser.uid;
  constructor(public route: ActivatedRoute, public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.route.queryParams.subscribe(params => {
      this.prod_id = params["id"];
    })
  }

  ngOnInit() {
    this.getProduct(this.prod_id);
    setTimeout(() => {
      this.mostViewed();
    }, 1000);
    this.getWishItems();
    // this.getRatings()
    this.yudsegment = "like";
    // this.wishItemCount = this.cartService.getWishItemCount();
    // this.cartItemCount = this.cartService.getCartItemCount();
  }
  mostViewed() {
    this.dbProduct.orderBy('viewed','desc').limit(4).onSnapshot((res)=>{
      this.similarItems = [];
      res.forEach((doc)=>{
        if (doc.data().viewed) {
           this.similarItems.push({info:doc.data() , id : doc.id});
        } else {
          console.log("No viewed");
          
        }
      })
    })
  }

  star(num, uid, code) {
    console.log('hh', num, code)
    // console.log(code);

    firebase.firestore().collection('Reviews').where('uid', '==', uid).where('productCode', '==', code).onSnapshot(snapshot => {
      if(snapshot.size > 0) {
         console.log('update');
         
      }else {
         firebase.firestore().collection('Reviews').doc().set({
      productCode: code,
      Rating: num,
      uid: uid,
    }, {merge : true})
    this.getRatings(code)
      }
    });
   
  }
  getProduct(id) {
    this.dbProduct.doc(id).onSnapshot((doc) => {
      this.prod_image = doc.data().image;
      this.prod_name = doc.data().name;
      // this.prod_image = params["image"];
      this.sizes = doc.data().sizes;
      this.desc = doc.data().description;
      this.price = doc.data().price;
      this.category = doc.data().category;
      this.imageBack = doc.data().imageBack;
      this.imageSide = doc.data().imageSide;
      this.imageTop = doc.data().imageTop;
      this.productCode = doc.data().productCode;
    })
  }

  getRatings(code){

    firebase.firestore().collection('Reviews').where('productCode', '==', code).onSnapshot(snapshot => {
      this.reviews = [];
      snapshot.forEach(doc =>{
        console.log(doc.data());
       
        this.ratingTotal += parseFloat(doc.data().Rating);
        console.log("sdfsfsdf ",  this.ratingTotal);
       this.reviews.push(doc.data());
      })
      console.log("ratings ",  this.ratingTotal);
      this.avgRating = this.ratingTotal / this.reviews.length;
      console.log("ratings average ",  this.avgRating);
  })
}
  getWishItems() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.dbWishlist.doc(this.prod_id).onSnapshot((res) => {
          if (res.exists === true) {
            if (res.data().customerUID === user.uid) {
              this.onWish = "heart";
            } else {
              this.onWish = "heart-outline";
            }
          } else {
            // console.log("No items found");

          }
        })
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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateForward('wish-list');
      } else {
        this.presentAlertConfirm1();
      }

    })
    
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
              if (res.data().customerUID === res1.uid) {
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