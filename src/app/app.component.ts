import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router
  ) {
    this.initializeApp();
    this.checkUser();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  checkUser() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged((res) => {
        if (res) {
          this.router.navigateByUrl('home')
          // this.splashScreen.hide();
          // console.log("User..", res.phoneNumber);
        } else {
          this.router.navigateByUrl('login')
        }
      })
    }, 0);

  }
}
