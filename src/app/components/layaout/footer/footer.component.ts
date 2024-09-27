import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {


currentYear(): any {
  return new Date().getFullYear()
}

version(): any {
  return "1.0.1";
}


}
