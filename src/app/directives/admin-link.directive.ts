import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ACLService } from "../services/acl.service";

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
  color:string;
  cursor:string;

  constructor(private router:Router, private route:ActivatedRoute, private acl:ACLService, private el:ElementRef) { }


  @HostListener("click",["$event"])
  onClick(event:MouseEvent){
    if(event.shiftKey && this.allowed){
      event.preventDefault();
      this.router.navigate([this.link],{relativeTo:this.route});
    }
  }

  ngAfterViewInit(){
    this.color = this.el.nativeElement.style.color;
    this.cursor = this.el.nativeElement.style.cursor;
  }

  @HostListener("window:keydown",["$event"])
  onKeyDown(event:KeyboardEvent){
    if(event.key === "Shift" && this.allowed){
      this.el.nativeElement.style.color = "#f00";
      this.el.nativeElement.style.cursor = "pointer";
    }
  }
  
  @HostListener("window:keyup",["$event"])
  onKeyUp(event:KeyboardEvent){
    if(event.key === "Shift" && this.allowed){
      this.el.nativeElement.style.color = this.color;
      this.el.nativeElement.style.cursor = this.cursor;
    }
  }

}
