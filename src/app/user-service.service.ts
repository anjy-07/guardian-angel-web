import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor() { }

  private switchViewSource = new Subject<string>();

  // Observable string streams
  switchViewSource$ = this.switchViewSource.asObservable();

  currentUserType : string = 'user';

  switchViews(userType: string) {
    this.currentUserType = userType;
    this.switchViewSource.next(userType);
  }
}
