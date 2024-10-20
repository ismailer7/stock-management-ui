import {AfterViewInit, Component, DestroyRef, inject, ViewChild} from '@angular/core';
import {PaginationComponent} from '../commun/pagination/pagination.component';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../models/category.model';
import {CategoryService} from '../../services/category.service';
import {AddCategoryComponent} from './add-category/add-category.component';
import {LangChangeEvent, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatProgressBar} from '@angular/material/progress-bar';
import {debounceTime, map, merge, scan, startWith, switchMap} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {CategoryPage} from '../../models/category-page.model';
import {ErrorResponse} from '../../models/error-response.model';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [TranslateModule,
        PaginationComponent,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressSpinner,
        MatProgressBar,
        AddCategoryComponent
    ],
    templateUrl: './category.component.html',
    styleUrl: './category.component.css'
})
export class CategoryComponent implements AfterViewInit {
    pageSizes = [5, 10, 20, 30];
    totalCount = 0;
    categories: Category [] = [];
    categoryService = inject(CategoryService);
    toastr = inject(ToastrService);
    translatePipe = inject(TranslatePipe)
    translateSrv = inject(TranslateService)
    displayedColumns: string[] = ['id', 'name', 'action'];
    dataSource = new MatTableDataSource<Category>(this.categories);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isLoading = true;
    searchKeywordFilter = new FormControl();
    selectedCategory: any = null;
    isView: boolean = false;
    destroyRef = inject(DestroyRef)

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.searchKeywordFilter.valueChanges.pipe(debounceTime(500)), this.sort.sortChange, this.paginator.page, this.categoryService.$triggerLoading)
            .pipe(
                scan((acc, current) => {
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
                    if (filterValue) {
                        this.paginator.pageIndex = 0
                    }
                    return this.categoryService
                        .getCategoriesFiltered(
                            filterValue,
                            this.sort.active,
                            this.sort.direction,
                            this.paginator.pageIndex,
                            this.paginator.pageSize
                        );
                }),
                map((resp: HttpResponse<CategoryPage>) => resp.body)
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data) => {
                    this.categories = data?.categories ?? []
                    this.dataSource.data = data?.categories ?? []
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
                    this.categoryService.$triggerLoading.next("test")
                })

            });

    }

    onSortChange(sortState: Sort) {
        console.log(sortState)
    }

    onPageChange(event: any) {
        console.log(event)
    }

    addCategory() {

        this.selectedCategory = null;
        console.log("add Category:", this.selectedCategory);
    }

    editCategory(id: Category) {

        this.isView = false
        const p = this.categories.find(c => c.id == id);
        this.selectedCategory = {...p};
        console.log("edit Category", this.selectedCategory);
    }

    deleteCategory(id: Number) {
        this.categoryService.deleteCategory(id)
            .subscribe({
                next: (resp) => {
                    this.toastr.success('Sale Deleted!', 'Notification!');
                    this.categoryService.$triggerLoading.next(resp);
                },
                error: err => {
                    const errorResponse = err.error as ErrorResponse;
                    const errorMessage = errorResponse?.message || 'Error';
                    this.toastr.error(errorMessage);
                }
            })
    }

    viewCategory(id: Number) {

        this.isView = true;
        const p = this.categories.find(c => c.id == id);
        this.selectedCategory = {...p};
        console.log("view Category");
    }


}
