import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AboutUsPageRoutingModule } from './about-us-routing.module';

import { AboutUsPage } from './about-us.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AboutUsPageRoutingModule
  ],
  declarations: [AboutUsPage]
})
export class AboutUsPageModule {}
