import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'reunion-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './reunion-create-form.component.html',
  styleUrl: './reunion-create-form.component.scss'
})
export class ReunionCreateFormComponent implements OnInit {

  reunionForm!: FormGroup;
  selectedType: string = 'PRESENTIEL';

  typesReunion = [
    { label: 'Physique', value: 'PRESENTIEL' },
    { label: 'Virtuelle', value: 'EN_LIGNE' }
  ];

  salles: any[] = [];
  utilisateurs: any[] = [];
  participants: any[] = [];
  selectedSalle: any;

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

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
      participants: this.fb.array([], Validators.required),
      plateforme: ['zoom'],
      lien: ['']
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

    this.onTypeChange();

    this.reunionForm.get('type')?.valueChanges.subscribe(type => {
      this.selectedType = type;
      this.onTypeChange();
    });

    this.reunionForm.get('plateforme')?.valueChanges.subscribe(platforme => {
      this.setDefaultLien(platforme);
    });
  }

  onTypeChange(): void {
    const salleControl = this.reunionForm.get('salle');
    const lienControl = this.reunionForm.get('lien');
    const plateformeControl = this.reunionForm.get('plateforme');

    if (this.selectedType === 'PRESENTIEL') {
      salleControl?.setValidators(Validators.required);
      lienControl?.clearValidators();
      plateformeControl?.clearValidators();
    } else {
      // Réinitialiser salle et capacité
      salleControl?.setValue(null);
      this.selectedSalle = null;
      this.reunionForm.get('capacite')?.setValue(null);

      salleControl?.clearValidators();
      plateformeControl?.setValidators(Validators.required);
      lienControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
    }

    salleControl?.updateValueAndValidity();
    lienControl?.updateValueAndValidity();
    plateformeControl?.updateValueAndValidity();
  }


  setDefaultLien(platforme: string): void {
    let defaultLien = '';
    if (platforme === 'zoom') {
      defaultLien = 'https://zoom.us/ma-reunion';
    } else if (platforme === 'teams') {
      defaultLien = 'https://teams.microsoft.com/ma-reunion';
    }
    this.reunionForm.get('lien')?.setValue(defaultLien, { emitEvent: false });
  }

  get participantsFormArray() {
    return this.reunionForm.get('participants') as FormArray;
  }

  onSalleChange(event: any): void {
    const selectedSalleId = event.target.value;
    this.selectedSalle = this.salles.find(salle => salle.id.toString() === selectedSalleId.toString());
    if (this.selectedSalle) {
      this.reunionForm.patchValue({ capacite: this.selectedSalle.capacite });
    }
  }

  onCheckboxChange(event: any): void {
    const formArray = this.participantsFormArray;
    const value = +event.target.value;

    if (event.target.checked) {
      formArray.push(this.fb.control(value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === value);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  onSubmit(): void {
    if (this.reunionForm.valid) {
      const value = this.reunionForm.value;
      let formatted: any;

      if (value.type === 'EN_LIGNE') {
        formatted = {
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
            email: this.participants.find(p => p.id === id)?.email ?? ''
          })),
          lienZoom: value.lien
        };
      } else {
        formatted = {
          titre: value.titre,
          description: value.description,
          date: value.date,
          heure: value.heure,
          duree: value.duree,
          type: value.type,
          salle: value.salle ? { id: value.salle, capacite: value.capacite } : null,
          createur: { id: value.createur },
          participants: value.participants.map((id: any) => ({ id })),
          lienZoom: value.lien
        };
      }

      this.reunionService.createReunion(formatted).subscribe({
        next: res => {
          alert('Réunion créée avec succès!');
          this.reunionForm.reset();
        },
        error: err => {
          console.error('Erreur:', err);
          if (err?.error?.message.includes('Salle non disponible')) {
            alert('Salle non disponible');
          } else {
            alert('Erreur de création');
          }
        }
      });
    }
  }

}

