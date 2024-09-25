import { Injectable } from '@angular/core';
import { Sale } from '../models/sale.model';
import { MOCK_SALES } from '../data/mock-sales';
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../data/mock-categories';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  sales: Sale [] = MOCK_SALES;
  products: Product[] = MOCK_PRODUCTS;
  categories: Category[] = MOCK_CATEGORIES;

  getAllSales(): Observable<Sale[]> {
    return of(this.sales);
  }
}
