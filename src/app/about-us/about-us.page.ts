import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  // user = {
  //   uid: '',
  //   email: firebase.auth().currentUser.email
  // }
  message = {
    fullname: '',
    email: '',
    subject: '',
    message:''
 }
  aboutForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    subject: new FormControl('', Validators.required),
    msg: new FormControl('', Validators.minLength(20)),
  })
//  aboutForm = F.group({
//   firstName: [''],
//   lastName: [''],
//   address: this.fb.group({
//     street: [''],
//     city: [''],
//     state: [''],
//     zip: ['']
//   }),
// });
 myProduct = false;
  constructor(private router: Router,  public modalController: ModalController,public toastCtrl: ToastController) { 
    this.adminInfo();
  }


  ngOnInit() {
    this.getAbout()
    // this.getServices()
  }
 
  async toastController(message) {
    let toast = await this.toastCtrl.create({ message: message, duration: 2000 });
    return toast.present();
}
goHome() {
  this.router.navigateByUrl('/home')
}
getCart() {

}
reviewed() {

}
openAboutUS() {
  this.router.navigateByUrl('/about-us')
}
search() {
  this.router.navigateByUrl('search');
}
gotoProfile() {
  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     this.viewProfile = !this.viewProfile
  //     this.viewBackdrop = !this.viewBackdrop
  //   } else {
  //     this.presentAlertConfirm1();
  //   }
  // })


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
