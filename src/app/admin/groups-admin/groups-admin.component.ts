import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";

import { Group } from "../../schema/group";

@Component({
  selector: 'groups-admin',
  templateUrl: './groups-admin.component.html',
  styleUrls: ['./groups-admin.component.css']
})
export class GroupsAdminComponent implements OnInit {

  
  groups:Group[];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.getGroups().then(groups => this.groups = groups);
  }

}
