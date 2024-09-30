import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {PaginationComponent} from "../commun/pagination/pagination.component";
import {AddproductComponent} from './addproduct/addproduct.component';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, map, merge, startWith, switchMap} from "rxjs";
import {Page} from "../../models/product-page.model";
import {HttpResponse} from "@angular/common/http";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        PaginationComponent,
        AddproductComponent,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressSpinner,
        MatProgressBar
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit {
    // id?: number;
    // productName?: string;
    // productCode?: string;
    // description?: string;
    // quantity?: number;
    // unitBuyPrice?: number;
    // unitSellPrice?: number;
    // buyDate?: string;
    // category?: Category;
    pageSizes = [5, 10, 20];
    totalCount = 0;
    products: Product[] = []
    productsService = inject(ProductService);
    toastr = inject(ToastrService);
    displayedColumns: string[] = ['id', 'productName', 'productCode', 'quantity', 'unitBuyPrice', 'unitSellPrice', 'category.name', 'action'];
    dataSource = new MatTableDataSource<Product>(this.products);
    private _liveAnnouncer = inject(LiveAnnouncer);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    // cdr = inject(NgxSpinner)
    isLoading = true;
    searchKeywordFilter = new FormControl();
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;
        // this.dataSource.paginator._intl.itemsPerPageLabel='hola'
    // }
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //         switch(property) {
    //             case 'category.name': return item?.category?.name;
    //             default: return item[property as keyof Product];
    //         }
    //     };
        setTimeout(() => {
            this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));   // on sort order change, reset back to the first page.
            merge(this.searchKeywordFilter.valueChanges.pipe(debounceTime(500)), this.sort.sortChange, this.paginator.page)
                .pipe(
                    startWith({}),
                    switchMap(() => {
                        this.isLoading = true;
                        const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
                        if(filterValue){
                            this.paginator.pageIndex = 0
                        }
                        return this.productsService
                            .getProductsFiltered(
                                filterValue,
                                this.sort.active,
                                this.sort.direction,
                                this.paginator.pageIndex,
                                this.paginator.pageSize
                            );
                    }),
                    map((resp: HttpResponse<Page>) => {

                        // this.spinner.hide();
                        // this.limitReached = data === null;
                        //
                        // if (this.limitReached) {
                        //     this.snackBar.open('The API limit has been reached. Please try after a minute.', 'Close', {
                        //         duration: 5000
                        //     });
                        // }
                        return resp.body;
                    })
                )
                .subscribe({
                    next: (data) => {
                        this.products = data?.products ?? []
                        this.dataSource.data = this.products;
                        // this.totalCount = data?.totalCount ?? 0
                        // this.dataSource.paginator!.length = data?.totalCount ?? 0
                        // this.paginator.length = data?.totalCount ?? 0;
                        // this.dataSource.paginator = this.paginator
                        setTimeout(() => {
                            this.paginator.length = data?.totalCount ?? 0
                            this.paginator.pageIndex = data?.pageIndex ?? 0
                            this.isLoading = false;
                        });
                    },
                    error: (err) => this.isLoading = false
                });
        });
    }

    // ngOnInit(): void {
    //     this.productsService.getAllProducts().subscribe({
    //         next: (resp) => {
    //             const productList = resp.body ?? []
    //             this.products = [...productList]
    //             this.dataSource.data = this.products;
    //         }
    //     })
    // }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }
    // onPageChange(event: number) {
    //     this.toastr.success('Hello world!', 'Toastr fun!');
    //     console.log(event)
    // }


    editProduct(id: Product) {
        console.log(`edit ${id}`);
    }

    deleteProduct(id: Number) {
        console.log(`delete ${id}`);
    }
}
