import {inject, Injectable} from '@angular/core';
import {Category} from '../models/category.model';
import {MOCK_CATEGORIES} from '../data/mock-categories';
import {Observable, of, Subject} from 'rxjs';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { SortDirection } from '@angular/material/sort';
import { CategoryPage } from '../models/category-page.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  $triggerLoading = new Subject();
  http = inject(HttpClient);

  getAllCategories() {
    return this.http.get<Category[]>(`${environment.rooturl}/category/all`, { observe: 'response', withCredentials: true });
  }
  
  getCategoriesFiltered(
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
  return this.http.get<CategoryPage>(`${environment.rooturl}/category/filtred`, { params: params, observe: 'response', withCredentials: true });
}

  addCategory(category : Category){
    return this.http.post<Category>(`${environment.rooturl}/category/add`, category,  {observe: 'response', withCredentials: true })
  }

  editCategory(id: Number, category : Category){
    return this.http.put<Category>(`${environment.rooturl}/category/edit/${id}`, category,  {observe: 'response', withCredentials: true })
  }

  deleteCategory(id: Number){
    return this.http.delete(`${environment.rooturl}/category/delete/${id}`, {responseType: "text", withCredentials: true })
  }

  deleteCategoriesById(idList:number[]){
    return this.http.delete(`${environment.rooturl}/category/deletebyids`, {
      body: idList, 
      responseType: 'text',
      withCredentials: true
    }

    )}
}
