import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { NgForm } from '@angular/forms';
import { User } from 'app/schema/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss']
})
export class UsersCreateComponent implements OnInit {

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  async createUser(form: NgForm) {
    // get data from form
    const userData = form.value;
    // create the user and wait for confirmation
    const response = await this.api.post("users", userData);
    // show the confrmation
    this.toastService.toast("Uživatel vytvořen.");

    // get the new user
    const user = await this.api.get<User>(response.headers.get("location"));
    // open the user
    this.router.navigate(["/uzivatele", user._id]);
  }

}
