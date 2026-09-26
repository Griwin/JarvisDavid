import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faFilePdf, faLanguage, faShieldHalved, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, FontAwesomeModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  readonly icons = {
    arrow: faArrowRight,
    pdf: faFilePdf,
    translate: faLanguage,
    summarize: faWandMagicSparkles,
    privacy: faShieldHalved,
  };
}
