import { Component, OnInit } from '@angular/core';
import { ReunionService } from 'src/app/services/ReunionService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'salles-list',
  templateUrl: './salles-list.component.html',
  styleUrls: ['./salles-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SallesListComponent implements OnInit {

  sallesDisponibles: any[] = [];
  reunionDetails: any[] = [];
  salles: any[] = [];
  allSalles: any[] = [];
  salleId: number = 0;
  date: string = '';
  heure: string = '';
  duree: string = '';
  reunionId: number = 0;
  salleForm!: FormGroup;
  isModalOpen = false;
  selectedSalle: any = null;

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

  ngOnInit(): void {
    this.salleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      capacite: [1, [Validators.required, Validators.min(1)]],
      disponible: [undefined]
    });

    this.reunionService.getSalleAvecReservation().subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data);
        this.salles = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des salles:', err);
        alert('Une erreur est survenue lors de la récupération des salles. Vérifiez les logs du serveur.');
      }
    });

    this.reunionService.getSalles().subscribe({
      next: (data: any) => this.allSalles = Array.isArray(data) ? data : []
    });
  }

  modifieSalle(salle: any): void {
    this.selectedSalle = salle;
    
    const hasActiveReservation = Array.isArray(salle.reservations) && salle.reservations.some((reservation: any) => {
      const reservationDate = new Date(`${reservation.reunion.date} ${reservation.reunion.heure}`);
      return reservationDate > new Date(); // La réservation est dans le futur
    });
    
    // Si la salle a des réservations actives, elle sera considérée comme non disponible
    const isAvailable = salle.disponible && !hasActiveReservation; 
  
    this.salleForm.patchValue({
      nom: salle.nom,
      capacite: salle.capacite,
      disponible: isAvailable, // Mettez à jour la disponibilité en fonction des réservations
    });
    
    this.isModalOpen = true;
  }
  
  updateSalle(): void {
    if (this.salleForm.valid && this.selectedSalle) {
      const nouvelleSalle = {
        ...this.selectedSalle,
        ...this.salleForm.value
      };

      this.reunionService.updateSalle(nouvelleSalle).subscribe({
        next: () => {
          this.salleForm.reset({ disponible: true, capacite: 1 });
          this.isModalOpen = false;
          this.selectedSalle = null;

          // Refresh salles
          this.reunionService.getSalleAvecReservation().subscribe({
            next: (data: any) => {
              this.salles = Array.isArray(data) ? data : [];
            }
          });
        },
        error: () => {
          alert('Erreur lors de la mise à jour de la salle.');
        }
      });
    }
  }

  supprimerSalle(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce participant ?')) {
      this.reunionService.deleteSalle(id).subscribe({
        next: () => {
          alert('Salle supprimé avec succès');
          this.allSalles = this.allSalles.filter(s => s.id !== id); // Mise à jour du tableau local
        },
        error: err => console.error('Erreur lors de la suppression :', err)
      });
    }
  }

  reserveSalle(salle: any): void {
    const date = this.date;
    const heure = this.heure;
    const duree = this.duree;

    if (!date || !heure || !duree) {
      alert('Veuillez remplir les informations de la réunion (date, heure, durée).');
      return;
    }

    this.reunionService.reserverSalle(salle.id, date, heure, duree, this.reunionId).subscribe({
      next: () => {
        alert('Salle réservée avec succès');
        this.salleForm.reset({ disponible: true, capacite: 1 });
      },
      error: () => {
        alert('Erreur lors de la réservation de la salle');
      }
    });
  }

  fermerModal(): void {
    this.isModalOpen = false;
    this.selectedSalle = null;
    this.salleForm.reset({ disponible: true, capacite: 1 });
  }

}
