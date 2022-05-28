import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model:any={};
  @Output() cancelRegister = new EventEmitter();

  constructor(private accountService:AccountService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe(res=>{
      this.toastr.success(res.username,"Successfully registered")
      this.router.navigateByUrl('/members');
      console.log(res);
    },error=>{
      console.log(error);
      this.toastr.error(error.error,"You can't register")
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
    console.log("from register comp. cancelRegister()");
  }
}
