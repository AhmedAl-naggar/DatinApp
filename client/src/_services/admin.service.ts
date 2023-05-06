import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/_models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }

  updateSelectedRoles(username: string, roles: string[]) {
    //                  {{url}}/api/admin/edit-roles/lisa?roles=Moderator,Member
    return this.http.post(this.baseUrl + 'admin/edit-roles/'+ username + '?roles=' + roles, {});
  }

}
