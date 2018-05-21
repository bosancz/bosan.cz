import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { environment } from "../../../environments/environment";


@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

  mapUrl:SafeResourceUrl;
  
  api_key:string = environment.google_maps_key;
  
  constructor(sanitizer:DomSanitizer) {
    this.mapUrl = sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/search?q=D%C4%9Btsk%C3%A1%20vod%C3%A1ck%C3%A1%20skupina%20%C5%A0%C3%81N&key=' + this.api_key);
  }
                                               
  ngOnInit() {
  }

}
