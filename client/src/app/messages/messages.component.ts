import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Message } from 'src/_models/Message';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container: string = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loeadMessages();
  }

  loeadMessages() {
    this.loading = true;
    this.messageService.getMessags(this.pageNumber, this.pageSize, this.container).subscribe(res => {
      this.messages = res.result;
      this.pagination = res.pagination;
      this.loading = false;
    });
  }

  deleteMessage(id: number){
    this.messageService.deleteMessage(id).subscribe(()=>{
      this.messages.splice(this.messages.findIndex(x=>x.id == id),1);
    })
  }

  pageChanged(event: PageChangedEvent): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loeadMessages();
    }
  }

}
