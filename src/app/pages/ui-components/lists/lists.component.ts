import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-lists',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./lists.component.scss'],
  standalone: true,
  templateUrl: './lists.component.html',
})
export class AppListsComponent implements OnInit {
  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }
  reunions: any[] = [];
  reunionForm!: FormGroup;

  selectedReunion: any = null;
  editFormData: any = {};
  isModalOpen = false;

  salles: any[] = [];
  utilisateurs: any[] = [];
  participants: any[] = [];
  selectedSalle: any;

  selectedType: string = 'PRESENTIEL';

  typesReunion = [
    { label: 'Physique', value: 'PRESENTIEL' },
    { label: 'Virtuelle', value: 'EN_LIGNE' }
  ];

  ngOnInit(): void {
    this.reunionForm = this.fb.group({
      titre: [undefined, Validators.required],
      description: [undefined],
      date: [undefined, Validators.required],
      heure: [undefined, Validators.required],
      duree: [undefined, Validators.required],
      type: ['PRESENTIEL', Validators.required],
      salle: [undefined],
      capacite: [undefined],
      createur: [undefined, Validators.required],
      participants: [[]],
      plateforme: ['zoom'],
      lien: ['']
    });

    this.reunionForm.get('type')?.valueChanges.subscribe((val) => {
      this.selectedType = val;
      if (val === 'PRESENTIEL') {
        this.reunionForm.patchValue({ plateforme: null, lien: null });
        this.reunionForm.get('salle')?.setValidators([Validators.required]);
        this.reunionForm.get('capacité')?.setValidators([Validators.required]);
      } else if (val === 'EN_LIGNE') {
        this.reunionForm.patchValue({ salle: null, capacite: null });
        this.reunionForm.get('salle')?.clearValidators();
        this.reunionForm.get('capacité')?.clearValidators();
      }
      this.reunionForm.get('salle')?.updateValueAndValidity();
      this.reunionForm.get('capacité')?.updateValueAndValidity();
    });

    this.reunionForm.get('salle')?.valueChanges.subscribe((salleId) => {
      const salle = this.salles.find(s => s.id === salleId);
      if (salle) {
        this.reunionForm.patchValue({ capacite: salle.capacite });
      } else {
        this.reunionForm.patchValue({ capacite: null });
      }
    });

    this.reunionService.getReunions().subscribe({
      next: (data: any) => this.reunions = Array.isArray(data) ? data : [],
    });

    this.reunionService.getParticipants().subscribe({
      next: (data: any) => this.participants = Array.isArray(data) ? data : []
    });

    this.reunionService.getUsers().subscribe({
      next: (data: any) => this.utilisateurs = Array.isArray(data) ? data : []
    });

    this.reunionService.getSalles().subscribe({
      next: (data: any) => this.salles = Array.isArray(data) ? data : []
    });
  }

  onEdit(reunion: any): void {

    console.log('reunion', reunion)
    this.isModalOpen = true;
    this.selectedReunion = reunion;
    this.selectedType = reunion.type;
    const selectedParticipants = reunion.participants?.map((p: any) => p.id) ?? [];
    console.log('Participants extraits:', selectedParticipants);
    this.reunionForm.patchValue({
      titre: reunion.titre,
      description: reunion.description,
      date: reunion.date,
      heure: reunion.heure,
      duree: reunion.duree,
      type: reunion.type,
      salle: reunion.salle?.id ?? null,
      capacite: reunion.capacite ?? null,
      createur: reunion.createur?.id ?? null,
      participants: selectedParticipants,
      plateforme: reunion.plateforme ?? '',
      lien: reunion.lien ?? ''
    });
  }

  onParticipantToggle(id: any, event: any): void {
    const current = this.reunionForm.get('participants')?.value ?? [];
    if (event.target.checked) {
      this.reunionForm.patchValue({ participants: [...current, id] });
    } else {
      this.reunionForm.patchValue({ participants: current.filter((p: any) => p !== id) });
    }
  }


  onSalleChange(event: any): void {
    const selectedSalleId = event.target.value;
    this.selectedSalle = this.salles.find(salle => salle.id.toString() === selectedSalleId.toString());
    if (this.selectedSalle) {
      this.reunionForm.patchValue({ capacite: this.selectedSalle.capacite });
    }
  }

  isParticipantChecked(id: number): boolean {
    const participants = this.reunionForm.get('participants')?.value ?? [];
    return participants.includes(id);  
  }



  closeModal(): void {
    this.selectedReunion = null;
    this.isModalOpen = false;
  }

  onSaveEdit(): void {
    if (this.reunionForm.valid) {
      const value = this.reunionForm.value;
      let formatted: any;

      if (value.type === 'EN_LIGNE') {
        formatted = {
          id: this.selectedReunion.id,
          titre: value.titre,
          description: value.description,
          date: value.date,
          heure: value.heure,
          duree: value.duree,
          type: value.type,
          salle: null,
          createur: { id: value.createur },
          participants: value.participants.map((id: any) => ({
            id,
            nom: this.participants.find(p => p.id === id)?.nom,
            email: this.participants.find(p => p.id === id)?.email
          })),
          lienZoom: value.lien
        };
      } else {
        formatted = {
          id: this.selectedReunion.id,
          titre: value.titre,
          description: value.description,
          date: value.date,
          heure: value.heure,
          duree: value.duree,
          type: value.type,
          salle: value.salle ? { id: value.salle, capacite: value.capacite } : null,
          createur: { id: value.createur },
          participants: value.participants.map((id: any) => ({
            id,
            nom: this.participants.find(p => p.id === id)?.nom,
            email: this.participants.find(p => p.id === id)?.email
          })),

          lienZoom: value.lien
        };
      }
      this.reunionService.updateReunion(formatted).subscribe({
        next: res => {
          alert('Réunion mis à jour avec succès!');
        },
        error: err => {
          const errorMessage = err?.error?.message ?? 'Erreur inconnue';
          if (errorMessage.includes("La salle n'est pas disponible")) {
            alert(errorMessage);
          } else {
            alert('Erreur : ' + errorMessage);
          }
        }
      })

    }
  }



  onDelete(reunion: any): void {
    if (confirm(`Voulez-vous vraiment supprimer la réunion "${reunion.titre}" ?`)) {
      this.reunionService.deleteReunion(reunion.id).subscribe({
        next: () => {
          this.reunions = this.reunions.filter(r => r.id !== reunion.id);
          alert('Réunion supprimée avec succès.');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Erreur lors de la suppression.';
          alert('Erreur : ' + errorMessage);
        }
      });
    }
  }


}
