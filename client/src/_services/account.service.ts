import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/_models/User';
import {map} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl: string = environment.apiUrl;

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  setCurrentUser(user:User){
    this.currentUserSource.next(user);
  }

  // Register a new user
  public register(model: any){
    return this.http.post(this.baseUrl + "account/register",model).pipe(
      map((user: User)=>{
        if (user) {
          localStorage.setItem('registeredUser', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    )
  }

  // login
  public login(model: any) {
    return this.http.post(this.baseUrl + "account/login", model).pipe(
      map((response:User)=>{
        const user = response;
        if (user) {
          localStorage.setItem('user',JSON.stringify(response));
          this.setCurrentUser(user);
        }
      }));
  }

  //logout
  public logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
