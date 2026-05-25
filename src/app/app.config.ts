import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { PreloadAllModules, provideRouter, UrlSerializer, withPreloading } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import * as GlobalEffects from './store/effects/global.effects';
import * as AuthAccountEffects from './store/effects/user.effects';
import * as AuthConnectEffects from './store/effects/auth.effects';
import * as TruckEffects from './store/effects/truck.effects';

import { appInitializer } from './app.init';
import { loaderInterceptor } from './shared/interceptors/loader.interceptors';
import { authFeature } from './store/features/auth.feature';
import { MyPreset } from './shared/styles/my-preset';
import { apiRequestInterceptor } from './shared/interceptors/api-request-interceptor';
import { userFeature } from './store/features/user.feature';
import { truckFeature } from './store/features/truck.feature';
import { authInterceptor } from './shared/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideStore(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictActionTypeUniqueness: true,
          strictActionWithinNgZone: true,
        },
      },
    ),
    provideEffects([GlobalEffects, AuthAccountEffects, AuthConnectEffects, TruckEffects]),
    provideState(authFeature),
    provideState(userFeature),
    provideState(truckFeature),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: 'none',
        },
      },
    }),
    MessageService,
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([loaderInterceptor, apiRequestInterceptor, authInterceptor]),
    ),
    provideAppInitializer(() => appInitializer()),
  ],
};
