import { Component, EventEmitter, inject, Input, Output, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent  {

  toastr = inject(ToastrService);


  addProduct(): void {
    console.log("added");
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

}
