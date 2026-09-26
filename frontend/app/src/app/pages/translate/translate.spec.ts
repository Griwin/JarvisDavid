import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Translate } from './translate';
import { ApiService, TranslationResponse } from '../../../../services/api.service';

describe('Translate', () => {
  let component: Translate;
  let fixture: ComponentFixture<Translate>;
  let apiService: { translate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    apiService = { translate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Translate],
      providers: [{ provide: ApiService, useValue: apiService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Translate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the translated text', () => {
    const response: TranslationResponse = {
      translatedText: 'Hello',
      meta: { sourceLanguage: 'fr', targetLanguage: 'en', tone: 'natural' },
    };
    apiService.translate.mockReturnValue(of(response));
    component.sourceText = 'Bonjour';
    component.targetLanguage = 'en';

    component.translate();

    expect(apiService.translate).toHaveBeenCalledWith({
      text: 'Bonjour',
      sourceLanguage: 'fr',
      targetLanguage: 'en',
      tone: 'natural',
    });
    expect(component.translatedText).toBe('Hello');
    expect(component.errorMessage).toBe('');
  });

  it('should expose the API error message', () => {
    apiService.translate.mockReturnValue(throwError(() => ({
      error: { error: { message: 'Ollama est indisponible.' } },
    })));
    component.sourceText = 'Bonjour';
    component.targetLanguage = 'en';

    component.translate();

    expect(component.errorMessage).toBe('Ollama est indisponible.');
    expect(component.isLoading).toBe(false);
  });
});
