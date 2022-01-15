import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { ApiService } from "app/core/services/api.service";
import { GoogleService } from "app/core/services/google.service";
import { ToastService } from './toast.service';
import { UserService } from './user.service';

export interface LoginResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  onLogin: EventEmitter<void> = new EventEmitter();
  onLogout: EventEmitter<void> = new EventEmitter();

  googleLoginAvailable = this.googleService.loaded;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleService,
    private userService: UserService,
    private toastService: ToastService
  ) {
  }

  async loginCredentials(credentials: { login: string, password: string; }): Promise<LoginResult> {

    const result: LoginResult = { success: true };

    try {

      await this.api.post("login", credentials);

      await this.userService.loadUser();
    }
    catch (err: any) {
      result.success = false;

      if (err.status === 401) result.error = "invalidCredentials";
      else if (err.status === 503) result.error = "credentialsLoginNotAvalible";
      else throw err;
    }

    return result;

  }

  async loginGoogle(): Promise<LoginResult> {

    try {
      // get google token
      const googleToken = await this.googleService.signIn();

      // validate token with the server
      await this.api.post("login:google", { token: googleToken });

      await this.userService.loadUser();

      return { success: true };
    }
    catch (err) {
      return { success: false };
    }

  }

  async loginImpersonate(userId: string) {
    try {
      await this.api.post("login:impersonate", { id: userId });

      await this.userService.loadUser();

      return { success: true };
    }
    catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async sendLoginLink(login: string): Promise<LoginResult> {
    const result: LoginResult = { success: true };

    try {
      await this.api.post("login:sendlink", { login });
    }
    catch (err: any) {
      result.success = false;
      if (err.status === 404) result.error = "userNotFound";
      else result.error = "error";
    }

    return result;
  }

  async logout() {
    await this.api.post("logout");
    const user = await this.userService.loadUser();

    if (user) this.toastService.toast("Přihlášen zpět jako " + user.login);
  }

}