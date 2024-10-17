import {ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideToastr} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {appRequestInterceptor} from "./interceptor/app.request.interceptor";
import {TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader'
import {loadingInterceptor} from './interceptor/loading.interceptor';
import {registerLocaleData} from "@angular/common";
import localeMa from '@angular/common/locales/fr-MA';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeMa, 'fr-MA');
export const appConfig: ApplicationConfig = {
    providers: [
        {provide: LOCALE_ID, useValue: 'fr-MA'},
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimations(),
        provideToastr({
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
        ), provideHttpClient(withInterceptors([loadingInterceptor]))

    ]
};
