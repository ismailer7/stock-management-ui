import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../commun/pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [PaginationComponent,
           AddCategoryComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  categories: Category[] = []
  categoryService = inject(CategoryService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe( {
      next: (resp) => {
        this.categories = [...resp]
      }
    } )
  }

  onPageChange(event: number){
    this.toastr.success('Hello world!', 'Toastr fun!');
    console.log(event)
  }
}
