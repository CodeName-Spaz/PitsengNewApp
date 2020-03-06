import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  db = firebase.firestore()


  name
  email


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
  loader:  boolean = true;
  isprofile: boolean = false;
;
  constructor(public alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        firebase.firestore().collection("UserProfile").onSnapshot(data => {
          data.forEach(item => {
            if(item.data().uid == firebase.auth().currentUser.uid){
              this.name = item.data().name;
              this.email = firebase.auth().currentUser.email
            }
          })
        })
      
      }
    })
  }

  createAccount() {
    if (!this.profile.address || !this.profile.name || !this.profile.number){
      this.errtext = 'Fields should not be empty'
    } else {
      if (!this.profile.image) {
        this.errtext = 'Profile image still uploading or not selected';
      } else {
        if(firebase.auth().currentUser) {
          this.profile.uid = firebase.auth().currentUser.uid;
          this.db.collection('UserProfile').doc(firebase.auth().currentUser.uid).set(this.profile).then(res => {
            console.log('Profile created');
            this.router.navigateByUrl('/home')
            this.getProfile();
          }).catch(error => {
            console.log('Error');
          });
        }else {
          console.log('Unable to edit profile. due to anonymous uid');
          
        }
 
      
      }
    }
  }

  getProfile() {
    this.db.collection('UserProfile').where('uid', '==', this.user.uid).get().then(snapshot => {
      if (snapshot.empty) {
        this.isprofile = false;
      } else {
        this.isprofile = true;
        snapshot.forEach(doc => {
          this.profile.address = doc.data().address;
          this.profile.image = doc.data().image
          this.profile.name = doc.data().name
          this.profile.number = doc.data().number
          this.profile.email = doc.data().email
        })
      }
    })
  }

  changeListener(event): void {

    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress , '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        console.log('File avail at: ', dwnURL);
        this.profile.image = dwnURL;
      });
    });


  }

}
