import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private baseUrl = 'http://localhost:8081/api/sprints/calendar-events'; // Remplace par l'URL réelle de ton API

  constructor(private http: HttpClient) {}

  getAll(): Observable<CalendarEvent[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((response: any[]) => {
        return response.map(item => ({
          title: item.title,
          start: new Date(item.start), // Convertit la chaîne en objet Date
          end: new Date(item.end)     // Convertit la chaîne en objet Date
        }));
      })
    );
  }

  // Si tu as besoin de récupérer un événement par ID, adapte cette méthode en conséquence
  // getById(id: number): Observable<CalendarEvent> {
  //   return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
  //     map(item => ({
  //       title: item.title,
  //       start: new Date(item.start),
  //       end: new Date(item.end)
  //     }))
  //   );
  // }

  // Si tu as des méthodes pour créer, mettre à jour ou supprimer, adapte-les en suivant la structure
}