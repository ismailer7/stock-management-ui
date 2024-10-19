import {Component, DestroyRef, HostListener, inject, Input} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {SalesService} from '../../../services/sales.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product} from '../../../models/product.model';
import {ToastrService} from 'ngx-toastr';
import {CommonModule, formatDate} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ErrorResponse} from '../../../models/error-response.model';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
    products: Product [] = [];
    @Input() selectedSale!: any;
    @Input() isView:boolean;
    productSelected: any;
    isEditMode = false;
    submitted = false;
    destroyRef = inject(DestroyRef)


    constructor(private fb: FormBuilder) {

    }


    ngOnInit() {

        this.productService.getProductsByName('')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (resp) => {
                    const data = resp.body ?? [];
                    this.products = [...data];
                    console.log("Initial product list", this.products);
                },
                error: (_) => this.toastr.error('Error loading initial Products')
            });

        /* this.loadProductBySearch(); */

    }

    ngOnChanges() {

        console.log("onchange sale status: ", this.selectedSale);

        this.isEditMode = this.selectedSale !== null;
        console.log("edit mode:", this.isEditMode);
        if (this.isEditMode) {
            this.productSelected = this.products.find(p => p.id === this.selectedSale.product.id);
            if(this.isView){
                this.saleForm.disable();
              }else{
            this.saleForm = this.fb.group({
                description: [this.selectedSale?.description, Validators.required],
                product: [this.productSelected, Validators.required],
                saleQuantity: [this.selectedSale?.saleQuantity, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                discount: [this.selectedSale?.discount, [Validators.pattern(/^[1-9]*$/)]],
                saleDate: [this.selectedSale?.saleDate]
            });
        }
        } else {
            this.saleForm = this.fb.group({
                description: ['', Validators.required],
                product: [, Validators.required],
                saleQuantity: [, [Validators.required, Validators.pattern(/^[1-9]*$/)]],
                discount: [, [Validators.pattern(/^[1-9]*$/)]],
                saleDate: []
            });

        }
    }


    /*   loadProductBySearch() {
        const productSearchControl = this.saleForm.get('productSearch');

        productSearchControl?.valueChanges.pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap(value => this.productService.getProductsByName(value))
        ).subscribe({
          next: (resp) => {
            const data = resp.body ?? [];
            this.products = [...data];
            console.log("Filtered product list", this.products);
          },
          error: (err) => this.toastr.error('Error loading Products')
        });
      } */


    submit() {
        console.log("submitted")

        this.submitted = true;
        if (this.saleForm.invalid) {
            return;
        }
        const newSale = this.saleForm.value;

        console.log("this form value:", this.saleForm.value);
        if (this.isEditMode) {
            const id = this.selectedSale.id;
            console.log("edit sale with id: ", id)
            this.saleService.editSale(id, newSale)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (resp) => {
                        const np = resp.body;
                        console.log(np);
                        this.toastr.success('Sale edited!', 'Notification!');
                        this.saleService.$triggerLoading.next(np);
                        this.close();
                    },
                    error: (err) => {
                        const errorResponse = err.error as ErrorResponse;
                        const errorMessage = errorResponse?.message || 'Error';
                        this.toastr.error(errorMessage);
                    }
                })
        } else {
            this.saleService.addSale(newSale)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (resp) => {
                        const np = resp.body
                        console.log(np);
                        this.toastr.success('Sale added!', 'Notification!');
                        this.reset();
                        this.saleService.$triggerLoading.next(np)
                    },
                    error: (err) => {
                        const errorResponse = err.error as ErrorResponse;
                        const errorMessage = errorResponse?.message || 'Error';
                        this.toastr.error(errorMessage);
                    }
                })
        }
    }

    close() {
        if (!this.isEditMode) {
            console.log("errase for add only");
            this.reset();
        } else (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();


    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape')
            this.close();

    }

    reset() {

        (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
        this.saleForm.reset()
        this.saleForm.patchValue({
            buyDate: formatDate(new Date(), 'yyyy-MM-dd', 'en')
        });
        this.submitted = false
    }

    print(){}

}









