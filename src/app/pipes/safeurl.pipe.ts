import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {
  
  constructor(private domSanitizer:DomSanitizer){}
  transform(value: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(value);
  }

}
