import { Component } from '@angular/core';
import {NavbarComponent} from "./navbar/navbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layaout',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './layaout.component.html',
  styleUrl: './layaout.component.css'
})
export class LayaoutComponent {

}
