import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from 'src/_models/Member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl= environment.apiUrl;

  members:Member[] = [];
  constructor(private http:HttpClient) { }

  getMembers(){
    if (this.members.length > 0) {
      return of(this.members);
    }else{
      return this.http.get<Member[]>(this.baseUrl + "users").pipe(
        map(members=>{
          this.members = members;
          return members;
        })
      );
    }
  }

  getMember(username:string){
    const member = this.members.find(x => x.userName === username);
    if (member !== undefined) {
      return of(member)
    }else{
      return this.http.get<Member>(`${this.baseUrl}users/${username}`);
    }
  }

  updateMember(member:Member){
    return this.http.put<Member>(`${this.baseUrl}users`,member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
