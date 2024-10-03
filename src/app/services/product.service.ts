import {inject, Injectable} from '@angular/core';
import {Product} from "../models/product.model";
import {Observable, of, Subject} from "rxjs";
import {MOCK_PRODUCTS} from "../data/mock-products";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SortDirection} from "@angular/material/sort";
import {Page} from "../models/product-page.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = MOCK_PRODUCTS;
  $triggerLoading = new Subject()

  http = inject(HttpClient);

  getAllProducts(){
    return this.http.get<Product[]>(`${environment.rooturl}/product/all`, { observe: 'response', withCredentials: true });
  }

  getProductsFiltered(
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
    return this.http.get<Page>(`${environment.rooturl}/product/filtred`, { params: params, observe: 'response', withCredentials: true });
  }

  // Method to get a product by its ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(item => item.id === id);
    return of(product);
  }

  addProduct(product : Product){
    return this.http.post<Product>(`${environment.rooturl}/product/add`, product,  {observe: 'response', withCredentials: true })
  }

  editProduct(id: Number, product : Product){
    return this.http.put<Product>(`${environment.rooturl}/product/edit/${id}`, product,  {observe: 'response', withCredentials: true })
  }


  deleteProductById(id: Number) {
    return this.http.delete(`${environment.rooturl}/product/delete/${id}`, {responseType: "text", withCredentials: true })
  }
}
