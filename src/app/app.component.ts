import {Component} from '@angular/core';
import {NavbarComponent} from './components/layaout/navbar/navbar.component';
import {LayaoutComponent} from "./components/layaout/layaout.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, LayaoutComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-management-ui';
}
