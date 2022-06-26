import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Member } from 'src/_models/Member';
import { MembersService } from 'src/_services/member-service.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member:Member =null;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] =[];

  constructor(private memberSerrive: MembersService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  loadMember(){
    this.memberSerrive.getMember(this.router.snapshot.paramMap.get('username')).subscribe(member=>{
      this.member = member;
      
      this.member.photos.forEach(photo => {
        this.galleryImages.push(
          {
            small: photo?.url,
            medium:  photo?.url,
            big:  photo?.url,
          }
        )
      });
      
    })
  }

}
