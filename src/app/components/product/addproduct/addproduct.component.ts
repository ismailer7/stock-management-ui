import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup , FormBuilder, Validators} from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { ProductComponent } from '../product.component';
import { Category } from '../../../models/category.model';



@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [ReactiveFormsModule, ProductComponent],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent  {

  productsService = inject(ProductService);
  productForm: FormGroup;
  toastr = inject(ToastrService);

  categories: Category[] = []



  constructor(private fb: FormBuilder, private productComponent: ProductComponent) {
    this.productsService.allCategories().subscribe( {
      next: (resp) => {
        this.categories = [...resp]
      }
    } )
    
    this.productForm = this.fb.group({
      productName: ['', Validators.required], 
      productCode: ['', Validators.required],
      description:[''],
      quantity: [, [Validators.required, Validators.min(1)]], 
      unitBuyPrice: [, [Validators.required, Validators.min(1)]],
      unitSellPrice: [, [Validators.required, Validators.min(1)]],
      buyDate:[''],
      category:['']
    });
}

addProduct() {
  const newProduct:Product = this.productForm.value;
  console.log('Product added:', newProduct);
  this.productsService.addProduct(newProduct); 
  console.log("added");
  this.toastr.success('Hello world!', 'Toastr fun!');
  this.productComponent.ngOnInit();
}

}
