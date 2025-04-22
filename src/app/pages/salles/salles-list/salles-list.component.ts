import { Component, OnInit } from '@angular/core';
import { ReunionService } from 'src/app/services/ReunionService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'salles-list',
  templateUrl: './salles-list.component.html',
  styleUrls: ['./salles-list.component.scss'],
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
  selectedReunion: any = null;
  selectedSalle: any;

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

  ngOnInit(): void {
    this.salleForm = this.fb.group({
      date: ['', Validators.required],
      heure: ['', Validators.required],
      duree: ['', Validators.required],
      salle: [undefined],
    });

    this.reunionService.getSalleAvecReservation().subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data);
        try {
          this.salles = Array.isArray(data) ? data : [];
        } catch (e) {
          console.error('Erreur lors du traitement des données:', e);
        }
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

  modifierSalle(reunion: any) {
    this.selectedReunion = reunion;
    this.salleForm.patchValue({
      date: reunion.date,
      heure: reunion.heure,
      duree: reunion.duree,
      salle: reunion.salle?.id ?? null,
    });
    this.isModalOpen = true;
  }

  onSalleChange(event: any): void {
    const selectedSalleId = event.target.value;
    this.selectedSalle = this.salles.find(salle => salle.id.toString() === selectedSalleId.toString());
  }

  updateReservation(): void {
    if (this.salleForm.valid) {
      const { date, heure, duree, salle } = this.salleForm.value;

      if (!salle) {
        alert('Veuillez sélectionner une salle pour la réservation.');
        return;
      }

      const updatedReservation = {
        id: this.selectedReunion.id,
        date: date,
        heure: heure,
        duree: duree,
        salleId: salle.id,
      };

      this.reunionService.updateReservation(updatedReservation).subscribe({
        next: (response) => {
          alert('Réservation mise à jour avec succès');
          this.fermerModal();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la réservation:', error);
          alert('Erreur lors de la mise à jour de la réservation');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  reserveSalle(salle: any): void {
    // Récupérer les informations nécessaires à la réservation
    const date = this.salleForm.get('date')?.value;
    const heure = this.salleForm.get('heure')?.value;
    const duree = this.salleForm.get('duree')?.value;
  
    if (!date || !heure || !duree) {
      alert('Veuillez remplir les informations de la réunion (date, heure, durée).');
      return;
    }
  
    // Appeler le service pour effectuer la réservation
    this.reunionService.reserverSalle(salle.id, date, heure, duree, this.reunionId).subscribe({
      next: (response) => {
        alert('Salle réservée avec succès');
        this.salleForm.reset(); // Optionnel : réinitialiser le formulaire après réservation
      },
      error: (error) => {
        alert('Erreur lors de la réservation de la salle');
      }
    });
  }
  
  
  fermerModal() {
    this.isModalOpen = false;
    this.selectedReunion = null;
  }

}
