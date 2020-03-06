import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  a = 0;
  rotate(){
    var d = document.getElementsByClassName("rot-90") as HTMLCollectionOf <HTMLElement>

    if(this.a == 0){
      this.a = 1
    d[0].style.transform = "rotateZ(-90deg) translate(-50%, 50%)"
    }
    else{
      this.a = 0
      d[0].style.transform = "rotateZ(0deg) translate(-50%, 50%)"
    }
  }

}
