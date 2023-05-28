import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/_models/Member';
import { Message } from 'src/_models/Message';
import { User } from 'src/_models/User';
import { AccountService } from 'src/_services/account.service';
import { MembersService } from 'src/_services/member-service.service';
import { MessageService } from 'src/_services/message.service';
import { PresenceService } from 'src/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;

  constructor(
    public presence: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService,
    private router:Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => { this.user = user; });
    this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
  }


  ngOnInit(): void {

    this.route.data.subscribe(data => {
      this.member = data.member;
    })


    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });


    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        imagePercent: 80,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];


    this.member.photos.forEach(photo => {
      this.galleryImages.push(
        {
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url,
        }
      );
    });
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    this.member.photos.forEach(photo => {
      imageUrls.push(
        {
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url,
        }
      );
    });
    return imageUrls;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe(response => {
      this.messages = response;
    });
  }

  selectTab(tabId: number) {

    this.memberTabs.tabs[tabId].active = true;

  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
