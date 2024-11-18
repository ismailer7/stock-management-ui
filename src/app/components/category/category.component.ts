import {
    AfterViewInit,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../models/category.model';
import {CategoryService} from '../../services/category.service';
import {AddCategoryComponent} from './add-category/add-category.component';
import {LangChangeEvent, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatProgressBar} from '@angular/material/progress-bar';
import {debounceTime, map, merge, scan, startWith, switchMap} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {CategoryPage} from '../../models/category-page.model';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DeleteConfirmationComponent} from "../commun/delete-confirmation/delete-confirmation.component";


@Component({
    selector: 'app-category',
    standalone: true,
    imports: [TranslateModule,
        MatPaginator,
        MatTableModule,
        MatSortModule,
        ReactiveFormsModule,
        MatProgressBar,
        AddCategoryComponent,
        DeleteConfirmationComponent],
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
    displayedColumns: string[] = ['checkbox', 'id', 'name', 'action'];
    dataSource = new MatTableDataSource<Category>(this.categories);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    isLoading = true;
    searchKeywordFilter = new FormControl();
    selectedCategory: any = null;
    isView: boolean = false;
    destroyRef = inject(DestroyRef);
    deleteConfirmation: boolean = false;
    rowid: Number | null;
    idList: number[] = [];
    @ViewChildren('checkBoxTable') checkboxes: QueryList<ElementRef>;
    @ViewChild('headerCheckbox') headerCheckBox: ElementRef;

    ngAfterViewInit(): void {
        // console.log("ngafterviewinit triggered")
        // console.log("value of delete in category:",this.deleteConfirmation);
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
                    this.headerCheckBox.nativeElement.checked = false;
                    this.toggleCheckboxes();

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
        this.isView = false;
        this.selectedCategory = null;
        console.log("add Category:", this.selectedCategory);
    }

    editCategory(id: Category) {

        this.isView = false
        const p = this.categories.find(c => c.id == id);
        this.selectedCategory = {...p};
        console.log("edit Category", this.selectedCategory);
    }

    viewCategory(id: Number) {

        this.isView = true;
        const p = this.categories.find(c => c.id == id);
        this.selectedCategory = {...p};
        console.log("view Category");
    }

    getCategoryId(id: Number) {
        this.rowid = id;
       
    }

    deleteCategory(){
        if(this.rowid != null){
        this.categoryService.deleteCategory(this.rowid)
        .subscribe({
            next: (resp) => {
                this.toastr.success(resp ?? '')
                this.categoryService.$triggerLoading.next(resp);
            },
            error: err => {
                this.toastr.error(err ?? '')
            }
        });
    }
    }


    handleValueChange(status: any) {
        this.deleteConfirmation = status;
        console.log("handle value triggered")
        console.log("rowid status:",this.rowid);
        if (this.deleteConfirmation ) {
            if(this.rowid == null) this.deletecategoriesbutton();
            else this.deleteCategory();
        } else return;

        this.rowid = null;
    }

    getCategorieslist(){

        this.idList = this.getIdList();
    }

    deletecategoriesbutton() {
  
        this.categoryService.deleteCategoriesById(this.idList)
        .subscribe({
            next: (resp) => {
                this.toastr.success(resp ?? '')
                this.categoryService.$triggerLoading.next(resp);
            },
            error: err => {
                this.toastr.error(err ?? '')
            } }) ;

    }

    toggleCheckboxes() {
        const isChecked = this.headerCheckBox?.nativeElement?.checked ?? false;
        if (!this.checkboxes) return;
        Array.from(this.checkboxes)
            .forEach(cbx => cbx.nativeElement.checked = isChecked);
    }


    getIdList(): number[] {
        if (!this.checkboxes) return [];
        return Array.from(this.checkboxes)
            .filter(cbx => cbx.nativeElement.checked)
            .map(cBox => +cBox.nativeElement.dataset['id']!);
    }


    toggleCheckBox($event: Event) {
        if (!this.headerCheckBox) return;
        const isChecked = ($event.target as HTMLInputElement).checked;
        if (!isChecked) this.headerCheckBox.nativeElement.checked = false;

    }

    export(){
        const filterValue = this.searchKeywordFilter.value == null ? '' : this.searchKeywordFilter.value;
        this.categoryService.export(
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
