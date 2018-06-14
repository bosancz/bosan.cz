import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css']
})
export class UsersAdminComponent implements OnInit {

  breadcrumbs = [
    { "url": "/interni", "name": "Interní" },
    { "url": "/interni/uzivatele", "name": "Uživatelé" }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
