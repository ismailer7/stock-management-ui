import {Component} from '@angular/core';
import {NavbarComponent} from './components/layaout/navbar/navbar.component';
import {LayaoutComponent} from "./components/layaout/layaout.component";
import { LoginComponent } from './components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/layaout/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, LayaoutComponent,LoginComponent,LoadingSpinnerComponent,RouterOutlet, FooterComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-management-ui';
  loading = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(Loading => {
     
      Promise.resolve().then( () => this.loading = Loading)
    });


}

}
