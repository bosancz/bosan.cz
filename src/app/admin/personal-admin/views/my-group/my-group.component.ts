import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";

import { Group } from "app/schema/group";

@Component({
  selector: 'my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent implements OnInit {
  
  group:Group;
  
  constructor(private api:ApiService) {
  }

  ngOnInit() {
    this.loadGroup();
  }
  
  async loadGroup(){
    this.group = await this.api.get<Group>("me:group");
  }

}
