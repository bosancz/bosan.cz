import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gallery-view-home',
  templateUrl: './gallery-view-home.component.html',
  styleUrls: ['./gallery-view-home.component.css']
})
export class GalleryViewHomeComponent implements OnInit {

  thisYear:number;

  constructor() {
    this.thisYear = (new Date()).getFullYear();
  }

  ngOnInit() {
  }

}
