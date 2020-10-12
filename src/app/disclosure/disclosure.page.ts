import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { InfoPage } from '../info/info.page';

@Component({
  selector: 'app-disclosure',
  templateUrl: './disclosure.page.html',
  styleUrls: ['./disclosure.page.scss'],
})
export class DisclosurePage implements OnInit {

  constructor(private navCtrl : NavController,public modalController: ModalController) { }

  ngOnInit() {
  }
  gotoHome() {
    this.navCtrl.navigateRoot('home');
  }
  gotoTerms() {
    this.navCtrl.navigateForward('terms');
  }
  openAboutUS() {
    this.navCtrl.navigateForward('/about-us')
  }
  async createFaqs() {
    const modal = await this.modalController.create({
      component: InfoPage,
      cssClass: 'my-add-to-cart',


    });
    return await modal.present();
  }
}
