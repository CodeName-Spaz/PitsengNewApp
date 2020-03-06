import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
// import Swal from 'sweetalert2';

import * as firebase from 'firebase'
  import { from } from 'rxjs';
// import { RegisterPage } from '../register/register.page';
import { Router } from '@angular/router';
// import { ResetPasswordPage } from '../reset-password/reset-password.page';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  validations_form: FormGroup;
  errorMessage: string = '';
  

  constructor(
 
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public loadingCtrl: LoadingController
 
  ) { }

  loader: boolean = true;
  ionViewWillEnter() {
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }
  ngOnInit() {
 
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }
 
 
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
 
 
  loginUser(value){
    firebase.auth().signInWithEmailAndPassword(value.email, value.password)
    .then(res => {
      this.presentLoading();
      this.errorMessage = "";
      this.navCtrl.navigateForward('/home');
    }, err => {
      this.errorMessage = err.message;
    });
  }
  facebookSignIn(){
    
  }

    dismissLoader(){
  this.loadingCtrl.dismiss({
    'dismissed':true
  });
}
  googleSignin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().getRedirectResult().then( (result) => {
      if (!result.user) {
        firebase.auth().signInWithRedirect(provider);
      } else {
        this.router.navigateByUrl('home');
      }
  }).catch(function (error) {
    console.log(error)
    // ...
  });
  }

 
  createAccount(){
    this.navCtrl.navigateForward('/sign-up');
    // this.createModalRegister();
  }

  async createModalLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
      
    });
    return await modal.present();
  }
  // async createModalRegister() {
  //   const modal = await this.modalController.create({
  //     component: RegisterPage,
  //     cssClass: 'login-register',
   
  //   });
  //   return await modal.present();
  // }
  // async resetPassword(){
  //   let modal = await this.modalController.create({
  //     component : ResetPasswordPage,
  //     cssClass: 'resetModal'
  //   })
    
  //   return await modal.present();
  //  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  async success(){
    const alert = await this.alertController.create({
      header: 'Logging.....',
      subHeader: 'Success',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
    
      // const alert = await this.alertController.create({
      //   header: '',
      //   subHeader: '',
      //   message: 'logging.....',
       
      // });
  
      // await alert.present();
      // setTimeout(() => {
      // }, 500)
    }
    
    async presentLoading() {
      const loading = await this.loadingCtrl.create({
        message: 'Logging in.....',
      }); 
      await loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 3000);
  
      // const { role, data } = await loading.onDidDismiss();
  
      // console.log('Loading dismissed!');
    }
}
