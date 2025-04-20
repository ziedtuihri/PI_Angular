import { Component, OnInit } from '@angular/core';
import { ReunionService } from 'src/app/services/ReunionService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'salles-list',
  templateUrl: './salles-list.component.html',
  styleUrls: ['./salles-list.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SallesListComponent implements OnInit {
  sallesDisponibles: any[] = [];
  reunionDetails: any[] = [];

  constructor(private readonly reunionService: ReunionService) {}

  ngOnInit(): void {
    this.reunionService.getReunions().subscribe({
      next: (reunions: any) => {
        this.reunionDetails = reunions;

        this.reunionDetails.forEach((reunion) => {
          const { date, heure, duree } = reunion;

          this.reunionService.getSallesDisponibles(date, heure, duree).subscribe({
            next: (data: any) => {
              reunion.salles = data;

              reunion.salles.forEach((salle: any) => {
                salle.reunionReseree = reunion.titre; 
              });
            },
            error: (error) => {
              console.error(`Erreur lors de la récupération des salles disponibles pour la réunion ${reunion.titre}:`, error);
            },
            complete: () => {
              console.log(`Récupération des salles pour la réunion ${reunion.titre} terminée.`);
            }
          });
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des réunions', error);
      },
      complete: () => {
        console.log('La récupération des réunions est terminée.');
      }
    });
  }
  reserveSalle(salle: any, reunion: any, date: string, heure: string, duree: string) {
    const dureeNumber = Number(duree);
  
    if (isNaN(dureeNumber)) {
      console.error("La durée n'est pas un nombre valide:", duree);
      return;
    }
  
    if (salle.disponible) {
      // Appeler l'API pour réserver la salle
      this.reunionService.reserveSalle(reunion.id, salle.id, date, heure, dureeNumber.toString()).subscribe({
        next: (response: any) => {
          console.log(`Salle ${salle.nom} réservée avec succès`);
          salle.disponible = false;
          salle.reunionReseree = reunion.titre;  // Mettre à jour le statut de la salle
        },
        error: (error: any) => {
          console.error(`Erreur lors de la réservation de la salle ${salle.nom}:`, error);
        }
      });
    } else {
      console.log(`La salle ${salle.nom} n'est pas disponible pour la réunion ${reunion.titre}`);
    }
  }
  
  

}
