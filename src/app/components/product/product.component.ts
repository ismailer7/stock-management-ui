import {AfterViewInit, Component, DestroyRef, ElementRef, inject, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {OperacionProductComponent} from './addproduct/operacion-product.component';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, map, merge, scan, startWith, switchMap} from "rxjs";
import {Page} from "../../models/product-page.model";
import {HttpResponse} from "@angular/common/http";
import {MatProgressBar} from "@angular/material/progress-bar";
import {LangChangeEvent, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DeleteConfirmationComponent} from "../commun/delete-confirmation/delete-confirmation.component";

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        OperacionProductComponent,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressBar,
        TranslateModule,
        DeleteConfirmationComponent
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit {

    pageSizes = [5, 10, 20, 30];
    totalCount = 0;
    products: Product[] = []
    productsService = inject(ProductService);
    toastr = inject(ToastrService);
    translatePipe = inject(TranslatePipe)
    translateSrv = inject(TranslateService)
    displayedColumns: string[] = ['checkbox','id', 'productName', 'productCode', 'quantity', 'unitBuyPrice', 'unitSellPrice', 'buyDate', 'category.name', 'action'];
    dataSource = new MatTableDataSource<Product>(this.products);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isLoading = true;
    searchKeywordFilter = new FormControl();
    selectedProduct: any = null;
    destroyRef = inject(DestroyRef)
    isView: boolean = false;
    deleteConfirmation: boolean = false;
    rowid: Number | null;
    idList: number[]= [];
    @ViewChildren('checkBoxTable') checkboxes: QueryList<ElementRef>;
    @ViewChild('headerCheckbox') headerCheckBox: ElementRef;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => (this.paginator.pageIndex = 0));   //the first on sort order change, reset back to st page.
        merge(this.searchKeywordFilter.valueChanges.pipe(debounceTime(500)), this.sort.sortChange, this.paginator.page, this.productsService.$triggerLoading)
            .pipe(scan((acc, current) => {
                    if (typeof current == "string") {
                        this.paginator.pageIndex = 0;
                    }
                    return acc;
                }, 0),
                startWith({}),
                switchMap(() => {
                    this.isLoading = true;
                    this.headerCheckBox.nativeElement.checked = false;
                    this.toggleCheckboxes();
                    this.dataSource.data = this.dataSource.data // this is to keep old data while loading to prevent flickering behavior
                    const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
                    return this.productsService
                        .getProductsFiltered(
                            filterValue,
                            this.sort.active,
                            this.sort.direction,
                            this.paginator.pageIndex,
                            this.paginator.pageSize
                        );
                }),
                map((resp: HttpResponse<Page>) => resp.body)
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data) => {
                    this.products = data?.products ?? []
                    this.dataSource.data = data?.products ?? []
                    this.idList = [];
                    setTimeout(() => {
                        this.paginator.length = data?.totalCount ?? 0
                        this.paginator.pageIndex = data?.pageIndex ?? 0
                        this.isLoading = false;
                    });
                },
                error: (_) => this.isLoading = false
            });
        this.translateSrv.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((_: LangChangeEvent) => {
                setTimeout(() => {
                    this.paginator._intl.itemsPerPageLabel = this.translatePipe.transform('APP.PAGINATION.TOTAL_ITEMS')
                    this.paginator._intl.firstPageLabel = this.translatePipe.transform('APP.PAGINATION.FIRST')
                    this.paginator._intl.previousPageLabel = this.translatePipe.transform('APP.PAGINATION.PREVIOUS')
                    this.paginator._intl.nextPageLabel = this.translatePipe.transform('APP.PAGINATION.NEXT')
                    this.paginator._intl.lastPageLabel = this.translatePipe.transform('APP.PAGINATION.LAST')
                    this.dataSource._updateChangeSubscription();
                    this.productsService.$triggerLoading.next("test")
                })

            });
    }


    /** Announce the change in sort state for assistive technology. */
    onSortChange(sortState: Sort) {
        console.log(sortState)
    }

    onPageChange(event: any) {
        console.log(event)
    }

    addProduct() {
        this.isView = false;
        this.selectedProduct = null;
        console.log("add product:", this.selectedProduct);

    }

    viewProduct(id: Number) {

        this.isView = true;
        const p = this.products.find(p => p.id == id);
        this.selectedProduct = {...p};
        console.log("view Product");
    }

    editProduct(id: Product) {
        
        this.isView = false;
        const p = this.products.find(p => p.id == id);
        //this.selectedProduct =p;
        this.selectedProduct = {...p};
        console.log("edit product", this.selectedProduct);
    }

    onRowChecked(row_Id: number,event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
          this.idList.push(row_Id);
        } else {
          this.idList = this.idList.filter(id => id !== row_Id);
        }       
    }

    getIdList(): number[] {
        if (!this.checkboxes) return [];
        return Array.from(this.checkboxes)
            .filter(cbx => cbx.nativeElement.checked)
            .map(cBox => +cBox.nativeElement.dataset['id']!);
    }

    getProductId(id: Number) {
        this.rowid = id;
    }

    getCategorieslist(){

        this.idList = this.getIdList();
    }

    toggleCheckBox($event: Event) {
        if (!this.headerCheckBox) return;
        const isChecked = ($event.target as HTMLInputElement).checked;
        if (!isChecked) this.headerCheckBox.nativeElement.checked = false;

    }

    toggleCheckboxes() {
        const isChecked = this.headerCheckBox?.nativeElement?.checked ?? false;
        if (!this.checkboxes) return;
        Array.from(this.checkboxes)
            .forEach(cbx => cbx.nativeElement.checked = isChecked);
    }

    deleteproductsbutton()
     {

        this.productsService.deleteProductsById(this.idList)
        .subscribe({
            next: (resp) => {
                this.toastr.success(resp ?? '')
                this.productsService.$triggerLoading.next(resp);
            },
            error: err => {
                this.toastr.error(err ?? '')
            } }) ;

     }

    deleteProduct(){

        if(this.rowid != null){
        this.productsService.deleteProductById(this.rowid)
        .subscribe({
            next: (resp) => {
                this.toastr.success(resp ?? '')
                this.productsService.$triggerLoading.next(resp);
            },
            error: err => {
                this.toastr.error(err ?? '')
            }
        });
    }
        /* error: err => {
                const errorResponse = err.error as ErrorResponse;
                const errorMessage = errorResponse?.message || 'Error';
                this.toastr.error(errorMessage);
            }  */
    }

    handleValueChange(newValue: any) {
        this.deleteConfirmation = newValue;
        if(this.deleteConfirmation){
            if(this.rowid == null) this.deleteproductsbutton();
            else this.deleteProduct();
        }else return;
    }


    export(){
        const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
        this.productsService.export(
            filterValue,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
        )
            .subscribe({
                next: (resp) => {
                    const link = document.createElement('a');
                    // Create an object URL for the Blob
                    const url = window.URL.createObjectURL(resp.body!);
                    const contentDisposition = resp.headers.get('Content-Disposition');
                    const filename = contentDisposition?.split('filename=')[1].replace(/"/g, '') || 'default.csv';

                    link.href = url;
                    console.log(resp);
                    link.download = filename;  // Set the filename for the downloaded file
                    link.click();  // Trigger the download
                    window.URL.revokeObjectURL(url);  // Clean up the object URL
                },
                error: err => {
                    this.toastr.error(err ?? '')
                } }) ;
    }







}
