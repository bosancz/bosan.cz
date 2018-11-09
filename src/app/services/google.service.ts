import { Injectable } from '@angular/core';

declare const gapi:any;

declare const window:any;

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  
  gapi:any;
  
  auth2:any;

  constructor() {
    
    this.gapi = this.loadgapi();
    
    this.auth2 = this.gapi.then(gapi => this.loadAuth2(gapi));
  }
   
  loadAuth2(gapi){
    return new Promise((resolve,reject) => {
      gapi.load('auth2', () => {

        const auth2 = gapi.auth2.init({
          client_id: '249555539983-j8rvff7bovgnecsmjffe0a3dj55j33hh.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        
        if(auth2) resolve(auth2);
        else reject();
      });
    });

  }
  
  loadgapi(){
    if(gapi) return Promise.resolve(gapi);
    else{
      return new Promise((resolve,reject) => {
        window.gapi_loaded = function(){ resolve(gapi); }
      });
    }
  }

  async signIn():Promise<string>{

    const auth2 = await this.auth2;

    await auth2.signIn();

    const token = auth2.currentUser.get().getAuthResponse(true).id_token;

    return token;
  }

  async signOut():Promise<void>{
    const auth2 = await this.auth2;
    await auth2.signOut();
  }
}
