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

  reunions: any[] = [];
  salles: any[] = [];
  reunionsPresentielles: any[] = [];

  salleForm!: FormGroup;

  isModalOpen = false;
  selectedSalle: any = null;

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

  ngOnInit(): void {
    this.salleForm = this.fb.group({
      id: ['', Validators.required],
      reunionId: ['']
    });

    this.reunionService.getSalleAvecReservation().subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data);
        this.salles = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des salles:', err);
        alert('Une erreur est survenue lors de la récupération des salles. Vérifiez les logs du serveur.');
      }
    });


    this.reunionService.getReunions().subscribe({
      next: (data: any) => {
        this.reunions = Array.isArray(data) ? data : [];
        this.reunionsPresentielles = this.reunions.filter(reunion => reunion.type === "PRESENTIEL");
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des réunions', err);
      }
    });
  }

  modifieSalle(salle: any): void {
    this.selectedSalle = salle;
    this.salleForm.patchValue({
      id: salle.id,
      nom: salle.nom,
      capacite: salle.capacite,
      disponible: salle.disponible,
      reunionId: salle.reunion ? salle.reunion.id : ''
    });
    this.isModalOpen = true;
  }


  onSalleChange(event: any): void {
    const selectedSalleId = event.target.value;
    this.selectedSalle = this.salles.find(salle => salle.id.toString() === selectedSalleId.toString());
    if (this.selectedSalle) {
      this.salleForm.patchValue({ capacite: this.selectedSalle.capacite });
    }
  }


 updateSalle(): void {
  if (this.salleForm.valid && this.selectedSalle) {
    const selectedReunion = this.reunions.find(
      reunion => reunion.id.toString() === this.salleForm.value.reunionId.toString()
    );

    const updatedSalle = {
      ...this.selectedSalle,
      reunion: selectedReunion ?? null  
    };

    if (!updatedSalle.reunion) {
      alert('Veuillez sélectionner une réunion existante.');
      return;
    }

    this.reunionService.updateSalle(updatedSalle).subscribe({
      next: (data: any) => {
        console.log("Salle mise à jour :", data);

        this.salles = this.salles.map(salle =>
          salle.id === updatedSalle.id ? { ...salle, reunion: updatedSalle.reunion } : salle
        );

        alert('Salle mise à jour avec succès');
        this.fermerModal();
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour de la salle:', err);
        alert('Erreur lors de la mise à jour de la salle.');
      }
    });
  } else {
    alert('Veuillez remplir tous les champs du formulaire.');
  }
}



  supprimerSalle(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce participant ?')) {
      this.reunionService.deleteSalle(id).subscribe({
        next: () => {
          alert('Salle supprimé avec succès');
          this.salles = this.salles.filter(s => s.id !== id);
        },
        error: err => console.error('Erreur lors de la suppression :', err)
      });
    }
  }

  fermerModal(): void {
    this.isModalOpen = false;
    this.selectedSalle = null;
    this.salleForm.reset({ disponible: true, capacite: 1 });
  }

}
