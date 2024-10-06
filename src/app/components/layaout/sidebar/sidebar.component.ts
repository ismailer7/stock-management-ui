import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {
  faBars,
  faBurger,
  faComputer,
  faHandshake,
  faSackDollar,
  faTags,
  faToggleOn
} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  protected readonly faHandshake = faHandshake;
  protected readonly faSackDollar = faSackDollar;
  protected readonly faComputer = faComputer;
  protected readonly faTags = faTags;
  protected readonly faBars = faBars;
}
