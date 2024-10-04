import { HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
