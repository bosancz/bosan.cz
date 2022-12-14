import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { LoginService } from "app/core/services/login.service";
import { map } from "rxjs/operators";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  expired = this.route.params.pipe(map((params) => params.expired));

  status?: string;

  view: string = "login";

  loginValue: string = "";

  googleLoginAvailable = this.loginService.googleLoginAvailable;

  version = "X.X.X";

  constructor(private navController: NavController, private route: ActivatedRoute, private loginService: LoginService) {}

  ngOnInit() {}

  async login(loginForm: NgForm) {
    const result = await this.loginService.loginCredentials(loginForm.value);

    if (result.success) {
      return this.loginSuccess();
    } else {
      this.status = result.error;
    }
  }

  async loginGoogle() {
    const result = await this.loginService.loginGoogle();

    if (result) {
      return this.loginSuccess();
    } else {
      this.status = "googleFailed";
    }
  }

  async sendLoginLink(linkForm: NgForm) {
    this.status = "linkSending";

    const formData = linkForm.value;
    const result = await this.loginService.sendLoginLink(formData.login);

    if (result.success) this.status = "linkSent";
    else this.status = result.error;
  }

  async loginSuccess() {
    const return_url = this.route.snapshot.queryParams["return_url"];

    if (return_url) {
      this.navController.navigateBack([return_url]);
    } else {
      this.navController.navigateRoot(["/"]);
    }
  }
}
