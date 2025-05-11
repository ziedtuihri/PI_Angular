import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReunionService {

    private readonly apiUrl = 'http://localhost:8081/pi';

    constructor(private readonly http: HttpClient) { }


    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
        }),
    };

    createReunion(reunion: any) {
        const url = `${this.apiUrl}/reunions/create`;
        return this.http.post(url, reunion, this.httpOptions);
    }

    getParticipants() {
        const url = `${this.apiUrl}/participants`;
        return this.http.get(url, this.httpOptions);
    }

    getUsers() {
        const url = `${this.apiUrl}/users`;
        return this.http.get(url, this.httpOptions);
    }

    getSalles() {
        const url = `${this.apiUrl}/salles`;
        return this.http.get(url, this.httpOptions);
    }


    getEvenement() {
        const url = `${this.apiUrl}/reunions/evenements`;
        return this.http.get(url, this.httpOptions);
    }

    getReunions() {
        const url = `${this.apiUrl}/reunions`;
        return this.http.get(url, this.httpOptions);
    }

    updateReunion(reunion: any) {
        const url = `${this.apiUrl}/reunions/reunion/${reunion.id}`;
        return this.http.put(url, reunion, this.httpOptions);
    }

    updateParticipant(updatedParticipant: any) {
        const url = `${this.apiUrl}/participants/${updatedParticipant.id}`;
        return this.http.put(url, updatedParticipant, this.httpOptions);
    }


    deleteReunion(id: number) {
        const url = `${this.apiUrl}/reunions/reunion/${id}`;
        return this.http.delete(url, this.httpOptions);
    }


    deleteParticipant(id: number) {
        const url = `${this.apiUrl}/participants/${id}`;
        return this.http.delete(url, this.httpOptions);
    }

    deleteSalle(id: number) {
        const url = `${this.apiUrl}/salles/salle/${id}`;
        return this.http.delete(url, this.httpOptions);
    }


    createSalle(salle: any) {
        const url = `${this.apiUrl}/salles/add`;
        return this.http.post(url, salle, this.httpOptions);
    }


    createParticipant(participant: any) {
        const url = `${this.apiUrl}/participants`;
        return this.http.post(url, participant, this.httpOptions);
    }

    getSallesDisponibles(date: string, heure: string, duree: string) {
        const url = `${this.apiUrl}/salles-disponibles?date=${date}&heure=${heure}&duree=${duree}`;
        return this.http.get(url, this.httpOptions);
    }

    updateReservation(reservation: any) {
        const url = `${this.apiUrl}/reservation/${reservation.id}`;
        return this.http.put(url, reservation, this.httpOptions);
    }


    updateSalle(salle: any) {
        const url = `${this.apiUrl}/salles/update/${salle.id}`;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.put(url, salle, httpOptions);
    }


    getSalleAvecReservation() {
        const url = `${this.apiUrl}/salles/salles-avec-reservations`;
        return this.http.get(url, this.httpOptions);
    }

    reserverSalle(
        salleId: number,
        date: string,
        heure: string,
        duree: string,
        reunionId: number
    ) {
        // Créez l'objet avec les paramètres nécessaires pour la requête
        const params = {
            salleId: salleId.toString(),
            date: date,
            heure: heure,
            duree: duree,
            reunionId: reunionId.toString(),
        };

        // Effectuer la requête POST
        return this.http.post(`${this.apiUrl}/reserver-salle`, null, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params: params,
        });
    }


    getSallesDisponiblesUniquement() {
        const url = `${this.apiUrl}/salles-disponibles-uniques`; // L'URL de la nouvelle méthode
        return this.http.get(url, this.httpOptions);
    }

}
