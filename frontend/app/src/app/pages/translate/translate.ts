import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ApiService,
  LanguageCode,
  TranslationRequest,
  TranslationTone,
} from '../../../../services/api.service';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './translate.html',
  styleUrl: './translate.css'
})
export class Translate {
  sourceText = '';
  translatedText = '';
  errorMessage = '';
  isLoading = false;

  sourceLanguage: LanguageCode = 'fr';
  targetLanguage: LanguageCode = 'zh';
  tone: TranslationTone = 'natural';

  constructor(private api: ApiService) {}

  translate(): void {
    const text = this.sourceText.trim();
    if (!text || this.sourceLanguage === this.targetLanguage || this.isLoading) {
      return;
    }

    const payload: TranslationRequest = {
      text,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage,
      tone: this.tone
    };

    this.errorMessage = '';
    this.translatedText = '';
    this.isLoading = true;

    this.api.translate(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.translatedText = response.translatedText;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.error?.message
            ?? 'La traduction a échoué. Vérifiez qu’Ollama et le modèle sont disponibles.';
        }
      });
  }

  swapLanguages(): void {
    [this.sourceLanguage, this.targetLanguage] = [this.targetLanguage, this.sourceLanguage];

    if (this.translatedText) {
      [this.sourceText, this.translatedText] = [this.translatedText, this.sourceText];
    }

    this.errorMessage = '';
  }

  get canTranslate(): boolean {
    return this.sourceText.trim().length > 0
      && this.sourceText.length <= 5000
      && this.sourceLanguage !== this.targetLanguage
      && !this.isLoading;
  }

  copyResult(): void {
    if (!this.translatedText) {
      return;
    }

    navigator.clipboard.writeText(this.translatedText).catch(() => {
      this.errorMessage = 'Impossible de copier automatiquement le résultat.';
    });
  }
}
