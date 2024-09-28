import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {PaginationComponent} from "../commun/pagination/pagination.component";
import {AddproductComponent} from './addproduct/addproduct.component';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        PaginationComponent,
        AddproductComponent,
        MatPaginator,
        MatTableModule,
        MatSortModule
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit, OnInit {
    // id?: number;
    // productName?: string;
    // productCode?: string;
    // description?: string;
    // quantity?: number;
    // unitBuyPrice?: number;
    // unitSellPrice?: number;
    // buyDate?: string;
    // category?: Category;
    products: Product[] = []
    productsService = inject(ProductService);
    toastr = inject(ToastrService);
    displayedColumns: string[] = ['id', 'productName', 'productCode', 'quantity', 'unitBuyPrice', 'unitSellPrice', 'category.name', 'action'];
    dataSource = new MatTableDataSource<Product>(this.products);
    private _liveAnnouncer = inject(LiveAnnouncer);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch(property) {
                case 'category.name': return item?.category?.name;
                default: return item[property as keyof Product];
            }
        };
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator._intl.itemsPerPageLabel='hola'
    }


    ngOnInit(): void {
        this.productsService.getAllProducts().subscribe({
            next: (resp) => {
                this.products = [...resp]
                this.dataSource.data = this.products;
            }
        })
    }

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
    onPageChange(event: number) {
        this.toastr.success('Hello world!', 'Toastr fun!');
        console.log(event)
    }


    editProduct(id: Product) {
        console.log(`edit ${id}`);
    }

    deleteProduct(id: Number) {
        console.log(`delete ${id}`);
    }
}
