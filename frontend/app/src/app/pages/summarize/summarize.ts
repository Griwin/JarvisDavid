import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './summarize.html',
  styleUrl: './summarize.css',
})
export class Summarize {
  sourceText = '';
  summaryText = '';
  errorMessage = '';
  isLoading = false;

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

  copyResult(): void {
    if (!this.summaryText) {
      return;
    }

    navigator.clipboard.writeText(this.summaryText).catch(() => {
      this.errorMessage = 'Impossible de copier automatiquement le résumé.';
    });
  }
}
