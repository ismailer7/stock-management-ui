import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const appRequestInterceptor: HttpInterceptorFn = (req, next) => {

    let httpHeaders = new HttpHeaders(); //TODO fix hardcoded token
    const username = 'admin';
    const password = '1234';
    const existToken = false;
    if (password && username) {
        httpHeaders = httpHeaders.append(
            'Authorization',
            'Basic ' + window.btoa(username + ':' + password)
        );
    } else if (existToken) {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcyNzYyODY3NiwiZXhwIjoxNzI3NjQ2Njc2fQ.d74VZihERyEdK5dP5THJqQidj4P-PXDkt3Xd87rhXsU';
        httpHeaders = httpHeaders.append(
            'Authorization',
            `Bearer ${token}`
        );
    }

    const xhr = req.clone({
        headers: httpHeaders,
    });
    return next(xhr);
};