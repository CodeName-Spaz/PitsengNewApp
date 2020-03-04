import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderClosedPage } from './order-closed.page';

const routes: Routes = [
  {
    path: '',
    component: OrderClosedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderClosedPageRoutingModule {}
