import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: true, showIndicators: true } }
  ]
})
export class HomeComponent implements OnInit {

  isRegistered = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  toggleRegister() {
    this.isRegistered = !this.isRegistered;
  }

  cancelRegisterMode(event:boolean){
    this.isRegistered = event;
  }

}
