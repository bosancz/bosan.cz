import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";

import { ApiService } from "app/services/api.service";

import { User } from "app/shared/schema/user";
/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable({
  providedIn: 'root'
})
export class UserService {

  userSnapshot:User;

  user:ReplaySubject<User> = new ReplaySubject(null);

  constructor(private api:ApiService){
    this.user.subscribe(user => this.userSnapshot = user);
  }
  
  async loadUser(){
    try{
      const user = await this.api.get<User>("me:user");
      this.user.next(user);
    }
    catch(err) {
      if(err.status === 404 || err.status === 401) this.user.next(null);
      else throw err;
    }
  }
  
}