import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, PopoverController, NavParams, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  db = firebase.firestore().collection('UserProfile')


  // name
  // email


  storage = firebase.storage().ref();

  profile = {
    image: '',
    name: '',
    number: '',
    address: '',
    email: '',
    uid: ''
  }

  errtext = '';
  uploadprogress = 0;
  isuploading = false;
  isuploaded = false;
  user = {
    uid: '',
    email: ''
  }
  loader: boolean = true;
  isprofile: boolean = false;
  myArr = [];
  constructor(public alertCtrl: AlertController, private router: Router, public route: ActivatedRoute, public navCtrl: NavController) {
    // this.route.queryParams.subscribe(params => {
    //   this.profile.name = params["name"];
    //   this.profile.email = params["email"];
    //   this.profile.name = params["name"];
    //   this.profile.email = params["email"];
    //   this.profile.name = params["name"];
    //   this.profile.email = params["email"];
    // })
  }

  ngOnInit() {
    this.getProfile();
  }

  createAccount() {
    this.db.doc(firebase.auth().currentUser.uid).update({ name: this.profile.name,
       number: this.profile.number,
        email: this.profile.email, 
        address: this.profile.address }).then(res => {
      this.router.navigateByUrl('/profile');
    }).catch(error => {
      console.log('Error');
    });
  }

  getProfile() {
    this.db.doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
      // if (snapshot.empty) {
      //   this.isprofile = false;
      //   console.log("No is not Profile");

      // } else {
      this.isprofile = false;
      // snapshot.forEach(doc => {
      this.profile.address = snapshot.data().address;
      this.profile.image = snapshot.data().image
      this.profile.name = snapshot.data().name
      this.profile.number = snapshot.data().number
      this.profile.email = snapshot.data().email
      // this.profile.streetAddress = doc.data().streetAddress;
      // this.profile.city = doc.data().city;
      // this.profile.code = doc.data().code
      // console.log("Yes is Profile");


      // })
      // }
    })
    ////
    //////
  }
 
  changeListener(event): void {
    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress, '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        this.db.doc(firebase.auth().currentUser.uid).set({image:dwnURL
      }, { merge: true })
        this.profile.image = dwnURL;
        this.db.doc(firebase.auth().currentUser.uid).update({image : this.profile.image})
      });
    });
  }

  popBack() {
    this.navCtrl.pop();
  }
}
