import {inject, Injectable} from '@angular/core';
import {Product} from "../models/product.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {MOCK_PRODUCTS} from "../data/mock-products";
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SortDirection} from "@angular/material/sort";
import {Page} from "../models/product-page.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = MOCK_PRODUCTS;
  categories: Category[] = MOCK_CATEGORIES;
  // $products = of(this.products)
  $products = new BehaviorSubject(this.products);


  http = inject(HttpClient);

  getAllProducts(){
    return this.http.get<Product[]>(`${environment.rooturl}/product/all`, { observe: 'response', withCredentials: true });
  }

  getProductsFiltered(
      search_filter: string,
      sort_field: string,
      sort_order: SortDirection,
      page: number,
      limit_per_page: number
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
    this.products = [...this.products, product];
    this.$products.next(this.products)
  }

allCategories(): Observable<Category[]> {
  return of(this.categories);
}


}
