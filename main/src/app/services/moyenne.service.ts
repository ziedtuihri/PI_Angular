import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projet {
  id: number;
  nom: string;
}

export interface ProjetDto {
  id: number;
  nom: string;
}


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
export interface UserNameDto {
  id: number;
  firstName: string;
  lastName: string;
}


@Injectable({
  providedIn: 'root'
})
export class MoyenneService {
  private apiUrl = 'http://localhost:8081/api'; // adapte selon ton backend

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la moyenne d'un projet pour un utilisateur donné
  getProjetsDto(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/projets/ProjetDTO`);
  }

//  getUsers(): Observable<User[]> {
  //  return this.http.get<User[]>(`${this.apiUrl}/users/all`);
  //}

  getUsers(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.apiUrl}/users/all`);
  }

  getUsersByRole(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.apiUrl}/users/role`);
  }


 /* getMoyenneProjet(projetId: number, userId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/notes/moyenne/projet`,
      {
        params: {
          projetId: projetId.toString(),
          userId: userId.toString()
        }
      }
    );
  }*/
  getMoyenneProjet(projetId: number, userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notes/moyenne/projet`, {
      params: {
        projetId: projetId.toString(),
        userId: userId.toString(),
      },
    });
  }


}
