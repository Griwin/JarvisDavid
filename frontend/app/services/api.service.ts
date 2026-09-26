import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type LanguageCode = 'fr' | 'en' | 'zh';
export type TranslationTone = 'natural' | 'friendly' | 'polite';

export interface TranslationRequest {
  text: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  tone: TranslationTone;
}

export interface TranslationResponse {
  translatedText: string;
  meta: {
    sourceLanguage: LanguageCode;
    targetLanguage: LanguageCode;
    tone: TranslationTone;
  };
}

export interface SummarizationRequest {
  text: string;
}

export interface SummarizationResponse {
  summaryText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  translate(data: TranslationRequest): Observable<TranslationResponse> {
    return this.http.post<TranslationResponse>(`${this.apiUrl}/translate`, data);
  }

  summarize(data: SummarizationRequest): Observable<SummarizationResponse> {
    return this.http.post<SummarizationResponse>(`${this.apiUrl}/summarize`, data);
  }
}
