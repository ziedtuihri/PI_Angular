import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../models/offer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://localhost:8081/api/offers';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage or your preferred storage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getOfferById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer, { headers: this.getHeaders() });
  }

  updateOffer(id: number, offer: Offer): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, offer, { headers: this.getHeaders() });
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  attachQuizToOffer(offerId: number, quiz: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/${offerId}/quiz`, quiz, { headers: this.getHeaders() });
  }
}
