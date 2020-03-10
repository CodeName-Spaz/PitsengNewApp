import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  uid
  Profile= []
  isprofile = false;

  profile = {
    image: '',
    name: '',
    number: '',
    address: '',  
    email: '',
    uid: '',
  }
  admin={
     uid: '',
     email: ''
    }
  

  constructor(public alertCtrl: AlertController, private router: Router) {
    if(firebase.auth().currentUser) {
      this.profile.email = firebase.auth().currentUser.email;
      this.uid = firebase.auth().currentUser.uid;
     } else {
       console.log('error user not logged in');
       
     }
    
   }

  ngOnInit() {


    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Got admin', user);
        this.admin.uid = user.uid
        this.admin.email = user.email
      this.getProfile();
      } else {
        console.log('no admin');
        
      }
    })
  }


  getProfile(){

    firebase.firestore().collection('UserProfile').where('uid', '==', this.admin.uid).onSnapshot(snapshot => {
      console.log('Profile details');
      
      this.Profile=[]
      if (snapshot.empty) {
        this.isprofile = false;
      } else {
        this.isprofile = true;
        snapshot.forEach(doc => {
          this.profile.image=doc.data().image;
          this.profile.name=doc.data().name;
          this.profile.number=doc.data().number;
          this.profile.address=doc.data().address;
          this.profile.email=doc.data().email;
        })
      }
    })
  }

  editProfile(){
    console.log("Going to edit profile");
    
    this.router.navigateByUrl('/edit-profile')
  }
  ordersOpen:boolean = false;
  historyOpen:boolean = false;
  toggleOrders(){
    var ordersArrow = document.getElementById("orders-arrow");
    var myOrders = document.getElementById("myOrders");
    if(this.ordersOpen == false){
      this.ordersOpen = true;
      ordersArrow.style.transform = "rotateX(180DEG)";
      myOrders.style.height = "auto";
      myOrders.style.opacity = "1";
      myOrders.style.padding = "2px";
      this.historyOpen = true;
      this.toggleHistory()
    }
    else{
      this.ordersOpen = false;
      ordersArrow.style.transform = "rotateX(0DEG)";
      myOrders.style.height = "0";
      myOrders.style.opacity = "0";
      myOrders.style.padding = "0px";
    }
    // console.log("orders: " + this.ordersOpen);
    
  }
  toggleHistory(){
    
    var myArrow = document.getElementById("history-arrow");
    var myHistory = document.getElementById("myHistory");
    if(this.historyOpen == false){
      this.historyOpen = true;
      myArrow.style.transform = "rotateX(180DEG)";
      myHistory.style.height = "auto";
      myHistory.style.opacity = "1";
      myHistory.style.padding = "2px";
      this.ordersOpen = true;
      this.toggleOrders()
    }
    else{
      this.historyOpen = false;
      myArrow.style.transform = "rotateX(0DEG)";
      myHistory.style.height = "0";
      myHistory.style.opacity = "0";
      myHistory.style.padding = "0px";
      
    }
    // console.log("history: " +this.historyOpen); 
  }
}
