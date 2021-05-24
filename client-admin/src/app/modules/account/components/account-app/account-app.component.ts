import { Component, OnInit } from '@angular/core';

// from https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
interface BeforeInstallPromptEvent {
  platforms: string[];
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; }>;
  prompt: () => Promise<void>;
}

@Component({
  selector: 'bo-account-app',
  templateUrl: './account-app.component.html',
  styleUrls: ['./account-app.component.scss']
})
export class AccountAppComponent implements OnInit {

  beforeinstallprompt?: BeforeInstallPromptEvent;

  installed: boolean = false;

  promptShown: boolean = false;

  constructor() { }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (event: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      this.beforeinstallprompt = <BeforeInstallPromptEvent>event;
    });

    window.addEventListener('appinstalled', event => {
      this.installed = true;
    });
  }

  install() {

    this.promptShown = true;

    this.beforeinstallprompt?.prompt();

    // Wait for the user to respond to the prompt
    this.beforeinstallprompt?.userChoice
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
