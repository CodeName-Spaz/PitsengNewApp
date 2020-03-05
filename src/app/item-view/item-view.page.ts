import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
yudsegment: string;
  constructor() { }

  ngOnInit() {
    this.yudsegment ="like";
  }
   segmentChanged(ev: any) {
    console.log('Segment changed', ev)
   }

}
