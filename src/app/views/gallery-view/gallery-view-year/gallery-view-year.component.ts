import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";

@Component({
  selector: 'gallery-view-year',
  templateUrl: './gallery-view-year.component.html',
  styleUrls: ['./gallery-view-year.component.css']
})
export class GalleryViewYearComponent implements OnInit, OnDestroy {

  year:number;
  
  paramsSubscription:Subscription;
  
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.year = params.year;
    })
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

}
