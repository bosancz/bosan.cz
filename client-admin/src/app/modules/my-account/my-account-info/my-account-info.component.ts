import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/core/services/api.service";

import { User } from "app/schema/user";

@Component({
  selector: 'my-account-info',
  templateUrl: './my-account-info.component.html',
  styleUrls: ['./my-account-info.component.scss']
})
export class MyAccountInfoComponent implements OnInit {

  user?: User;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    this.user = await this.api.get<User>("me:user");
  }

}
