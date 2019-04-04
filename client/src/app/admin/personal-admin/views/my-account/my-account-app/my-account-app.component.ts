import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-account-app',
  templateUrl: './my-account-app.component.html',
  styleUrls: ['./my-account-app.component.scss']
})
export class MyAccountAppComponent implements OnInit {

  beforeinstallprompt:any;
  
  installed:boolean = false;
  
  promptShown:boolean = false;
  
  constructor() { }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', event => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      this.beforeinstallprompt = event;
    });

    window.addEventListener('appinstalled', event => {
      this.installed = true;
    });
  }
  
  install(){
    
    this.promptShown = true;
    
    this.beforeinstallprompt.prompt();
    
    // Wait for the user to respond to the prompt
    this.beforeinstallprompt.userChoice
      .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.beforeinstallprompt = undefined;
    });
  }
  
  

}
