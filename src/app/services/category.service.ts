import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = MOCK_CATEGORIES;
  
  getAllCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  addCategory(category : Category){
    this.categories.push(category);
  }
}
