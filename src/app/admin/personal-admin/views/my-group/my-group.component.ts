import { Component, OnInit } from '@angular/core';

import { MyGroupService } from "./my-group.service";

@Component({
  selector: 'my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent implements OnInit {

  constructor(private groupService:MyGroupService) { }

  ngOnInit() {
    this.loadGroup();
  }
  
  async loadGroup(){
    
  }

}
