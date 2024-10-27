import { Component,Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent {

  @Input() deleteConfirmation!: boolean;
  @Output() valueChange = new EventEmitter<any>();


submit(){

this.deleteConfirmation = true;
this.valueChange.emit(this.deleteConfirmation);


}

close(){

  this.deleteConfirmation = false;
  this.valueChange.emit(this.deleteConfirmation);
  
  
  }


  


}
