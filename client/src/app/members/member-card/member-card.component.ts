import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/_models/Member';
import { MembersService } from 'src/_services/member-service.service';
import { PresenceService } from 'src/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member:Member;
  constructor(
    private memberSerice:MembersService,
    private toastr: ToastrService,
    public presenceService: PresenceService 
    ) { }

  ngOnInit(): void {
  }

  addLike(member:Member){
    console.log(member);
    this.memberSerice.addLike(member.userName).subscribe(()=>{
      this.toastr.success("You have liked " + member.knownAs);
    });
  }

}
