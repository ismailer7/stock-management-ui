import {Component, inject} from '@angular/core';
import {NavbarComponent} from "./navbar/navbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import { FooterComponent } from './footer/footer.component';
import {ComponentComunicationService} from "../../services/shared/component-comunication.service";

@Component({
  selector: 'app-layaout',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  compComunicationSrv = inject(ComponentComunicationService);
  closeSideBar(){
    this.compComunicationSrv.$hideSideBar.set(false);
  }

}
