import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const appRequestInterceptor: HttpInterceptorFn = (req, next) => {

    let httpHeaders = new HttpHeaders();
    const user = JSON.parse(localStorage.getItem('user')!)

    if(user != null) {
        const token = user.token
        console.log("interceptor " + token)
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