import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.backendHost+'/customers');
  }

  searchCustomers(keyword: string): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.backendHost+'/customers/search?keyword='+keyword);
  }
}
