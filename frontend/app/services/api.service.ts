import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api/ai_requests';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les requêtes IA
  getAiRequests(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
