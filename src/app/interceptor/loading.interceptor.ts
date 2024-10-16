import {HttpInterceptorFn} from '@angular/common/http';
import {finalize} from 'rxjs';

import {inject} from '@angular/core';
import {LoadingService} from '../services/loading.service';
import {environment} from "../../environments/environment";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);
  const exclusions = [`${environment.rooturl}/product/filtred`,
    `${environment.rooturl}/sale/filtred`]
  if(!exclusions.includes(req.url))
    loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
