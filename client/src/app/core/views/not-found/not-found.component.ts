import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Meta } from '@angular/platform-browser';

import { ToastService } from "app/core/services/toast.service";
import { TitleService } from "app/core/services/title.service";

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

  url:string;
  
  constructor(
    private router:Router,
    private toastService:ToastService,
    private titleService:TitleService,
    private metaService:Meta,
  ) { }

  ngOnInit() {
    this.titleService.setPageTitle("404 Nenalezeno");
    this.setNoIndex();
    
    this.url = (location.pathname || location.href);
  }

  ngOnDestroy() {
    this.removeNoIndex();
  }

  setNoIndex() {
    this.metaService.addTag({ name: 'googlebot', content: 'noindex' });
    this.metaService.addTag({ name: 'robots', content: 'noindex' });
  }

  removeNoIndex(){
    this.metaService.removeTag('name="googlebot"');
    this.metaService.removeTag('name="robots"');
  }

}
