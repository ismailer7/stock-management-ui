import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {appRequestInterceptor} from "./interceptor/app.request.interceptor";
import { HttpClient, HttpClientJsonpModule, HttpHandler } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { loadingInterceptor } from './interceptor/loading.interceptor';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimations(), provideToastr({
    timeOut: 3000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: false,
  }), provideAnimationsAsync(), provideHttpClient(
      withInterceptors([appRequestInterceptor]),
      withFetch(),
  ),
  TranslatePipe,
  importProvidersFrom(
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ),provideHttpClient(withInterceptors([loadingInterceptor]))
   
]
};
