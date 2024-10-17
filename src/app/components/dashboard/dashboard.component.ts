import {Component, inject, LOCALE_ID} from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private readonly translatePipe = inject(TranslatePipe);
  textTranslatedByPipe = '';

someMethod() {
  this.textTranslatedByPipe = this.translatePipe.transform('TRANSLATED_BY_COMPONENT');
}
}
