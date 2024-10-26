import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentComunicationService {
  $hideSideBar = signal(false);
  constructor() { }
}
