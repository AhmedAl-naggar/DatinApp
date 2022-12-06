import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/_models/Member';
import { Message } from 'src/_models/Message';
import { MembersService } from 'src/_services/member-service.service';
import { MessageService } from 'src/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static:true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective;
  messages: Message[] = [];

  constructor(
    private messageService: MessageService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {

    this.router.data.subscribe(data => {
      this.member = data.member;
    })


    this.router.queryParams.subscribe(params => {
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

    // this.galleryImages = this.getImages();

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
      this.loadMessages();
    }
  }

}
