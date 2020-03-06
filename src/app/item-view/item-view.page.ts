import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  yudsegment: string;
  prod_id : string;
  prod_name;
  prod_image;
  constructor(public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.prod_id = params["id"];
      this.prod_name = params["name"];
      this.prod_image = params["image"];
    })
  }

  ngOnInit() {
    this.yudsegment = "like";
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev)
  }

}
