import {AfterViewInit, Component, DestroyRef, inject, ViewChild} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {PaginationComponent} from "../commun/pagination/pagination.component";
import {OperacionProductComponent} from './addproduct/operacion-product.component';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, map, merge, scan, startWith, switchMap} from "rxjs";
import {Page} from "../../models/product-page.model";
import {HttpResponse} from "@angular/common/http";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatProgressBar} from "@angular/material/progress-bar";
import {LangChangeEvent, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        PaginationComponent,
        OperacionProductComponent,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressSpinner,
        MatProgressBar,
        TranslateModule
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
    displayedColumns: string[] = ['id', 'productName', 'productCode', 'quantity', 'unitBuyPrice', 'unitSellPrice', 'buyDate', 'category.name', 'action'];
    dataSource = new MatTableDataSource<Product>(this.products);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isLoading = true;
    searchKeywordFilter = new FormControl();
    selectedProduct: any = null;
    destroyRef = inject(DestroyRef)
    isView: boolean = false;

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

    editProduct(id: Product) {
        
        this.isView = false;
        const p = this.products.find(p => p.id == id);
        //this.selectedProduct =p;
        this.selectedProduct = {...p};
        console.log("edit product", this.selectedProduct);
    }

    deleteProduct(id: Number) {
        this.productsService.deleteProductById(id)
            .subscribe({
                next: (resp) => {
                    this.toastr.success(resp ?? '')
                    this.productsService.$triggerLoading.next(resp);
                },
                error: err => {
                    this.toastr.error(err ?? '')
                }
            })
    }

    viewProduct(id: Number) {

        this.isView = true;
        const p = this.products.find(p => p.id == id);
        this.selectedProduct = {...p};
        console.log("view Product");
    }
    








}
