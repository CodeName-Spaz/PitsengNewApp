import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import * as firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyD96pHc4rjR85yGc7y1Es4e1mGocFqHVjE",
  authDomain: "pitseng-arts.firebaseapp.com",
  databaseURL: "https://pitseng-arts.firebaseio.com",
  projectId: "pitseng-arts",
  storageBucket: "pitseng-arts.appspot.com",
  messagingSenderId: "628652538196",
  appId: "1:628652538196:web:b17d822fe6eb6702f9f0c1",
  measurementId: "G-N7X15WH9QB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
