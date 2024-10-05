import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Sale } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';
import { ToastrService } from 'ngx-toastr';
import { LangChangeEvent, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, merge, startWith, switchMap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Page } from '../../models/product-page.model';
import { SalePage } from '../../models/sale-page.model';
import { PaginationComponent } from '../commun/pagination/pagination.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBar } from '@angular/material/progress-bar';



@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [TranslateModule,
         PaginationComponent,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressSpinner,
        MatProgressBar
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
  displayedColumns: string[] = ['id', 'description', 'product.productName', 'product.unitSellPrice', 'saleQuantity', 'saleDate','totalPrice', 'action'];
  dataSource = new MatTableDataSource<Sale>(this.sales);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading = true;
  searchKeywordFilter = new FormControl();
  selectedProduct: any = null;
  currentSale: Sale | null = null;


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
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
            .subscribe({
                next: (data) => {
                    this.sales = data?.sales ?? []
                    this.dataSource.data = data?.sales ?? []
                    setTimeout(() => {
                        this.paginator.length = data?.totalCount ?? 0
                        this.paginator.pageIndex = data?.pageIndex ?? 0
                        this.isLoading = false;
                    });
                },
                error: (err) => this.isLoading = false
            });
            this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
              setTimeout(()=>{
                  this.paginator._intl.itemsPerPageLabel= this.translatePipe.transform('APP.PAGINATION.TOTAL_ITEMS')
                  this.paginator._intl.firstPageLabel = this.translatePipe.transform('APP.PAGINATION.FIRST')
                  this.paginator._intl.previousPageLabel = this.translatePipe.transform('APP.PAGINATION.PREVIOUS')
                  this.paginator._intl.nextPageLabel = this.translatePipe.transform('APP.PAGINATION.NEXT')
                  this.paginator._intl.lastPageLabel = this.translatePipe.transform('APP.PAGINATION.LAST')
                  this.dataSource._updateChangeSubscription();
                  this.salesService.$triggerLoading.next("test")
              })
  
          });

        }

          onSortChange(sortState: Sort) {
            console.log(sortState)
        }
    
          onPageChange(event: any) {
            console.log(event)
        }

        deleteSale(id: Number) {
          this.salesService.deleteSaleById(id)
              .subscribe({
                  next: (resp) =>{
                      this.toastr.success(resp?? '')
                      this.salesService.$triggerLoading.next(resp);
                  },
                  error: err => {
                      this.toastr.error(err ?? '')
                  }
              })
      }







  }

 

 





