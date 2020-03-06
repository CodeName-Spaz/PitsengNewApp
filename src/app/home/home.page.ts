import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  db=firebase.firestore();
  Products = []
  
  constructor() {}


  ngOnInit(){


  }



  categorylist(value){
    console.log("I am clickable", value);
    
    firebase.firestore().collection('Products').where('categories', '==', value).get().then((snapshot) =>{
      this.Products = []
      if(snapshot.size > 0){
        let obj = {obj : {}, id : ''}
        snapshot.forEach(doc =>{

          obj.obj = doc.data();
          obj.id = doc.id
          this.Products.push("My Products ", obj)
          obj = {obj : {}, id : ''}
          
        })
      }
    })
  }
}
