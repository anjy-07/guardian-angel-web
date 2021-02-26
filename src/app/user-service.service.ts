import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private httpClient: HttpClient) { }

   user1 =  {
    "user_id" : 1,
    "user_type" : "user",
    "user_name" : 'Sameer Kapoor',
    "user_addr_street" : "JN Road",
    "user_addr_city" : "Mumbai",
    "user_age_in_years" : 22,
    "user_gender" : "M",
    "current_amount" : 200
   }  

   userNumber = 1;
  
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

  getCredentials(merchant) {

    const user = {
      "user" : this.user1,
      "merchant" : {
          "merchant_id" : merchant.merchant_id,
          "merchant_category" : merchant.merchant_category, 
          "merchant_name" : merchant.merchant_name,
          "merchant_addr_street" : merchant.merchant_addr_street,
          "merchant_addr_city" : merchant.merchant_addr_city
      },
      "time_of_day" : 20
  }
    return this.httpClient.post('http://35.196.133.79/getCreditDetails', user, this.httpOptions);
  }

  registerTransaction(transaction) {
    return this.httpClient.post('http://35.196.133.79/registerTransaction', transaction, this.httpOptions);
  }
 }
