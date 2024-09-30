import { Injectable } from '@angular/core';
import { MOCK_USER } from '../data/mock-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   testsession = false;  

  constructor() { }

  login(username: string, password: string): boolean {

    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      localStorage.setItem('isLoggedIn', 'true'); 
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn'); 
  }

  logout():void {
    localStorage.removeItem('isLoggedIn'); 
  }
  }

