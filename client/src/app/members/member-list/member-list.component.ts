import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Member } from 'src/_models/Member';
import { Pagination } from 'src/_models/Pagination';
import { User } from 'src/_models/User';
import { UserParams } from 'src/_models/UserParams';
import { MembersService } from 'src/_services/member-service.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{value:"male", display:"Males"},{value:"female", display:"Females"}];
 
  constructor(private membersService: MembersService ) {
    this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe(respose => {
      this.members = respose.result;
      this.pagination = respose.pagination;
    });
  }

  pageChanged(event: PageChangedEvent): void {
    this.userParams.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams);
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.membersService.resetParams();
    this.loadMembers();
  }
}
