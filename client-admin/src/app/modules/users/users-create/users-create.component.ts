import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { User } from 'app/schema/user';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@Component({
  selector: 'users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss']
})
export class UsersCreateComponent implements OnInit {

  actions: Action[] = [
    {
      text: "Vytvořit",
      icon: "add-outline",
      handler: () => this.createUser()
    }
  ];

  @ViewChild("createUserForm") form!: NgForm;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async createUser() {
    // get data from form
    const userData = this.form.value;

    // create the user and wait for confirmation
    const response = await this.api.post("users", userData);

    // show the confrmation
    this.toastService.toast("Uživatel vytvořen.");

    // get the new user
    const location = response.headers.get("location");

    if (!location) {
      this.toastService.toast("Chyba při otevírání nového uživatele.");
      return;
    }

    const user = await this.api.get<User>({ href: location });

    // open the user
    this.router.navigate(["/uzivatele", user._id], { replaceUrl: true });

  }

}
