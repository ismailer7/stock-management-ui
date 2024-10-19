import {Component, DestroyRef, HostListener, inject, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../../models/category.model';
import {CommonModule, formatDate} from "@angular/common";
import {CategoryService} from "../../../services/category.service";
import {TranslateModule} from '@ngx-translate/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-operation-product',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, TranslateModule],
    templateUrl: './operacion-product.component.html',
    styleUrl: './operacion-product.component.css'
})
export class OperacionProductComponent {

    categoryService = inject(CategoryService);
    productService = inject(ProductService);
    productForm: FormGroup;
    toastr = inject(ToastrService);
    categories: Category[] = []
    submitted = false;
    @Input() selectedProduct!: any;
    @Input() isView:boolean;
    categorySelected: any;
    isEditMode = false;
    destroyRef = inject(DestroyRef)

    constructor(private fb: FormBuilder) {

        this.categoryService.getAllCategories()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (resp) => {
                    const data = resp.body ?? []
                    this.categories = [...data]
                },
                error: _ => this.toastr.error('Error loading Categories')
            })
    }

    ngOnChanges() {

        console.log("ngonchange triggered");
        console.log("isview satus:",this.isView);
        this.isEditMode = this.selectedProduct !== null;
        console.log("edit mode:", this.isEditMode);
        if (this.isEditMode) {
            this.categorySelected = this.categories.find(c => c.id === this.selectedProduct.category.id);
            if(this.isView){
                this.productForm.disable();
              }else{
            this.productForm = this.fb.group({
                productName: [this.selectedProduct?.productName || '', Validators.required],
                productCode: [this.selectedProduct?.productCode, Validators.required],
                description: [this.selectedProduct?.description],
                quantity: [this.selectedProduct?.quantity, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                unitBuyPrice: [this.selectedProduct?.unitBuyPrice, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                unitSellPrice: [this.selectedProduct?.unitSellPrice, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                buyDate: [this.selectedProduct?.buyDate],
                category: [this.categorySelected, Validators.required]
            });
        }
        } else {
            this.productForm = this.fb.group({
                productName: ['', Validators.required],
                productCode: ['', Validators.required],
                description: [''],
                quantity: [, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                unitBuyPrice: [, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                unitSellPrice: [, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                buyDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
                category: [, Validators.required]
            });
        }
    }

    submit() {

        this.submitted = true;
        if (this.productForm.invalid) {
            return;
        }
        const newProduct = this.productForm.value;
        if (this.isEditMode) {
            const id = this.selectedProduct.id;
            console.log("edit product with id: ", id)
            this.productService.editProduct(id, newProduct)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (resp) => {
                        const np = resp.body
                        console.log(np);
                        this.toastr.success('Product edited!', 'Notification!');
                        this.productService.$triggerLoading.next(np);
                        this.close();
                    },
                    error: (err: Error) => this.toastr.error(err.message, 'Error!')
                })
        } else {
            this.productService.addProduct(newProduct)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
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
    }

    close() {

        if (!this.isEditMode) {
            console.log("erase for add only");
            this.reset();
        } else (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    reset() {

        (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
        this.productForm.reset()
        this.productForm.patchValue({
            buyDate: formatDate(new Date(), 'yyyy-MM-dd', 'en')
        });
        this.submitted = false
    }

    print(){}
}
