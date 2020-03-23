import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import * as firebase from 'firebase'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';


import { LoginPageModule } from '../app/login/login.module';
import { SignUpPageModule } from '../app/sign-up/sign-up.module';
import { ProfilePageModule } from './profile/profile.module';
import { PaymentPageModule } from './payment/payment.module';
import { FaqsPageModule } from './faqs/faqs.module';
import { AboutUsPageModule } from './about-us/about-us.module';
import { InfoPageModule } from './info/info.module'
// import { StarRatingModule } from 'ionic4-star-rating';

// var firebaseConfig = {
//   apiKey: "AIzaSyCnRo3S9hOi1R9vMpnYNW5ajcpJh5G1tvo",
//   authDomain: "pitsengtest.firebaseapp.com",
//   databaseURL: "https://pitsengtest.firebaseio.com",
//   projectId: "pitsengtest",
//   storageBucket: "pitsengtest.appspot.com",
//   messagingSenderId: "728167140242",
//   appId: "1:728167140242:web:7b16d2f988fee781c90f4b",
//   measurementId: "G-TKFFCKLRTQ"
// };
var firebaseConfig = {
  // apiKey: "AIzaSyCnRo3S9hOi1R9vMpnYNW5ajcpJh5G1tvo",
  // authDomain: "pitsengtest.firebaseapp.com",
  // databaseURL: "https://pitsengtest.firebaseio.com",
  // projectId: "pitsengtest",
  // storageBucket: "pitsengtest.appspot.com",
  // messagingSenderId: "728167140242",
  // appId: "1:728167140242:web:7b16d2f988fee781c90f4b",
  // measurementId: "G-TKFFCKLRTQ"


  // apiKey: "AIzaSyD96pHc4rjR85yGc7y1Es4e1mGocFqHVjE",
  // authDomain: "pitseng-arts.firebaseapp.com",
  // databaseURL: "https://pitseng-arts.firebaseio.com",
  // projectId: "pitseng-arts",
  // storageBucket: "pitseng-arts.appspot.com",
  // messagingSenderId: "628652538196",
  // appId: "1:628652538196:web:b17d822fe6eb6702f9f0c1",
  // measurementId: "G-N7X15WH9QB"


  apiKey: "AIzaSyCnRo3S9hOi1R9vMpnYNW5ajcpJh5G1tvo",
  authDomain: "pitsengtest.firebaseapp.com",
  databaseURL: "https://pitsengtest.firebaseio.com",
  projectId: "pitsengtest",
  storageBucket: "pitsengtest.appspot.com",
  messagingSenderId: "728167140242",
  appId: "1:728167140242:web:7b16d2f988fee781c90f4b",
  measurementId: "G-TKFFCKLRTQ"


  // apiKey: "AIzaSyAxqR5pSWPudGtn3cvZlubPjwY-U6K5NRc",
  // authDomain: "pitsengdb-e8f33.firebaseapp.com",
  // databaseURL: "https://pitsengdb-e8f33.firebaseio.com",
  // projectId: "pitsengdb-e8f33",
  // storageBucket: "pitsengdb-e8f33.appspot.com",
  // messagingSenderId: "262790398266",
  // appId: "1:262790398266:web:eeeebec9076853a0cc1003",
  // measurementId: "G-ZJEW6XRQ6M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule, 
    IonicSelectableModule,
    //  StarRatingModule,
    ReactiveFormsModule,
    LoginPageModule,
    SignUpPageModule,
    ProfilePageModule,
    PaymentPageModule,
    FaqsPageModule,
    AboutUsPageModule,
    InfoPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
 
})
export class AppModule {}
