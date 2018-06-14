import { Component, OnInit, Input } from '@angular/core';

export class BreadCrumb {
  url:string;
  name:string;
}

@Component({
  selector: 'bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.css']
})
export class BreadCrumbsComponent implements OnInit {

  @Input()
  breadcrumbs:BreadCrumb[] = [];
  
  constructor() { }

  ngOnInit() {
  }

}
