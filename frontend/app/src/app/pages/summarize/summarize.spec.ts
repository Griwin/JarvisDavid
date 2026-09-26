import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ApiService, SummarizationResponse } from '../../../../services/api.service';
import { Summarize } from './summarize';

describe('Summarize', () => {
  let component: Summarize;
  let fixture: ComponentFixture<Summarize>;
  let apiService: { summarize: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    apiService = { summarize: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Summarize],
      providers: [{ provide: ApiService, useValue: apiService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Summarize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should summarize a valid text', () => {
    const response: SummarizationResponse = { summaryText: 'Un résumé concis.' };
    apiService.summarize.mockReturnValue(of(response));
    component.sourceText = 'Voici un texte suffisamment long pour être résumé par le modèle local.';

    component.summarize();

    expect(apiService.summarize).toHaveBeenCalledWith({ text: component.sourceText });
    expect(component.summaryText).toBe('Un résumé concis.');
    expect(component.isLoading).toBe(false);
  });

  it('should not call the API for a short text', () => {
    component.sourceText = 'Trop court.';

    component.summarize();

    expect(apiService.summarize).not.toHaveBeenCalled();
  });

  it('should expose the API error message', () => {
    apiService.summarize.mockReturnValue(throwError(() => ({
      error: { error: { message: 'Ollama est indisponible.' } },
    })));
    component.sourceText = 'Voici un texte suffisamment long pour déclencher un appel au modèle local.';

    component.summarize();

    expect(component.errorMessage).toBe('Ollama est indisponible.');
    expect(component.isLoading).toBe(false);
  });
});
