import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { User } from 'app/schema/user';
import { MyAccountCredentialsComponent } from './components/my-account-credentials/my-account-credentials.component';

// from https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
interface BeforeInstallPromptEvent {
  platforms: string[];
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; }>;
  prompt: () => Promise<void>;
}

@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {

  user?: User;

  modal?: HTMLIonModalElement;

  beforeinstallprompt?: BeforeInstallPromptEvent;

  installed: boolean = false;

  promptShown: boolean = false;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    this.user = await this.api.get<User>("me:user");
  }

}
