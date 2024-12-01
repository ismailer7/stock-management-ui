import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { faArrowTrendUp, faCartShopping, faHandHoldingDollar, faSackDollar, faTags} from '@fortawesome/free-solid-svg-icons'
import { ComponentComunicationService } from '../../services/shared/component-comunication.service';

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


someMethod() {
  this.textTranslatedByPipe = this.translatePipe.transform('TRANSLATED_BY_COMPONENT');
}
}
