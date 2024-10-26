import { Component, inject, Input } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent {

  categoryService = inject(CategoryService);
  toastr = inject(ToastrService);
  @Input() deletion_id!: Number;


  deleteCategory() {
  this.categoryService.deleteCategory(this.deletion_id)
            .subscribe({
                next: (resp) => {
                    this.toastr.success(resp ?? '')
                    this.categoryService.$triggerLoading.next(resp);
                },
                error: err => {
                    this.toastr.error(err ?? '');
                }
                  /*   error: err => {
                    const errorResponse = err.error as ErrorResponse;
                    const errorMessage = errorResponse?.message || 'Error';
                    this.toastr.error(errorMessage);
                } */
                
            })
  }

}
