import {Component} from '@angular/core';
import {NavbarComponent} from './components/layaout/navbar/navbar.component';
import {LayaoutComponent} from "./components/layaout/layaout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, LayaoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-management-ui';
}
