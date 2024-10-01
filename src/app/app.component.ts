import {Component} from '@angular/core';
import {NavbarComponent} from './components/layaout/navbar/navbar.component';
import {LayaoutComponent} from "./components/layaout/layaout.component";
import { LoginComponent } from './components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/layaout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, LayaoutComponent,LoginComponent,RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-management-ui';
}
