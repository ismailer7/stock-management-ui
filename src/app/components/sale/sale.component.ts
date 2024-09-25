import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { PaginationComponent } from '../commun/pagination/pagination.component';
import { AddproductComponent } from '../product/addproduct/addproduct.component';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [PaginationComponent, AddproductComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {
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
