import {Component, computed, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faBars, faComputer, faHandshake, faSackDollar, faTags} from '@fortawesome/free-solid-svg-icons'
import {NgClass} from "@angular/common";
import {ComponentComunicationService} from "../../../services/shared/component-comunication.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    FontAwesomeModule,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  compComunicationSrv = inject(ComponentComunicationService);
  protected readonly faHandshake = faHandshake;
  protected readonly faSackDollar = faSackDollar;
  protected readonly faComputer = faComputer;
  protected readonly faTags = faTags;

}
