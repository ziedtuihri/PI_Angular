import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../models/offer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://localhost:8080/api/offers';

  constructor(private http: HttpClient) {}

  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  getOfferById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer);
  }

  updateOffer(id: number, offer: Offer): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, offer);
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  attachQuizToOffer(offerId: number, quiz: any): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/${offerId}/quiz`, quiz);
  }
}
