import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { languages } from '../../../data/langs';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCaretDown, faComputer} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, FaIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {

  languages = languages;
  selectedLanguage = languages[0];

  constructor(private translate: TranslateService, private authService: AuthService) {
    translate.setDefaultLang('en');
   }

  
   changeLang(lang: string, index: any) {
    this.translate.use(lang);
    this.selectedLanguage = languages[index];
  }

  logout(){
    this.authService.logout();
  }

    protected readonly faComputer = faComputer;
    protected readonly faCaretDown = faCaretDown;
}
