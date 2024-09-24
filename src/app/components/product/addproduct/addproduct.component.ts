import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup , FormBuilder, Validators} from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent  {

  productsService = inject(ProductService);
  productForm: FormGroup;


  constructor(private fb: FormBuilder) {
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



onSubmit() {
  const newProduct:Product = this.productForm.value;
  console.log('Product added:', newProduct);
  this.productsService.addProduct(newProduct);  
}


  toastr = inject(ToastrService);


  addProduct(): void {
    console.log("added");
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

}
