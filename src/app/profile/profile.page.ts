import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ordersOpen:boolean = false;
  historyOpen:boolean = false;
  toggleOrders(){
    var ordersArrow = document.getElementById("orders-arrow");
    var myOrders = document.getElementById("myOrders");
    if(this.ordersOpen == false){
      this.ordersOpen = true;
      ordersArrow.style.transform = "rotateX(180DEG)";
      myOrders.style.height = "auto";
      myOrders.style.opacity = "1";
      myOrders.style.padding = "5px";
      this.historyOpen = true;
      this.toggleHistory()
    }
    else{
      this.ordersOpen = false;
      ordersArrow.style.transform = "rotateX(0DEG)";
      myOrders.style.height = "0";
      myOrders.style.opacity = "0";
      myOrders.style.padding = "0px";
    }
    console.log("orders: " + this.ordersOpen);
    
  }
  toggleHistory(){
    
    var myArrow = document.getElementById("history-arrow");
    var myHistory = document.getElementById("myHistory");
    if(this.historyOpen == false){
      this.historyOpen = true;
      myArrow.style.transform = "rotateX(180DEG)";
      myHistory.style.height = "auto";
      myHistory.style.opacity = "1";
      myHistory.style.padding = "5px";
      this.ordersOpen = true;
      this.toggleOrders()
    }
    else{
      this.historyOpen = false;
      myArrow.style.transform = "rotateX(0DEG)";
      myHistory.style.height = "0";
      myHistory.style.opacity = "0";
      myHistory.style.padding = "0px";
      
    }
    console.log("history: " +this.historyOpen); 
  }
}
