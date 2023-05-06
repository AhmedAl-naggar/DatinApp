import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private accountSrvice: AccountService, private stoastr: ToastrService) {}

  canActivate(): Observable<boolean> {
    return this.accountSrvice.currentUser$.pipe(
      map(user=>{
        if(user.roles.includes('Admin') || user.roles.includes('Moderator')){
          return true;
        }
        this.stoastr.error('You cannot enter this area');
      })
    );
  }
  
}
