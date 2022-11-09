import { Component, OnInit } from '@angular/core';
import { Member } from 'src/_models/Member';
import { Pagination } from 'src/_models/pagination';
import { MembersService } from 'src/_services/member-service.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate: string = 'liked';
  pageNumber: number = 1;
  pageSize: number =2;
  pagination: Pagination;
  constructor(private mermberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.mermberService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe(respose=>{
      this.members = respose.result;
      this.pagination = respose.pagination;
    });
  }

  pageChanged(event:any){
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
