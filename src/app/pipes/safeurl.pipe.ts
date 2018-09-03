import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from "@angular/platform-browser";

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {
  
  constructor(private domSanitizer:DomSanitizer){}
  
  transform(value: string, type:string = "SafeUrl"):SafeUrl|SafeResourceUrl {
    switch(type){
      case "SafeUrl":
        return this.domSanitizer.bypassSecurityTrustUrl(value);
      case "SafeResourceUrl":
        return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
    }
      
  }

}
