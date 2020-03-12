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
  public signupForm: FormGroup;
  public loading: any;
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
      name:['']
    });
  }

  ngOnInit() {}

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

      this.authService.signupUser(email, password, name).then(
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

