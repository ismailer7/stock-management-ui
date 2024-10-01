import {inject, Injectable} from '@angular/core';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Product} from "../models/product.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = MOCK_CATEGORIES;
  http = inject(HttpClient);

  getAllCategories() {
    return this.http.get<Category[]>(`${environment.rooturl}/category/all`, { observe: 'response', withCredentials: true });
  }

  addCategory(category : Category){
    this.categories.push(category);
  }

  deleteCategory(index: any): Observable<Category[]>{
    this.categories.splice(index, 1);
    return of(this.categories);
  }
}
