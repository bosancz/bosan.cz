import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// remove previous service workers for frontend only
if (window.navigator && window.navigator.serviceWorker) {

  window.navigator.serviceWorker.getRegistrations()
    .then(registrations => registrations.filter(registration => registration.scope === "https://bosan.cz/" || registration.scope === "/" || !registration.scope))
    .then(registrations => {
      if (registrations.length) {
        console.log("Found obsolete service workers, removing and reloading web...")
        registrations.forEach(registration => registration.unregister());
        window.location.reload();
      }
    });

}


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
