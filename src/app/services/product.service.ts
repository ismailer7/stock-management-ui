import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Observable, of} from "rxjs";
import {MOCK_PRODUCTS} from "../data/mock-products";
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = MOCK_PRODUCTS;
  categories: Category[] = MOCK_CATEGORIES;

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // Method to get a product by its ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find(item => item.id === id);
    return of(product);
  }

addProduct(product : Product){
  this.products.push(product);
}

allCategories(): Observable<Category[]> {
  return of(this.categories);
}


}
