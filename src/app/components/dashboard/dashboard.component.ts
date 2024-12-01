import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { faArrowTrendUp, faCartShopping, faSackDollar, faTags} from '@fortawesome/free-solid-svg-icons'
import { ComponentComunicationService } from '../../services/shared/component-comunication.service';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard.model';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../count-up.directive';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule,FontAwesomeModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private readonly translatePipe = inject(TranslatePipe);
  textTranslatedByPipe = '';
  compComunicationSrv = inject(ComponentComunicationService);
  countup = inject(CountUpDirective)

  protected readonly faSackDollar = faSackDollar;
  protected readonly faTags = faTags;
  protected readonly fafaCartShopping = faCartShopping;
  protected readonly fafaArrowTrendUp = faArrowTrendUp;
  dashboardService = inject(DashboardService);
  dashboard:Dashboard | null = null;
 
  
  isNegativ:boolean = false;



someMethod() {
  this.textTranslatedByPipe = this.translatePipe.transform('TRANSLATED_BY_COMPONENT');
}

constructor() {
  this.dashboard = { profitsMarge: 0 };
}

ngOnInit() {
  this.dashboardService.getDashboardStatistics()
            .subscribe({
                next: (resp) => {
                  this.dashboard = resp.body   
                  console.log(this.dashboard?.profitsMarge)  

                  if(this.dashboard?.profitsMarge !== undefined && this.dashboard?.profitsMarge  < 0 )
                    this.isNegativ = true;           
                },
                error: (error) => {
                  console.error('Error fetching dashboard data:', error);
                }
            });
  
}


}
