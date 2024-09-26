import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {MOCK_PRODUCTS} from "../data/mock-products";
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = MOCK_PRODUCTS;
  categories: Category[] = MOCK_CATEGORIES;
  // $products = of(this.products)
  $products = new BehaviorSubject(this.products);

  getAllProducts(): BehaviorSubject<Product[]> {
    return this.$products;
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
