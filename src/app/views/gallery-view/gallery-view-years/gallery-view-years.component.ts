import { Component, OnInit } from '@angular/core';

import { DataService } from "../../../services/data.service";

@Component({
  selector: 'gallery-view-years',
  templateUrl: './gallery-view-years.component.html',
  styleUrls: ['./gallery-view-years.component.css']
})
export class GalleryViewYearsComponent implements OnInit {
  
  years:number[];

  constructor(private dataService:DataService) { }

  ngOnInit() {
     this.dataService.getAlbumsYears().then(years => this.years = years);
  }

}
