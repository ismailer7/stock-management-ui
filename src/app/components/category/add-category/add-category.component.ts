import {Component, inject} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../../models/category.model';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  categoryService = inject(CategoryService);
  categoryForm: FormGroup;
  toastr = inject(ToastrService);
  



  constructor(private fb: FormBuilder) {
    
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
}


}
