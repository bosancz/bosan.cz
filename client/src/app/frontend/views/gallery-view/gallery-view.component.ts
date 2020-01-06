import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";

@Component({
  selector: 'gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.css']
})
export class GalleryViewComponent implements OnInit {

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Fotogalerie");
  }

}
