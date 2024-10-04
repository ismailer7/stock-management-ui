import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sale } from '../models/sale.model';
import { environment } from '../../environments/environment';
import { SortDirection } from '@angular/material/sort';
import { SalePage } from '../models/sale-page.model';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  $triggerLoading = new Subject();
  http = inject(HttpClient);

  getAllSales(){
    return this.http.get<Sale[]>(`${environment.rooturl}/sale/all`, { observe: 'response', withCredentials: true });
  }

  getSalesFiltered(
    search_filter: string = '',
    sort_field: string = '',
    sort_order: SortDirection,
    page: number = 1,
    limit_per_page: number = 5
) {
  const params = new HttpParams()
      .set('input', search_filter)
      .set("sort", sort_field)
      .set("order", sort_order)
      .set("page", page)
      .set("per_page", limit_per_page);
  return this.http.get<SalePage>(`${environment.rooturl}/sale/filtred`, { params: params, observe: 'response', withCredentials: true });
}



}
