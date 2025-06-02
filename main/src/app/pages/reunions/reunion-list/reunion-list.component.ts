import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-reunion-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reunion-list.component.html',
  styleUrl: './reunion-list.component.scss'
})
export class ReunionListComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

  reunions: any[] = [];
  filteredReunions: any[] = [];
  salles: any[] = [];
  utilisateurs: any[] = [];
  participants: any[] = [];


  selectedSearchType: string = '';

  reunionForm!: FormGroup;

  selectedReunion: any = null;
  editFormData: any = {};
  isModalOpen = false;
  
  selectedSalle: any;

  selectedType: string = 'PRESENTIEL';

  typesReunion = [
    { label: 'Physique', value: 'PRESENTIEL' },
    { label: 'Virtuelle', value: 'EN_LIGNE' }
  ];

  ngOnInit(): void {
    // Initialize the form as before
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

    // Handle type change for EN_LIGNE and PRESENTIEL
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


    this.loadReunions();

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

  loadReunions() {
    this.reunionService.getReunions().subscribe({
      next: (data: any) => {
        this.reunions = Array.isArray(data) ? data : [];
        this.reunions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.filteredReunions = [...this.reunions];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des réunions', err);
      }
    });
  }

  filterReunionsByType(): void {
    if (this.selectedSearchType) {
      this.filteredReunions = this.reunions.filter(reunion => reunion.type === this.selectedSearchType);
    } else {
      this.filteredReunions = [...this.reunions];

    }
  }

  onEdit(reunion: any) {
    if (reunion) {
      this.isModalOpen = true;
      this.selectedReunion = reunion;
      this.selectedType = reunion.type;
      const selectedParticipants = reunion.participants?.map((p: any) => p.id) ?? [];
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
    } else {
      console.error('La réunion sélectionnée est invalide ou null');
    }
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

      if (value.type === 'PRESENTIEL') {
        const selectedSalle = this.salles.find(s => s.id === value.salle);
        if (selectedSalle && selectedSalle.disponible === false) {
          alert("La salle sélectionnée n'est pas disponible.");
          return;
        }
      }

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
          console.log('Succès:', res);
          alert('Réunion mise à jour avec succès!');
        },
        error: err => {
          console.error('Erreur détectée:', err);
          alert('Réunion mise à jour avec succès!');
          this.closeModal();
        }
      });
    }
  }


  isReunionPassed(date: string): boolean {
    const today = new Date();
    const reunionDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    return reunionDate < today;
  }



  onDelete(reunion: any): void {
    if (confirm(`Voulez-vous vraiment supprimer la réunion "${reunion.titre}" ?`)) {
      this.reunionService.deleteReunion(reunion.id).subscribe({
        next: () => {
          alert('Réunion supprimée avec succès.');
          this.loadReunions();
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? 'Erreur lors de la suppression.';
          alert('Erreur : ' + errorMessage);
        }
      });
    }
  }


  setDefaultLien(event: Event): void {
    const target = event?.target as HTMLSelectElement;
    const platforme = target.value;
    let defaultLien = '';

    if (platforme === 'zoom') {
      defaultLien = 'https://zoom.us/start/videomeeting';
    } else if (platforme === 'teams') {
      defaultLien = 'https://teams.microsoft.com/l/meeting/new';
    } else if (platforme === 'meet') {
      defaultLien = 'https://meet.google.com/new';
    }

    this.reunionForm.get('lien')?.setValue(defaultLien, { emitEvent: false });
  }




}