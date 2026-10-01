import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    // provideHttpClient is REQUIRED for HttpClient to work in standalone Angular apps.
    // withFetch() opts into the modern Fetch API backend instead of XMLHttpRequest.
    provideHttpClient(withFetch()),
  ],
};
