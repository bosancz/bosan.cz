import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Directive({
  selector: '[adminLink]'
})
export class AdminLinkDirective {

  @Input() set adminLink(link:string){
    this.link = link;
    // ACL
  }
  
  link:string;
  allowed:boolean;

  constructor(private router:Router, private route:ActivatedRoute, private el:ElementRef) { }


  @HostListener("click",["$event"])
  onClick(event:MouseEvent){
    if(event.shiftKey && this.allowed){
      event.preventDefault();
      this.router.navigate([this.link],{relativeTo:this.route});
    }
  }

}
