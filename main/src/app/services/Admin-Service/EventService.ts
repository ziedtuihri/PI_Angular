import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Event {
  id?: number; // id is optional when creating
  titre: string;
  description: string;
  date: string; // ISO String (yyyy-MM-dd) usually
  lieu: string;
  status?: string; // Optional in case backend doesn't send it always
  entreprise?: {
    id: number;
    nom: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = `${environment.apiUrl}/evenements`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  add(event: Event): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event, this.httpOptions);
  }

  update(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }
}
