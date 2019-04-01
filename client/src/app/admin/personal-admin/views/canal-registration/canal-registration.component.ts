import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";

import { ConfigService } from "app/core/services/config.service";

@Component({
  selector: 'canal-registration',
  templateUrl: './canal-registration.component.html',
  styleUrls: ['./canal-registration.component.scss']
})
export class CanalRegistrationComponent implements OnInit, OnDestroy {

  formUrl:string;
  attendeesUrl:string;

  view:string;

  paramsSubscription:Subscription;

  constructor(private router:Router,private route:ActivatedRoute,private configService:ConfigService) { }

  ngOnInit() {
    this.loadUrls();

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(!params.view) return this.router.navigate(["./", {view: "form"}], {relativeTo: this.route, replaceUrl: true});

      this.view = params.view;
    });
  }

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  loadUrls():void{
    this.configService.getConfig().then(config => {
      this.formUrl = config.canal.formUrl;
      this.attendeesUrl = config.canal.attendeesUrl;
    });
  }

}
