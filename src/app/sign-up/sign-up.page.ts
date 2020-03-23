import { Component, OnInit, } from '@angular/core';
import { LoadingController, AlertController, ModalController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
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
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private router: Router,
    public modalController: ModalController,
    public navCtrl :  NavController
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      name:[''],
      phone:['', Validators.compose([Validators.minLength(10),Validators.maxLength(10), Validators.required])],
      address:['', Validators.compose([Validators.minLength(5),Validators.required])]
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
          this.name = res.displayName;
        } else {
          this.email = '';
          this.name = '';
        }
      })
    },0)
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
      });
    });
  }
  async signupUser(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        signupForm.value
      );
    } else {
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;
      const name: string = signupForm.value.name; 
      const address: string = signupForm.value.address;
      const phone: string = signupForm.value.phone
      this.authService.signupUser(email, password, name,address,phone,this.image).then(
        () => {
          this.loading.dismiss().then(() => {
             this.createProfile(email,name);
          })
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
            
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    }
   this.loading
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

  backToLogin(){
    this.navCtrl.pop();
  }

async openLogin(){
  const modal = await this.modalController.create({
    component:LoginPage,
    cssClass: 'login-sign-up',
    
  
  });
  return await modal.present();
  // this.router.navigateByUrl('/login');
}
  
success(){
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

