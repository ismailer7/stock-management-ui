import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { faArrowTrendUp, faCartShopping, faSackDollar, faTags} from '@fortawesome/free-solid-svg-icons'
import { ComponentComunicationService } from '../../services/shared/component-comunication.service';

import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule,FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private readonly translatePipe = inject(TranslatePipe);
  textTranslatedByPipe = '';
  compComunicationSrv = inject(ComponentComunicationService);

  protected readonly faSackDollar = faSackDollar;
  protected readonly faTags = faTags;
  protected readonly fafaCartShopping = faCartShopping;
  protected readonly fafaArrowTrendUp = faArrowTrendUp;
  dashboardService = inject(DashboardService);
  dashboard:Dashboard | null = null;



someMethod() {
  this.textTranslatedByPipe = this.translatePipe.transform('TRANSLATED_BY_COMPONENT');
}

ngOnInit() {

  this.dashboardService.getDashboardStatistics()
            .subscribe({
                next: (resp) => {
                  this.dashboard = resp.body       
                },
                error: (error) => {
                  console.error('Error fetching dashboard data:', error);
                }
            });





}


}
