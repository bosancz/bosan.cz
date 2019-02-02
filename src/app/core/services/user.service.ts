import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { ApiService } from "app/core/services/api.service";

import { User } from "app/core/schema/user";
/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable({
  providedIn: 'root'
})
export class UserService {

  user:BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private api:ApiService){
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