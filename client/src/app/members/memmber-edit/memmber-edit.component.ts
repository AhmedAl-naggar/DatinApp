import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/_models/Member';
import { User } from 'src/_models/User';
import { AccountService } from 'src/_services/account.service';
import { MembersService } from 'src/_services/member-service.service';

@Component({
  selector: 'app-memmber-edit',
  templateUrl: './memmber-edit.component.html',
  styleUrls: ['./memmber-edit.component.css']
})
export class MemmberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  member: Member;

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastrService: ToastrService
  ) {
    this.getCurrentActiveUser();
  }

  ngOnInit(): void {
    this.loadMember();
  }

  private getCurrentActiveUser() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user );
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => this.member = member);
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastrService.success("User Profile Updated Sccessfully");
      this.editForm.reset(this.member);
    })
  }

}
