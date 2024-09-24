import {Component, inject, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {PaginationComponent} from "../commun/pagination/pagination.component";
import { AddproductComponent } from './addproduct/addproduct.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    PaginationComponent,
    AddproductComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  products: Product[] = []
  productsService = inject(ProductService);
  toastr = inject(ToastrService);


  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe( {
      next: (resp) => {
        this.products = [...resp]
      }
    } )
  }

  onPageChange(event: number){
    this.toastr.error('Hello world!', 'Toastr fun!');
    console.log(event)
  }

  

}
