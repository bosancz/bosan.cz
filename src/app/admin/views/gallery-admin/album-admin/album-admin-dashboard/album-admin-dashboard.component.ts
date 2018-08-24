import { Component, Input, OnInit } from '@angular/core';

import { Album } from "../../../../../schema/album";

@Component({
  selector: 'album-admin-dashboard',
  templateUrl: './album-admin-dashboard.component.html',
  styleUrls: ['./album-admin-dashboard.component.scss']
})
export class AlbumAdminDashboardComponent implements OnInit {

  @Input() album:Album;
  
  constructor() { }

  ngOnInit() {
  }

}
