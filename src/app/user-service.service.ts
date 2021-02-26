import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private httpClient: HttpClient) { }

   httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    })
  };
  

  private switchViewSource = new Subject<string>();

  // Observable string streams
  switchViewSource$ = this.switchViewSource.asObservable();

  currentUserType : string = 'user';

  switchViews(userType: string) {
    this.currentUserType = userType;
    this.switchViewSource.next(userType);
  }

  getCredentials() {

    const user = {
      "user" : {
          "user_id" : 1,
          "user_type" : "user",
          "user_name" : "Sameer Kapoor",
          "user_addr_street" : "JN Road",
          "user_addr_city" : "Mumbai",
          "user_age_in_years" : 22,
          "user_gender" : "M"
      },
      "merchant" : {
          "merchant_id" : 1,
          "merchant_category" : "food_dining", 
          "merchant_name" : "McDonalds",
          "merchant_addr_street" : "Fort", 
          "merchant_addr_city" : "Mumbai"
      },
      "time_of_day" : 20
  }
    return this.httpClient.post('http://localhost:8080/getCreditDetails', user, this.httpOptions);
  }
 }
