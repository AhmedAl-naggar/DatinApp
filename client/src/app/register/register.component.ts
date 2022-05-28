import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model:any={};
  @Output() cancelRegister = new EventEmitter();

  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe(res=>{
      console.log(res);
    },error=>{
      console.log(error);
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
    console.log("from register comp. cancelRegister()");
  }
}
