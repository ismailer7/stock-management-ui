import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  constructor() { }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {

    setTimeout(() => {
      // Your API call or data loading logic
      console.log('Data fetched successfully');
      
      this.loadingSubject.next(false); // Hide spinner after data is loaded
    }, 1000);
    
  }
}
