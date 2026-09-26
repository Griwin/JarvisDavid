import { Component, DestroyRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faClockRotateLeft, faFilePdf, faGaugeHigh, faLanguage, faRobot, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
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
    FontAwesomeModule,
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
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  readonly icons = {
    menu: faBars,
    robot: faRobot,
    dashboard: faGaugeHigh,
    translate: faLanguage,
    summarize: faWandMagicSparkles,
    pdf: faFilePdf,
    history: faClockRotateLeft,
  };
  isSidebarOpen = true;
  isMobile = false;

  constructor() {
    this.breakpointObserver.observe('(max-width: 800px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isMobile = matches;
        this.isSidebarOpen = !matches;
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }
}
