import { Component, inject } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule],
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
