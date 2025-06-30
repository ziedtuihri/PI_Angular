// src/app/services/Student-Service/offre-student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Offre } from 'src/app/models/offre.model';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OffreStudentService {
  private apiUrl = `${environment.apiUrl}/offres`; // adjust if needed

  constructor(private http: HttpClient) {}

  // Get only AVAILABLE offers, with dateDebut/dateFin normalized
  getAvailableOffers(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/disponibles`).pipe(
      map((offres: any[]) =>
        offres.map(offre => ({
          ...offre,
          dateDebut: offre.dateDebut || offre.start || null,
          dateFin: offre.dateFin || offre.end || null
        }))
      )
    );
  }

  getAll(): Observable<Offre[]> {
    return this.getAvailableOffers();
  }


  // Optionally: Get a single offer with fallback normalization
  getById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/${id}`).pipe(
      map((offre: any) => ({
        ...offre,
        dateDebut: offre.dateDebut || offre.start || null,
        dateFin: offre.dateFin || offre.end || null
      }))
    );
  }



}
