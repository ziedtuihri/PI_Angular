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
  filteredSalles: any[] = [];

  salleForm!: FormGroup;

  isModalOpen = false;
  isModalOpenModifSalle = false;

  selectedSalle: any = null;
  searchTerm: string = '';

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

  ngOnInit(): void {
    this.salleForm = this.fb.group({
      id: ['', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(3)]],
      capacite: [1, [Validators.required, Validators.min(1)]],
      disponible: [false],
      reunionId: ['']

    });

    this.fetchSalles();

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



  filterSalles(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase();
    this.filteredSalles = this.salles.filter(salle =>
      salle.nom.toLowerCase().includes(searchTerm)
    );
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

  fetchSalles(): void {
    this.reunionService.getSalleAvecReservation().subscribe({
      next: (data: any) => {
        this.salles = data;
        this.filteredSalles = this.salles;
      },
      error: (err) => {
        alert('Une erreur est survenue lors de la récupération des salles.');
      }
    });
  }

  updateSalle(): void {
    if (this.salleForm.valid) {
      const salleId = this.salleForm.value.id;
      const reunionId = this.salleForm.value.reunionId;

      if (salleId && reunionId) {
        this.reunionService.updateReunionSalle(reunionId, salleId).subscribe({
          next: () => {
            alert('Salle mise à jour avec succès');
            this.salleForm.reset();
            this.fetchSalles();
            this.fermerModal();
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de la salle', err);
            alert('Une erreur est survenue lors de la mise à jour de la salle.');
          }
        });
      } else {
        alert("Veuillez sélectionner une salle et une réunion.");
      }
    } else {
      alert("Le formulaire n'est pas valide. Veuillez vérifier les champs.");
    }
  }


  onEdit(): void {
    if (this.salleForm.valid) {
      const updatedSalle = {
        id: this.selectedSalle.id,
        nom: this.salleForm.value.nom,
        capacite: this.salleForm.value.capacite,
        disponible: this.salleForm.value.disponible
      };

      this.reunionService.updateSalle(updatedSalle).subscribe({
        next: () => {
          alert('Salle mise à jour avec succès');
          this.fetchSalles();
          this.fermerModalSalle();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la salle', err);
          alert('Une erreur est survenue lors de la mise à jour de la salle.');
        }
      });
    } else {
      alert('Le formulaire n\'est pas valide. Veuillez vérifier les champs.');
    }
  }



  modifieSalleMeme(salle: any): void {
    this.selectedSalle = salle;
    this.salleForm.patchValue({
      id: salle.id ?? '',
      nom: salle.nom ?? '',
      capacite: salle.capacite ?? 1,
      disponible: salle.disponible ?? false
    });

    this.isModalOpenModifSalle = true;
  }




  supprimerSalle(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce participant ?')) {
      this.reunionService.deleteSalle(id).subscribe({
        next: () => {
          alert('Salle supprimé avec succès');
          this.fetchSalles();
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

  fermerModalSalle(): void {
    this.isModalOpenModifSalle = false;
    this.selectedSalle = null;
    this.salleForm.reset({ disponible: true, capacite: 1 });
  }
}
