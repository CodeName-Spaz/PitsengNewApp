import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  cartItemCount:BehaviorSubject<number>;
  wishItemCount: BehaviorSubject<number>;
  
  value
  yudsegment: string;

//  Mydata={
//   prod_id : '',
//   prod_name:'',
//   prod_image:'',
//   prod_productCode:'',
//   prod_imageSide:'',
//   prod_imageBack: '',
//   prod_imageTop:'',
//   prod_categories:'',
//   prod_lastcreated:'',
//   prod_price:0,
//   prod_description:'',
//   prod_items:'',
//   sizes:[],
//   prod_checked:'',
//   prod_quantity:0
//  }

prod_id : '';
  prod_name:'';
  prod_image:'';

  customerUid: any;
  constructor(public route: ActivatedRoute, public activatedRouter: ActivatedRoute, public cartService: CartService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.prod_id = params["id"];
      this.prod_name = params["name"];
      this.prod_image = params["image"];
    })
    
  }

  ngOnInit() {

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
    this.yudsegment = "like";
    // this.wishItemCount = this.cartService.getWishItemCount();
    // this.cartItemCount = this.cartService.getCartItemCount();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev)
  }

  // wishListAdd(productCode){

 
  //     console.log( "I'm not why ", productCode);
  //     console.log( "I'm not why ", this.Mydata.prod_id);
      
  //     let wish = firebase.firestore().collection('WishList')
  //     let increment: number = 0
  //     wish.where('productCode', '==', productCode).get().then((snapshot => {
  //     if(snapshot.size > 0){
  //      console.log('Do not add to wish list');
  //       snapshot.forEach(data => {
  //         increment = data.data().quantity + this.Mydata.prod_quantity
  //         wish.doc(data.id).set({quantity: increment }, {merge: true});
  //         console.log('items increment by one');
          
  //       })
  //     }else{
  //       console.log("I AM WORKING")
        
  //         if(firebase.auth().currentUser == null){
  //            console.log('please like this');
  //           //  this.ConfirmationAlertWish();
  //           //  this.createModalLogins()
  //          }else{
  //           this.customerUid = firebase.auth().currentUser.uid;
    
    
  //           firebase.firestore().collection("WishList").doc().set({
    
  //             date: moment().format('MMMM Do YYYY, h:mm:ss a'),
  //             customerUid:firebase.auth().currentUser.uid,
  //             name:this.Mydata.prod_name,
  //             productCode:this.Mydata.prod_productCode,
  //             description:this.Mydata.prod_description,
  //             status:'received',
  //             size: this.Mydata.sizes,
  //             price:this.Mydata.prod_price,
  //             quantity: this.Mydata.prod_quantity,
  //             image:this.Mydata.prod_image,
  //             amount:this.Mydata.prod_price * this.Mydata.prod_quantity,
              
  //             // checked : this.Mydata.checked 
          
  //           })
    
  //          }
  //         //  this.wishItemCount.next(this.wishItemCount.value + 1);
  //         //  this.presentToast(event)
  //     }
  //     })) 
  //   }
    
    
  }

