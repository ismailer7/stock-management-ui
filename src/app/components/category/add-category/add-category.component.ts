import {Component, DestroyRef, HostListener, inject, Input, OnChanges} from '@angular/core';
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
export class AddCategoryComponent implements OnChanges {
    categoryService = inject(CategoryService);

    toastr = inject(ToastrService);
    categoryForm: FormGroup;
    @Input() selectedCategory!: any;
    @Input() isView: boolean;
    isEditMode = false;
    submitted = false;
    destroyRef = inject(DestroyRef)


    constructor(private fb: FormBuilder) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required]
        });

    }

    ngOnChanges() {
        const existCategory = this.selectedCategory !== null;
        this.categoryForm.enable();
        if (existCategory) { // edit Mode
            this.categoryForm.setValue({name: this.selectedCategory.name})
        }
        if (existCategory && this.isView) { // view Mode
            this.categoryForm.disable();
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
            this.categoryService.addCategory(newCategory).subscribe({
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


    print() {

        console.log("print this view");
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
