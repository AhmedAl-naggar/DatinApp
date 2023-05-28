import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/_models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);

  hubUrl = environment.hubUrl;
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {

  }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      // this.toastr.info(username + ' has connected');
      this.onlineUsers$.pipe(take(1)).subscribe(usernames=>{
        this.onlineUsersSource.next([...usernames, username])
      })
    })

    this.hubConnection.on('UserIsOffline', username => {
      // this.toastr.warning(username + ' has disconnected');
      this.onlineUsers$.pipe(take(1)).subscribe(usernames=>{
        this.onlineUsersSource.next([...usernames.filter(x=>x !== username), username])
      })
    })

    this.hubConnection.on('GetOnlineUsers', (usernames:string[] )=> {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived', (user)=> {
      console.log(user["username"] + " " + user["knownAs"] );
      
      this.toastr.info(user["knownAs"]  + ' has sent you a new message!')
      .onTap
      .pipe(take(1))
      .subscribe(()=>this.router.navigateByUrl('/members/'+ user["username"] + '?tab=3'));
    })


  }

  stopHubConnection() {
    this.hubConnection.stop().catch(erroe => console.log(erroe));
  }
}
