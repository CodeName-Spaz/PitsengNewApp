import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisclosurePage } from './disclosure.page';

const routes: Routes = [
  {
    path: '',
    component: DisclosurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisclosurePageRoutingModule {}
