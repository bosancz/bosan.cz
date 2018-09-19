import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ACLService } from "app/services/acl.service";

@Directive({
  selector: '[adminLink]'
})
export class AdminLinkDirective {

  @Input() set adminLink(link:string){
    this.link = link;
    this.allowed = this.acl.checkRoute(this.link);
  }
  
  link:string;
  allowed:boolean;

  constructor(private router:Router, private route:ActivatedRoute, private acl:ACLService, private el:ElementRef) { }


  @HostListener("click",["$event"])
  onClick(event:MouseEvent){
    if(event.shiftKey && this.allowed){
      event.preventDefault();
      this.router.navigate([this.link],{relativeTo:this.route});
    }
  }

}
