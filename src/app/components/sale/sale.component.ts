import {AfterViewInit, Component, DestroyRef, inject, ViewChild} from '@angular/core';
import {Sale} from '../../models/sale.model';
import {SalesService} from '../../services/sales.service';
import {ToastrService} from 'ngx-toastr';
import {LangChangeEvent, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, map, merge, startWith, switchMap} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {SalePage} from '../../models/sale-page.model';
import {MatProgressBar} from '@angular/material/progress-bar';
import {SaleOperationComponent} from './sale-operation/sale-operation.component';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DeleteConfirmationComponent} from "../commun/delete-confirmation/delete-confirmation.component";


@Component({
    selector: 'app-sale',
    standalone: true,
    imports: [TranslateModule,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressBar,
        SaleOperationComponent,
        DeleteConfirmationComponent
    ],
    templateUrl: './sale.component.html',
    styleUrl: './sale.component.css'
})
export class SaleComponent implements AfterViewInit {

    pageSizes = [5, 10, 20, 30];
    totalCount = 0;
    sales: Sale[] = []
    salesService = inject(SalesService);
    toastr = inject(ToastrService);
    translatePipe = inject(TranslatePipe)
    translateSrv = inject(TranslateService)
    displayedColumns: string[] = ['checkbox','id', 'description', 'product.productName', 'product.unitSellPrice', 'saleQuantity', 'saleDate', 'totalPrice', 'action'];
    dataSource = new MatTableDataSource<Sale>(this.sales);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isLoading = true;
    searchKeywordFilter = new FormControl();
    selectedSale: any = null;
    destroyRef = inject(DestroyRef);
    isView: boolean = false;
    deleteConfirmation: boolean = false;
    rowid!: Number;
    idList: number[]= [];

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.searchKeywordFilter.valueChanges.pipe(debounceTime(500)), this.sort.sortChange, this.paginator.page, this.salesService.$triggerLoading)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoading = true;
                    this.dataSource.data = this.dataSource.data // this is to keep old data while loading to prevent flickering behavior
                    const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
                    if (filterValue) {
                        this.paginator.pageIndex = 0
                    }
                    return this.salesService
                        .getSalesFiltered(
                            filterValue,
                            this.sort.active,
                            this.sort.direction,
                            this.paginator.pageIndex,
                            this.paginator.pageSize
                        );
                }),
                map((resp: HttpResponse<SalePage>) => resp.body)
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data) => {
                    this.sales = data?.sales ?? []
                    this.dataSource.data = data?.sales ?? []
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
                this.salesService.$triggerLoading.next("test")
            })

        });

    }

    addSale() {
        this.isView = false;
        this.selectedSale = null;
        console.log("add Sale:", this.selectedSale);

    }

    editSale(id: Sale) {
        const p = this.sales.find(p => p.id == id);
        this.selectedSale = {...p};
        console.log("edit Sale", this.selectedSale);
        this.isView = false;
    }

    deleteSale(id: Number) {
        this.rowid = id;
        
    }

    onRowChecked(row_Id: number,event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
          this.idList.push(row_Id);
        } else {
          this.idList = this.idList.filter(id => id !== row_Id);
        }       
    }

    deletesalesbutton()
     {

        this.salesService.deleteSalesById(this.idList)
        .subscribe({
            next: (resp) => {
                this.toastr.success(resp ?? '')
                this.salesService.$triggerLoading.next(resp);
            },
            error: err => {
                this.toastr.error(err ?? '')
            } }) ;

     }

    handleValueChange(newValue: any) {
        this.deleteConfirmation = newValue; 
        if(this.deleteConfirmation){ 
           this.salesService.deleteSaleById(this.rowid)
               .subscribe({
                 next: (resp) => {
                    this.toastr.success(resp ?? '')
                    this.salesService.$triggerLoading.next(resp);
                 },
                  error: err => {
                  this.toastr.error(err ?? '')
                }
            });  
            /* error: err => {
                    const errorResponse = err.error as ErrorResponse;
                    const errorMessage = errorResponse?.message || 'Error';
                    this.toastr.error(errorMessage);
                }  */    
        }else   return;        
    }
       
    onSortChange(sortState: Sort) {
        console.log(sortState)
    }

    onPageChange(event: any) {
        console.log(event)
    }

    viewSale(id: Number) {
        this.isView = true;
        const s = this.sales.find(s => s.id == id);
        this.selectedSale = {...s};
        console.log("view Sale");
    }

    export(){
        const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
        this.salesService.export(
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

 

 





