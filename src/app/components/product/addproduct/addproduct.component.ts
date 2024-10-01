import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../../models/category.model';
import {CommonModule} from "@angular/common";
import {CategoryService} from "../../../services/category.service";
import {formatDate} from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-addproduct',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, TranslateModule],
    templateUrl: './addproduct.component.html',
    styleUrl: './addproduct.component.css'
})
export class AddproductComponent {

    categoryService = inject(CategoryService);
    productService = inject(ProductService);
    productForm: FormGroup;
    toastr = inject(ToastrService);
    categories: Category[] = []
    submitted = false;


    constructor(private fb: FormBuilder) {
        this.categoryService.getAllCategories().subscribe({
            next: (resp) => {
                const data = resp.body ?? []
                this.categories = [...data]
            },
            error: err => this.toastr.error('Error loading Categories')
        })

        this.productForm = this.fb.group({
            productName: ['', Validators.required],
            productCode: ['', Validators.required],
            description: [''],
            quantity: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
            unitBuyPrice: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
            unitSellPrice: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
            buyDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
            category: [, Validators.required]
        });
    }

    submit() {

        this.submitted = true;
        if (this.productForm.invalid) {
            return;
        }
        const newProduct = this.productForm.value;
        this.productService.addProduct(newProduct).subscribe({
            next: (resp) => {
                const np = resp.body
                console.log(np);
                this.toastr.success('Product added!', 'Notification!');
                this.reset();
                this.productService.$triggerLoading.next(np)
            },
            error: (err: Error) => this.toastr.error(err.message, 'Error!')
        })

    }

    close() {
        this.reset();
    }

    reset() {
        (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
        this.productForm.reset()
        this.productForm.patchValue({
            buyDate: formatDate(new Date(), 'yyyy-MM-dd', 'en')
        });
        this.submitted = false

    }

}
