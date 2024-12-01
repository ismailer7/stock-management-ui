import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http = inject(HttpClient);
  constructor() { }



getDashboardStatistics(){

  return this.http.get<Dashboard>(`${environment.rooturl}/dashboard`, { observe: 'response', withCredentials: true });
}








}
