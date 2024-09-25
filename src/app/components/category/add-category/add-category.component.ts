import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryComponent } from '../category.component';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule,CategoryComponent ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  categoryService = inject(CategoryService);
  categoryForm: FormGroup;
  toastr = inject(ToastrService);
  



  constructor(private fb: FormBuilder, private categoryComponent: CategoryComponent) {
    
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
}

addCategory() {
  const newCategory:Category = this.categoryForm.value;
  console.log('category added:', newCategory);
  this.categoryService.addCategory(newCategory); 
  console.log("added");
  this.toastr.success('Category added!', 'Notification!');
  this.categoryComponent.ngOnInit();
}


}
