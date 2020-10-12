import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { InfoPage } from '../info/info.page';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  constructor(private navCtrl : NavController, public modalController: ModalController) { }

  ngOnInit() {
  }
  gotoHome() {
    this.navCtrl.navigateRoot('home');
  }
  openAboutUS() {
    this.navCtrl.navigateForward('/about-us')
  }
  gotoDisclaimer() {
    this.navCtrl.navigateForward('disclosure');
  }
  async createFaqs() {
    const modal = await this.modalController.create({
      component: InfoPage,
      cssClass: 'my-add-to-cart',


    });
    return await modal.present();
  }
}
