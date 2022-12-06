import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Member } from 'src/_models/Member';
import { MembersService } from 'src/_services/member-service.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {
  constructor(private memberService: MembersService) {
    
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberService.getMember(route.paramMap.get('username'));
  }
}
