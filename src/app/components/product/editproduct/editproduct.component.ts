import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup , FormBuilder, Validators} from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { ProductComponent } from '../product.component';
import { Category } from '../../../models/category.model';
import {CommonModule, formatDate} from "@angular/common";
import { CategoryService } from '../../../services/category.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-editproduct',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './editproduct.component.html',
  styleUrl: './editproduct.component.css'
})
export class EditproductComponent {

  productsService = inject(ProductService);
  categoryService = inject(CategoryService);
  productForm: FormGroup;
  toastr = inject(ToastrService);

  categories: Category[] = []
  submitted = false;
  flag:string = '';
  @Input() product!: any; 
  categorySelected: any;

  constructor(private fb: FormBuilder) {
    this.categoryService.getAllCategories().subscribe({
        next: (resp) => {
            const data = resp.body ?? []
            this.categories = [...data]
        },
        error: err => this.toastr.error('Error loading Categories')
    })  
}

  ngOnChanges() {  
    console.log(this.product);
    this.categorySelected = this.categories.find(c => c.id === this.product.category.id);
    this.productForm = this.fb.group({
    productName: [this.product?.productName || '', Validators.required],
    productCode: [this.product?.productCode, Validators.required],
    description: [this.product?.description],
    quantity: [this.product?.quantity, [Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
    unitBuyPrice: [this.product?.unitBuyPrice, [Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
    unitSellPrice: [this.product?.unitSellPrice, [Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
    buyDate: [this.product?.buyDate],
    category: [this.categorySelected, Validators.required]
  });

}

submit() {

  this.submitted = true;
  if (this.productForm.invalid) {
    return;
  }
  const newProduct = this.productForm.value;
  this.productsService.addProduct(newProduct);
  this.toastr.success('Product added!', 'Notification!');
  this.reset();
}

close(){
  this.reset();
}

reset(){
  (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
  this.productForm.reset()
  this.productForm.patchValue({
    buyDate: formatDate(new Date(), 'yyyy-MM-dd', 'en')
  });
  this.submitted = false
}

}
