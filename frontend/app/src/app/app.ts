import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import { NgFor } from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  templateUrl: './app.html',
})
export class App implements OnInit {
  requests: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAiRequests().subscribe({
      next: (data: any) => {

        this.requests = data.member || [];
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur API', err);
      }
    });
  }
}
