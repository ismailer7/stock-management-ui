import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { languages } from '../../../data/langs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {

  languages = languages;
  selectedLanguage = languages[0];

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
   }

  
   changeLang(lang: string, index: any) {
    this.translate.use(lang);
    this.selectedLanguage = languages[index];
  }
  
}
