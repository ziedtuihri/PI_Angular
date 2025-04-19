import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  private readonly apiUrl = 'http://localhost:8081/pi'; 

  constructor(private readonly http: HttpClient) {}


  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
    }),
  };

  createReunion(reunion: any) {
    console.log('reunion',reunion)
    const url = `${this.apiUrl}/create`;
    return this.http.post(url, reunion,this.httpOptions);
  }

  getParticipants() {
    const url = `${this.apiUrl}/participants`;
    return this.http.get(url,this.httpOptions);
  }

  getUsers() {
    const url = `${this.apiUrl}/users`;
    return this.http.get(url,this.httpOptions);
  }

  getSalles() {
    const url = `${this.apiUrl}/salle`;
    return this.http.get(url,this.httpOptions);
  }


  getEvenement() {
    const url = `${this.apiUrl}/evenements`;
    return this.http.get(url,this.httpOptions);
  }

  getReunions() {
    const url = `${this.apiUrl}/reunions`;
    return this.http.get(url,this.httpOptions);
  }

  updateReunion(reunion: any) {
    const url = `${this.apiUrl}/reunion/${reunion.id}`;
    return this.http.put(url, reunion, this.httpOptions);
  }



  deleteReunion(id: number) {
    const url = `${this.apiUrl}/reunion/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
  
  
  
}
