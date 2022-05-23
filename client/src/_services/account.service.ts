import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URLs} from '../consts/urls'
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl: string = URLs.BaseURL;

  constructor(private http: HttpClient) { }

  public login(model: any) {
    return this.http.post(this.baseUrl + "account/login", model);
  }
}
