import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {PaginationComponent} from "../commun/pagination/pagination.component";
import {AddproductComponent} from './addproduct/addproduct.component';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
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

    pageSizes = [5, 10, 20, 30];
    totalCount = 0;
    products: Product[] = []
    productsService = inject(ProductService);
    toastr = inject(ToastrService);
    displayedColumns: string[] = ['id', 'productName', 'productCode', 'quantity', 'unitBuyPrice', 'unitSellPrice', 'buyDate', 'category.name', 'action'];
    dataSource = new MatTableDataSource<Product>(this.products);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isLoading = true;
    searchKeywordFilter = new FormControl();


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));   //the first on sort order change, reset back to st page.
        merge(this.searchKeywordFilter.valueChanges.pipe(debounceTime(500)), this.sort.sortChange, this.paginator.page, this.productsService.$triggerLoading)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoading = true;
                    this.dataSource.data = this.dataSource.data // this is to keep old data while loading to prevent flickering behavior
                    const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
                    if (filterValue) {
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
                map((resp: HttpResponse<Page>) => resp.body)
            )
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
                error: (err) => this.isLoading = false
            });

    }


    /** Announce the change in sort state for assistive technology. */
    onSortChange(sortState: Sort) {
        console.log(sortState)
    }

    onPageChange(event: any) {
        console.log(event)
    }


    editProduct(id: Product) {
        console.log(`edit ${id}`);
        const p = this.products.find( p => p.id == id);
        console.log(p)
    }

    deleteProduct(id: Number) {
        this.productsService.deleteProductById(id)
            .subscribe({
                next: (resp) =>{
                    this.toastr.success(resp?? '')
                    this.productsService.$triggerLoading.next(resp);
                },
                error: err => {
                    this.toastr.error(err ?? '')
                }
            })
    }
}
