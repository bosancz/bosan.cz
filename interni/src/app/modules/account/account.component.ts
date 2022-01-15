import { Component } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { User } from 'app/schema/user';

@Component({
  selector: 'bo-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  user?: User;

  modal?: HTMLIonModalElement;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    this.user = await this.api.get<User>("me:user");
  }

}
