import { Injectable } from '@angular/core';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  
  auth2:any;

  constructor() {
    
    this.auth2 = new Promise((resolve,reject) => {
      gapi.load('auth2', () => {

        var auth2 = gapi.auth2.init({
          client_id: '249555539983-j8rvff7bovgnecsmjffe0a3dj55j33hh.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        
        if(auth2) resolve(auth2);
        else reject();
      });
    });

  }

  async signIn():Promise<string>{

    var auth2 = await this.auth2;

    await auth2.signIn();

    var token = auth2.currentUser.get().getAuthResponse(true).id_token;

    return token;
  }

  async signOut():Promise<void>{
    var auth2 = await this.auth2;
    await auth2.signOut();
  }
}
