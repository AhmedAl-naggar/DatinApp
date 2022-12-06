import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from 'src/_models/Member';
import { User } from 'src/_models/User';
import { UserParams } from 'src/_models/UserParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCach = new Map();
  userParams: UserParams;
  user: User;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCach.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
      //return this.memberCach.get(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + "users", params, this.http)
      .pipe(map(response => {
        this.memberCach.set(Object.values(userParams).join('-'), response);
        return response;
      }));
  }

  getMember(username: string) {
    const member = [...this.memberCach.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);
    if (member) {
      return of(member);
    }
    return this.http.get<Member>(`${this.baseUrl}users/${username}`);

    // const member = this.members.find(x => x.userName === username);
    // if (member !== undefined) {
    //   return of(member)
    // } else {
    //   return this.http.get<Member>(`${this.baseUrl}users/${username}`);
    // }
  }

  updateMember(member: Member) {
    return this.http.put<Member>(`${this.baseUrl}users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  public getUserParams(): UserParams {
    return this.userParams;
  }
  public setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  addLike(username: string){
    return this.http.post(this.baseUrl + "likes/" + username,{});
  }
  getLikes(predicate: string,pageNumber: number, pageSize: number){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("predicate",predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + "likes", params,this.http);
    // return this.http.get<Partial<Member[]>>(this.baseUrl + "likes?predicate=" + predicate );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

}
