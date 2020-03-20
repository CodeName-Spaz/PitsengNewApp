import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as firebase from 'firebase';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  ports: Port[];
  mySearch = [];
  port: Port;
  loaderMessages = 'Loading...';
  loaderAnimate:boolean;
  dbProduct = firebase.firestore().collection('Products');
  constructor(public navCtrl: NavController) {
    this.ports = [
      { id: 1, name: 'Pottery' },
      { id: 2, name: 'Vases' },
      { id: 3, name: 'Deco' },
      { id: 4, name: 'Lamps' }
    ];
   }

  ngOnInit() {
  }
  searchByName(name) {
    this.loaderAnimate = true;
    this.dbProduct.where('category','==', name).onSnapshot((res) => {
      this.mySearch = [];
      setTimeout(() => {
        this.loaderAnimate = false;
      }, 2000);
      res.forEach((doc) => {
        //console.log('My res ', doc.data());
        this.mySearch.push({info:doc.data(), id: doc.id});
      })
    })
  }
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.searchByName(event.value.name)
    console.log('port:', event.value);
  }
  goHome() {
    this.navCtrl.navigateRoot('/home')
  }
  goBack(){
    this.navCtrl.pop()
  }
  viewProduct(val) {
    this.dbProduct.doc(val.id).update({ viewed: firebase.firestore.FieldValue.increment(1) })
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: val.id
      }
    };

    this.navCtrl.navigateForward(['/item-view'], navigationExtras);
  }
}
