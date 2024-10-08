import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../commun/pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { AddCategoryComponent } from './add-category/add-category.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [PaginationComponent,
           AddCategoryComponent,
           TranslateModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
    categories: Category[] = []
    categoryService = inject(CategoryService);
    toastr = inject(ToastrService);

    ngOnInit(): void {
        this.categoryService.getAllCategories().subscribe( {
            next: (resp) => {
                const data = resp.body ?? []
                this.categories = [...data]
            },
            error: err => this.toastr.error('Error loading Categories')
        } )
    }

    deleteCategory(index: any) {
        this.categoryService.deleteCategory(index).subscribe({
            next: (resp) => {
                this.categories = resp;
                this.toastr.success('Category Deleted!', 'Success!');
            }
        })
    }

    onPageChange(event: number) {
        console.log(event)
    }
}
