import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
// import { StarRatingModule } from 'ionic4-star-rating';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  // cartItemCount:BehaviorSubject<number>;
  // wishItemCount: BehaviorSubject<number>;
  dbProduct = firebase.firestore().collection('Products');
  dbOrder = firebase.firestore().collection('Order');
  reviews = [];
  avgRating
  viewBackdrop = false;
  viewCart = false;
  viewWishlist = false;
  buttonActive: boolean = true;
  viewPending = false;
  pendingOrders = false;
  orderHistory = false;
  showInputs = false
  viewProfile = false;
  ratingTotal = 0
  ratingTotalTotal
  stars = 0
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
  onSale;
  salePrice;
  discount;
  myWish = [];
  itemAvailable = [];
  prodCart = [];
  myOrder = [];
  delCost: number;
  delType: string;
  loaderMessages = 'Loading...';
  loaderAnimate: boolean = true;
  constructor(public route: ActivatedRoute, public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.route.queryParams.subscribe(params => {
      this.prod_id = params["id"];
    })
  }

  ngOnInit() {
    this.getProduct(this.prod_id);
    setTimeout(() => {
      this.mostViewed();
      this.getWishItems();
    }, 1000);
    
    // this.getRatings()
    this.yudsegment = "like";

    setTimeout(() => {
      this.loaderAnimate = false;
    }, 4000);
  }
  mostViewed() {
    this.dbProduct.orderBy('viewed', 'desc').limit(4).onSnapshot((res) => {
      this.similarItems = [];
      res.forEach((doc) => {
        if (doc.data().viewed) {
          this.similarItems.push({ info: doc.data(), id: doc.id });
        } else {
          console.log("No viewed");

        }
      })
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

  viewProd(id) {
    // if (this.itemChecked === true) {
    this.getProduct(id);
    this.reviewed();
    // } 
  }
  delete(id) {
    this.dbWishlist.doc(id).delete().then((res) => {
    })
  }
  star(num, code) {
    console.log('hh', num, code)

    firebase.firestore().collection('Reviews').where('uid', '==', firebase.auth().currentUser.uid).where('productCode', '==', code).onSnapshot(snapshot => {
      if (snapshot.size > 0) {
        console.log('update');

      } else {
        firebase.firestore().collection('Reviews').doc().set({
          productCode: code,
          Rating: num,
          uid: firebase.auth().currentUser.uid,
          prod_id: this.prod_id
        }, { merge: true })
        this.getRatings(code, this.prod_id)
      }
    });

  }
  showPictures(data) {
    this.prod_id = data.id;
    this.getProduct(data.id)
    /* this.prod_name = data.info.name;
    this.prod_image = data.info.image;
    this.imageTop = data.info.imageTop;
    this.imageBack = data.info.imageBack;
    this.imageSide = data.info.imageSide;
    this.price = data.info.price;
    this.desc = data.info.description;
    this.sizes = data.info.sizes;
    this.productCode = data.info.productCode;
    this.avgRating = data.info.avgRating  */
  }
  openAboutUS() {
    this.navCtrl.navigateForward('/about-us')
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
  search() {
    this.navCtrl.navigateForward('search');
  }
  removeProd(id) {
    this.dbCart.doc(id).delete().then((res) => {
    })
  }
  logRatingChange() {
    firebase.firestore().collection('Products').onSnapshot(snapshot => {
      this.reviews = []
      snapshot.forEach(item => {
        this.reviews.push(item.data());
        console.log("Rates ", item.data());

      })
    })
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
      this.onSale = doc.data().onSale;
      this.salePrice = doc.data().salePrice;
      this.discount = doc.data().percentage;
      this.avgRating = doc.data().avgRating;
      // this.getRatings(doc.data().productCode, id)
    })
  }

  getRatings(code, id) {
    console.log('i am running');

    firebase.firestore().collection('Reviews').where('productCode', '==', code).get().then(snapshot => {
      this.reviews = [];
      snapshot.forEach(doc => {
        console.log(doc.data());

        this.ratingTotal += parseFloat(doc.data().Rating);
        this.reviews.push(doc.data());
      })

      this.avgRating = Math.round(this.ratingTotal / this.reviews.length);
      console.log("Product Star Ratings ", this.avgRating);
      return firebase.firestore().collection('Products').doc(id).update({
        avgRating: this.avgRating
      })
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

          }
        })
        this.dbWishlist.where('customerUID', '==', user.uid).onSnapshot((res) => {
          this.myWish = [];
          res.forEach((doc) => {
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
        this.dbCart.where('customerUID', '==', user.uid).onSnapshot((info) => {
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
  goHome() {
    this.navCtrl.navigateRoot('/home')
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev)
  }
  getTotal() {
    let total = 0;
    for (let i = 0; i < this.prodCart.length; i++) {
      let product = this.prodCart[i].data.product;
      product.forEach((item) => {
        total += item.cost * item.quantity
      })
    }
    //console.log('My tot ', total);
    return total;
  }
  getTot() {
    let total = 0;
    if (this.onSale === true) {
      total += this.salePrice * this.quantity
    } else {
      total += this.price * this.quantity
    }
        
   
    //console.log('My tot ', total);
    return total;
  }
  visitWish() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user.uid) {
        this.navCtrl.navigateForward('wish-list');
      } else {
        this.presentAlertConfirm1();
      }

    })

  }
  visitCart() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user.uid) {
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
  pluss(prod, index) {
    let num = index.data.product[0].quantity++
    index.data.product[0].cost = index.data.product[0].cost
    let id = index.id
    let product = [prod]
    this.dbCart.doc(id).update({ product: product }).then(res => {

    })
  }
  minuss(prod, index) {
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
            this.dbCart.doc(id).delete().then((res) => {
            })
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


  addToCart() {


    // let addCart = firebase.firestore().collection('Cart')
    // let increment: number = 0
    // addCart.where('productCode', '==', productCode).get().then((snapshot => {
    // if(snapshot.size > 0){
    //   console.log("am existing", productCode);
    //   snapshot.forEach(data => {
    //     console.log("am existing");
    //     increment = data.data().quantity +   this.quantity 
    //     addCart.doc(data.id).set({quantity: increment }, {merge: true});
    //     console.log('items increment by one');

    //   })
    // }else{
    //   this.dbCart.add({
    //     customerUID: firebase.auth().currentUser.uid, timestamp: new Date().getTime(), product: [{
    //       product_name: this.prod_name, size: this.my_size,
    //       quantity: this.quantity, cost: this.price, picture: this.prod_image, productCode: this.productCode, description : this.desc,
    //       prod_id: this.prod_id
    //     }]
    //   }).then(() => {
    //     this.sizeIndex = null;
    //     this.quantity = 1;
    //     this.toastController('Added to basket')
    //   })
    // }
    // })) 


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
            if (this.onSale === true) {
              this.dbCart.add({
                customerUID: firebase.auth().currentUser.uid, timestamp: new Date().getTime(), product: [{
                  product_name: this.prod_name, size: this.my_size,
                  quantity: this.quantity, cost: this.salePrice, picture: this.prod_image, productCode: this.productCode, description: this.desc,
                  prod_id: this.prod_id
                }]
              }).then(() => {
                this.sizeIndex = null;
                this.quantity = 1;
                this.toastController('Added to basket')
              })
            } else {
              this.dbCart.add({
                customerUID: firebase.auth().currentUser.uid, timestamp: new Date().getTime(), product: [{
                  product_name: this.prod_name, size: this.my_size,
                  quantity: this.quantity, cost: this.price, picture: this.prod_image, productCode: this.productCode, description: this.desc,
                  prod_id: this.prod_id
                }]
              }).then(() => {
                this.sizeIndex = null;
                this.quantity = 1;
                this.toastController('Added to basket')
              })
            }

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
                  this.onWish = "heart-outline";
                })
              } else {
                console.log("uid not found, unable to delete");

              }
            } else {
              this.dbWishlist.doc(this.prod_id).set({
                customerUID: firebase.auth().currentUser.uid, price: this.price,
                image: this.prod_image, name: this.prod_name, id: this.prod_id, category: this.category, productCode: this.productCode,
                description: this.desc
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

  reviewed() {
    this.viewWishlist = !this.viewWishlist
    this.viewBackdrop = !this.viewBackdrop
  }

  getCart() {
    this.viewCart = !this.viewCart
    this.viewBackdrop = !this.viewBackdrop
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

  menuOpen: boolean = false;
  menuBtn = "menu"
  showMenu() {
    let myMenu = document.getElementById("options");
    var menu_items = document.getElementsByClassName("menu-item") as HTMLCollectionOf<HTMLElement>;
    if (this.menuOpen == false) {
      this.menuOpen = true;
      myMenu.style.top = "50px";
      this.menuBtn = "close"
    }
    else {
      menu_items[0].style.animation = "sliderOut 300ms"
      setTimeout(() => {
        myMenu.style.top = "-100vh"
        this.menuOpen = false;
        menu_items[0].style.animation = "sliderIn 300ms";
        this.menuBtn = "menu"
      }, 299);
    }
  }

}