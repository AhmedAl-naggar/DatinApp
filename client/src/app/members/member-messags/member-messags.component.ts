import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/_models/Message';
import { MessageService } from 'src/_services/message.service';

@Component({
  selector: 'app-member-messags',
  templateUrl: './member-messags.component.html',
  styleUrls: ['./member-messags.component.css']
})
export class MemberMessagsComponent implements OnInit {
  @ViewChild('messageForm') messageForm : NgForm;
  @Input() messages: Message[] ;
  @Input() username: string ;
  messageContent: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage(){
    this.messageService.sendMessage(this.username,this.messageContent).subscribe(message=>{
      this.messages.push(message);
      console.log(message);
      this.messageForm.reset();
    });

  }

}
