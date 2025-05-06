import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http : HttpClient) { }

  getAllCustomer() {
    return this.http.get('http://localhost:8085/customers');
  }
}
