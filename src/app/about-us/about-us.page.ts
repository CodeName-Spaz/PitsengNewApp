import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  // dbWishlist = firebase.firestore().collection('Wishlist');
  dbContactUs = firebase.firestore().collection('ContactUs');
  db = firebase.firestore();
  about  : any=[];
  isabout = false;
  service: any= [];
  isservice = false;
  user = {
    uid: '',
    email: firebase.auth().currentUser.email
  }
  message = {
    fullname: '',
    email: '',
    subject: '',
    message:''
 }
 myProduct = false;
  constructor(private router: Router,  public modalController: ModalController,public toastCtrl: ToastController) { 
    this.adminInfo();
  }


  ngOnInit() {
    this.getAbout()
    this.getServices()
  }
 
  async toastController(message) {
    let toast = await this.toastCtrl.create({ message: message, duration: 2000 });
    return toast.present();
}

addMessage() {
  if(firebase.auth().currentUser){
   let customerUid = firebase.auth().currentUser.uid;
   this.dbContactUs.add({
     customerUid: customerUid,
     timestamp: new Date().getTime(),
     name : this.message.fullname,
     email : this.message.email,
     subject : this.message.subject,
     message : this.message.message

     
    }).then(() => {
      this.toastController('Message Sent!')
   }).catch(err => {
            console.error(err);
   });

   this.message = {
    fullname: '',
    email: '',
    subject :'',
    message:''
 }

  }else{
    //this.createModalLogin();
  }
}

  Info = []
adminInfo(){
  this.db.collection('admins').get().then(snapshot => {
  this.Info = [];
  if (snapshot.empty) {
         this.myProduct = false;
       } else {
         this.myProduct = true;
         snapshot.forEach(doc => {
           this.Info.push(doc.data());
           console.log("admin", this.Info);
         });
         
       }
   })
}

getAbout(){
  this.about = [];
  this.db.collection('AboutUs').get().then(snapshot => {
    if (snapshot.empty !== true) {
      this.isabout = true;
      snapshot.forEach(doc => {
        this.about.push(doc.data());
      });
    } else {
      console.log('No about');
      
    }
   });
}
getServices(){
  this.service = [];
  this.db.collection('Service').get().then(snapshot => {
    if (snapshot.empty !== true) {
      this.isservice = true;
      snapshot.forEach(doc => {
        this.service.push(doc.data());
      });
    } else {
      console.log('No service');
      
    }
   });
}

// sucessMesssage(){
//   Swal.fire(
//     'Good job!',
//     'You clicked the button!',
//     'success'
//   )
// }

}
