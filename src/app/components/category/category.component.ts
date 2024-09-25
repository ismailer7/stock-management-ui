import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { PaginationComponent } from '../commun/pagination/pagination.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  products: Product[] = []
  productsService = inject(ProductService);

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe( {
      next: (resp) => {
        this.products = [...resp]
      }
    } )
  }

  onPageChange(event: number){
    console.log(event)
  }
}
