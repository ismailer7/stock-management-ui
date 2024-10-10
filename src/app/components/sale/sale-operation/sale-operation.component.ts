import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { SalesService } from '../../../services/sales.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, formatDate } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

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
  fb = inject(FormBuilder)
  toastr = inject(ToastrService);
  saleForm: FormGroup;
  products : Product [] = [];
  @Input() selectedSale!: any;
  productSelected: any;
  isEditMode = false;
  submitted = false;


  constructor() {
  
  }


  ngOnInit(){

    this.productService.getProductsByName('').subscribe({
      next: (resp) => {
        const data = resp.body ?? [];
        this.products = [...data];
        console.log("Initial product list", this.products);
      },
      error: (err) => this.toastr.error('Error loading initial Products')
    });
    
    /* this.loadProductBySearch(); */
   
  }

  ngOnChanges(){

   console.log("onchange sale status: ",this.selectedSale);

    this.isEditMode = this.selectedSale !== null;
        console.log("edit mode:",this.isEditMode);
        if (this.isEditMode)
          {
            this.productSelected = this.products.find(p => p.id === this.selectedSale.product.id);
            this.saleForm = this.fb.group({
              description: [this.selectedSale?.description, Validators.required],
              product: [this.productSelected?.productName, Validators.required],
              saleQuantity: [this.selectedSale?.saleQuantity, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
              discount: [this.selectedSale?.discount, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
              saleDate: [this.selectedSale?.saleDate]
             });

        }
        else{
          this.saleForm = this.fb.group({
            description: ['', Validators.required],
            product: [, Validators.required],
            saleQuantity: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
            discount: [, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1)]],
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
   if (this.isEditMode === true)
       {  
           const id = this.selectedSale.id;
           console.log("edit sale with id: ",id)
           this.saleService.editSale(id,newSale).subscribe({
               next: (resp) => {
                   const np = resp.body
                   console.log(np);
                   this.toastr.success('Sale edited!', 'Notification!');
                   this.saleService.$triggerLoading.next(np)
               },
               error: (err: Error) => this.toastr.error(err.message, 'Error!')
           })
       }else
           {  
           this.saleService.addSale(newSale).subscribe({
               next: (resp) => {
                   const np = resp.body
                   console.log(np);
                   this.toastr.success('Sale added!', 'Notification!');
                   this.reset();
                   this.saleService.$triggerLoading.next(np)
               },
               error: (err: Error) => this.toastr.error(err.message, 'Error!')
           })      
           }
  }

  close() {   
    if (this.isEditMode === false)
      { console.log("errase for add only");
        this.reset();}
      else (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
        
    
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



}









