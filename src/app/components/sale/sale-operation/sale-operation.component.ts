import { Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { SalesService } from '../../../services/sales.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, formatDate } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sale-operation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './sale-operation.component.html',
  styleUrl: './sale-operation.component.css'
})
export class SaleOperationComponent {

  saleService = inject(SalesService);
  productService = inject(ProductService);
  toastr = inject(ToastrService);
  saleForm: FormGroup;
  products : Product [] = [];

  constructor(private fb: FormBuilder) {

    this.productService.getAllProducts().subscribe({
        next: (resp) => {
         const data = resp.body ?? []
         this.products = [...data]
       },
        error: err => this.toastr.error('Error loading Products')
   
    })

    this.saleForm = this.fb.group({
     description: ['', Validators.required],
     product: [, Validators.required],
     saleQuantity: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
     discount: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
     saleDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  submit() {

    
    console.log("submitted")

  }







}
