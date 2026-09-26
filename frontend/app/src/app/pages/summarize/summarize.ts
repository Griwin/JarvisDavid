import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faCopy, faRotateLeft, faTriangleExclamation, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';

import { ApiService, SummarizationRequest } from '../../../../services/api.service';

@Component({
  selector: 'app-summarize',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
  ],
  templateUrl: './summarize.html',
  styleUrl: './summarize.css',
})
export class Summarize {
  readonly icons = { summarize: faWandMagicSparkles, sparkle: faWandMagicSparkles, copy: faCopy, copied: faCheck, reset: faRotateLeft, error: faTriangleExclamation };
  sourceText = '';
  summaryText = '';
  errorMessage = '';
  isLoading = false;
  isCopied = false;

  constructor(private readonly api: ApiService) {}

  summarize(): void {
    const text = this.sourceText.trim();
    if (!this.canSummarize) {
      return;
    }

    const payload: SummarizationRequest = { text };
    this.errorMessage = '';
    this.summaryText = '';
    this.isLoading = true;

    this.api.summarize(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.summaryText = response.summaryText;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.error?.message
            ?? 'Le résumé a échoué. Vérifiez qu’Ollama et le modèle sont disponibles.';
        },
      });
  }

  get canSummarize(): boolean {
    const length = this.sourceText.trim().length;
    return length >= 50 && length <= 20000 && !this.isLoading;
  }

  reset(): void {
    this.sourceText = '';
    this.summaryText = '';
    this.errorMessage = '';
    this.isCopied = false;
  }

  copyResult(): void {
    if (!this.summaryText) {
      return;
    }

    navigator.clipboard.writeText(this.summaryText)
      .then(() => {
        this.isCopied = true;
        window.setTimeout(() => (this.isCopied = false), 1800);
      })
      .catch(() => {
        this.errorMessage = 'Impossible de copier automatiquement le résumé.';
      });
  }
}
