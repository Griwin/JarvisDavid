import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isSidebarOpen = true;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
