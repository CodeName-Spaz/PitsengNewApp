import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  buttonActive: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  switchView(state) {
    switch (state) {
      case 'd':
        this.buttonActive = true;
  
        break;
      case 'c':
        this.buttonActive = false;

        break;
    }
  }
}
