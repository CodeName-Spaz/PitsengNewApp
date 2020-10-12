import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisclosurePageRoutingModule } from './disclosure-routing.module';

import { DisclosurePage } from './disclosure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisclosurePageRoutingModule
  ],
  declarations: [DisclosurePage]
})
export class DisclosurePageModule {}
