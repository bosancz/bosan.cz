import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent {

  @Input() set url(url:string){
    this.mapUrl = url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : undefined;
  }
  
  mapUrl:SafeResourceUrl;
  
  constructor(private sanitizer:DomSanitizer) {
  }

}
