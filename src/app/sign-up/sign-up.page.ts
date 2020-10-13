import { Component, OnInit, } from '@angular/core';
import { LoadingController, AlertController, ModalController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  db = firebase.firestore()
  storage = firebase.storage().ref();
  dbProfile = firebase.firestore().collection('UserProfile');
  public signupForm: FormGroup;
  public loading: any;
  name;
  email;
  image;
  phoneNumber;
  myArr = [];
  uid;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private router: Router,
    public modalController: ModalController,
    public navCtrl: NavController,
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: [''],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required])],
      address: ['', Validators.compose([Validators.minLength(5), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ngOnInit() {
    this.checkUser()

    // this.signupForm.value.password = firebase.auth().currentUser.uid
  }
  checkUser() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          this.email = res.email;
          this.image = res.photoURL;
          this.name = res.displayName;
          this.phoneNumber = res.phoneNumber;
          this.uid = res.uid;
          this.dbProfile.doc(res.uid).onSnapshot((doc)=>{
            if (doc.exists) {
              this.navCtrl.navigateRoot('home');
            } else {
              console.log('Create your account');
            }
          })
        } else {
          // this.email = '';
          this.name = '';
          this.image = '';
        }
      })
    }, 0)
  }
  phone(ev) {
    if (ev.detail.data === null) {
      this.myArr.splice(this.myArr.lastIndexOf(this.myArr[this.myArr.length - 1]));
    } else {
      this.myArr.push(ev.detail.data)
    }
  }
  gotoLogin() {
    this.navCtrl.navigateBack('login');
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
        // this.dbProfile.doc(firebase.auth().currentUser.uid).set({
        //   image: dwnURL
        // }, { merge: true })
        this.image = dwnURL;
        this.getPhotoUrl(dwnURL);
      });
    });
  }
  getPhotoUrl(url) {
    return url;
  }
  async signupUser(signupForm: FormGroup): Promise<void> {
    const address: string = signupForm.value.address;
    const password: string = signupForm.value.password;
    const email: string = signupForm.value.email;
    const name: string = signupForm.value.name;
    const phone: string = signupForm.value.phone;
    const image : string = this.image;
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          // this.email = res.email;
          // this.image = res.photoURL;
          // name = res.displayName;
          // this.phoneNumber = phone;
          // this.uid = res.uid;
          this.dbProfile.doc(res.uid).set({
            name: res.displayName,
            email: res.email,
            uid: res.uid,
            address: address,
            number: phone,
            image: res.photoURL
          })
          this.navCtrl.navigateRoot('home');
          // .then((r) =>
          //   error => {
          //     this.loading.dismiss().then(async () => {
          //       const alert = await this.alertCtrl.create({
          //         message: error.message,
          //         buttons: [{ text: 'Ok', role: 'cancel' }]
          //       });
          //       await alert.present();

          //     });
          //   }
          // );
        } else {
          //  console.log("My pictute, ",image);
          //     console.log("name ", name);
              
              // setTimeout(() => {
                firebase
                .auth().createUserWithEmailAndPassword(email, password).then((newUserCredential: firebase.auth.UserCredential) => {
                  setTimeout(() => {
                    firebase.firestore().doc(`/UserProfile/${newUserCredential.user.uid}`).set({
                    name: signupForm.value.name,
                    email : email,
                    uid:newUserCredential.user.uid,
                    address: address,
                    number: phone,
                    image : image
            
                  });
                  }, 1000);
                  this.navCtrl.navigateRoot('home');
                  // firebase.firestore().collection("UserProfile").doc().set({
                  //   name: name
                  // })
                }).catch(error => {
                  console.error(error);
                  throw new Error(error);
                });
              // }, 1000);
          //  
        }
      })
    }, 0)
    // this.presentLoading();
    // this.navCtrl.navigateRoot('home');
  }
  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }
  createProfile(email, name) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        name: name,
        email: email,
      }
    };
    this.navCtrl.navigateForward(['/home'], navigationExtras);
  }

  backToLogin() {
    this.navCtrl.pop();
  }

  async openLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
      cssClass: 'login-sign-up',


    });
    return await modal.present();
    // this.router.navigateByUrl('/login');
  }

  success() {
    // Swal.fire({
    //   icon: 'success',
    //   title: 'Account  in successfully ',
    //   showClass: {
    //     popup: 'animated fadeInDown faster'
    //   },
    //   hideClass: {
    //     popup: 'animated fadeOutUp faster'
    //   },
    //   showConfirmButton: false,
    //   timer: 500
    // })
  }
}

