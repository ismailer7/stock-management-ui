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
    destroyRef = inject(DestroyRef);
    isChecked: boolean = false;


    constructor(private fb: FormBuilder) {
        this.saleForm = this.fb.group({
            description: ['', Validators.required],
            product: [, Validators.required],
            saleQuantity: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
            discount: [, [Validators.pattern(/^[0-9]*$/), Validators.min(0)]],
            saleDate: []
        });
    }

    
    onCheckboxChange(){
        
        this.isChecked = !this.isChecked;
            this.productSelected = this.products.find(p => p.id === this.selectedSale.product.id);
            this.saleForm.setValue({
                description: this.selectedSale?.description,
                product: this.productSelected,
                saleQuantity: this.selectedSale?.saleQuantity,
                discount: this.selectedSale?.discount,
                saleDate: this.selectedSale?.saleDate
            });
        console.log("checkbox value:",this.isChecked)

        if(this.isChecked){
          this.isEditMode = true;
          this.saleForm.enable();
        }else{
        this.isView = true;
        this.saleForm.disable(); 
        }
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

        this.isEditMode = this.selectedSale !== null;
        this.saleForm.enable();
        this.saleForm.reset();

        if (this.isEditMode) {
            this.productSelected = this.products.find(p => p.id === this.selectedSale.product.id);
            this.saleForm.setValue({
                description: this.selectedSale?.description,
                product: this.productSelected,
                saleQuantity: this.selectedSale?.saleQuantity,
                discount: this.selectedSale?.discount,
                saleDate: this.selectedSale?.saleDate
            });
        }
        if(this.isEditMode && this.isView){
           this.saleForm.disable();
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

        this.submitted = true;
        if (this.saleForm.invalid) {
            return;
        }
        const newSale = this.saleForm.value;
        if (this.isEditMode) {
            const id = this.selectedSale.id;
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
        if (!this.isEditMode) 
            this.reset();  
        
       if(this.isEditMode && !this.isView) {
         (document.getElementById('btn_close') as HTMLFormElement)?.click(); 
        }

        if(this.isView){
            this.isChecked = false;
            (document.getElementById('edit_checkbox') as HTMLInputElement).checked = false;
            (document.getElementById('btn_close') as HTMLFormElement)?.click();       
        }

    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape')
            this.close();

    }

    reset() {

        (document.getElementById('btn_close') as HTMLFormElement)?.click();
        this.saleForm.reset()
        this.saleForm.patchValue({
            buyDate: formatDate(new Date(), 'yyyy-MM-dd', 'en')
        });
        this.submitted = false
    }

    print(){

        this.saleService.exportPdf(this.selectedSale?.id).subscribe({
            next: (response: Blob) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'SaleReport.pdf'; 
              a.click(); 
              window.URL.revokeObjectURL(url); // Clean up
            },
            error: (err) => {
              console.error('Error downloading the PDF:', err);
            }
          });
          this.close();
    }

}









