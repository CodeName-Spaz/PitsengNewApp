import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemViewPageRoutingModule } from './item-view-routing.module';

import { ItemViewPage } from './item-view.page';
import { IonicRatingModule } from 'ionic-rating';

// import { IonicRatingModule } from 'ionic-rating';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    ItemViewPageRoutingModule
  ],
  declarations: [ItemViewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ ]
})
export class ItemViewPageModule {}
