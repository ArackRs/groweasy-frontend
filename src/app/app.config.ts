import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './auth.interceptor';
import {ApiBaseService} from './services/api-base.service';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {MessageService} from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        // options: {
        //   prefix: 'p',
        //   darkModeSelector: 'system',
        //   cssLayer: false
        // }
      }
    }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    MessageService,
    ApiBaseService,
    AuthService,
    UserService,
    importProvidersFrom(
      BrowserAnimationsModule,
      ReactiveFormsModule
    ), provideCharts(withDefaultRegisterables())
  ]
};
