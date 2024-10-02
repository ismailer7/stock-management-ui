import { inject, Injectable } from '@angular/core';
import { MOCK_USER } from '../data/mock-user';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  testsession = false;  
  http = inject(HttpClient);

  constructor() { }

 /*  login(username: string, password: string): boolean {

    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      localStorage.setItem('isLoggedIn', 'true'); 
      return true;
    }
    return false;
  } */

  login(username: string, password: string) {
    const loginPayload = {
      "username": username,
      "password": password
    }
    return this.http.post(`${environment.rooturl}/user/login`, loginPayload, { observe: 'response', withCredentials: false });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn'); 
  }

  logout():void {
    localStorage.removeItem('isLoggedIn'); 
  }
  }

