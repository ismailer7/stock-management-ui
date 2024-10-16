import {Component, DestroyRef, HostListener, inject, Input} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-add-category',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, TranslateModule],
    templateUrl: './add-category.component.html',
    styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
    categoryService = inject(CategoryService);
    fb = inject(FormBuilder);
    toastr = inject(ToastrService);
    categoryForm: FormGroup;
    @Input() selectedCategory!: any;
    @Input() isView: boolean;
    isEditMode = false;
    submitted = false;
    destroyRef = inject(DestroyRef)

    ngOnChanges() {

        console.log("onchange Category status: ", this.selectedCategory);
        console.log("isview satus:", this.isView)

        this.isEditMode = this.selectedCategory !== null;
        console.log("edit mode:", this.isEditMode);


        if (this.isEditMode) {
            if (this.isView) {
                this.categoryForm = this.fb.group({
                    name: [{value: this.selectedCategory?.name, disabled: true}]
                });
            } else {
                this.categoryForm = this.fb.group({
                    name: [this.selectedCategory?.name, Validators.required]
                });
            }
        } else {
            this.categoryForm = this.fb.group({
                name: ['', Validators.required]
            });

        }
    }

    submit() {
        console.log("submitted")

        this.submitted = true;
        if (this.categoryForm.invalid) {
            return;
        }
        const newCategory = this.categoryForm.value;
        console.log("this form value:", this.categoryForm.value);
        if (this.isEditMode) {
            const id = this.selectedCategory.id;
            this.categoryService.editCategory(id, newCategory)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (resp) => {
                    const np = resp.body;
                    console.log(np);
                    this.toastr.success('Category edited!', 'Notification!');
                    this.categoryService.$triggerLoading.next(np);
                    this.close();
                },
                error: (err: Error) => this.toastr.error(err.message, 'Error!')
            })
        } else {
            this.categoryService.addCategory(newCategory)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                next: (resp) => {
                    const np = resp.body
                    console.log(np);
                    this.toastr.success('Category added!', 'Notification!');
                    this.reset();
                    this.categoryService.$triggerLoading.next(np)
                },
                error: (err: Error) => this.toastr.error(err.message, 'Error!')
            })
        }
    }


    close() {

        if (!this.isEditMode) {
            console.log("errase for add only");
            this.reset();
        } else (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.close();

        }
    }

    reset() {

        (document.getElementById('btn-close-modal') as HTMLFormElement)?.click();
        this.categoryForm.reset()
        this.submitted = false
    }


}
