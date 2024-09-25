import { Injectable } from '@angular/core';
import {Product} from "../models/product.model";
import {Observable, of} from "rxjs";
import {MOCK_PRODUCTS} from "../data/mock-products";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  getAllProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }

  // Method to get a product by its ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find(item => item.id === id);
    return of(product);
  }

  addProduct(product: Product){
   
  }

}
