import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from './components/layaout/navbar/navbar.component';
import {LayoutComponent} from "./components/layaout/layout.component";
import { LoginComponent } from './components/login/login.component';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { FooterComponent } from './components/layaout/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoadingService } from './services/loading.service';
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, LayoutComponent,LoginComponent,LoadingSpinnerComponent,RouterOutlet, FooterComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'stock-management-ui';
  loading = false;
  router = inject(Router)
  constructor(private loadingService: LoadingService, private cd: ChangeDetectorRef) {
    this.loadingService.loading$.subscribe(Loading => {
     
      this.loading = Loading;
      this.cd.detectChanges();
    });


}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
    }

}
