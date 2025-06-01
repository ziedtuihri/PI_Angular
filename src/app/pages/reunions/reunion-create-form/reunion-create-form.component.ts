import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'reunion-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
      titre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      description: ['', [Validators.pattern(/\S+/)]],
      date: [undefined, Validators.required],
      heure: [undefined, Validators.required],
      duree: [undefined, Validators.required],
      type: ['PRESENTIEL', Validators.required],
      salle: [''],
      capacite: [undefined, Validators.min(1)],
      createur: [undefined, Validators.required],
      participants: this.fb.array([], Validators.required),
      plateforme: [undefined],
      lien: ['', Validators.pattern(/^(https?:\/\/)?([\w-]+\.)*[\w-]+(\/[\w- ./?%&=]*)?$/)]
    });

    this.reunionService.getParticipants().subscribe({
      next: (data: any) => {
        this.participants = Array.isArray(data) ? data : [];
      }
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
    const participantsControl = this.reunionForm.get('participants');

    if (this.selectedType === 'PRESENTIEL') {
      salleControl?.setValidators(Validators.required);
      lienControl?.clearValidators();
      plateformeControl?.clearValidators();
      salleControl?.setValue(null);
      participantsControl?.clearValidators();
      participantsControl?.setValue([]);
    } else {
      salleControl?.clearValidators();
      plateformeControl?.setValidators(Validators.required);
      lienControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      participantsControl?.setValidators(Validators.required);
    }
    salleControl?.updateValueAndValidity();
    lienControl?.updateValueAndValidity();
    plateformeControl?.updateValueAndValidity();
    participantsControl?.updateValueAndValidity();
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
    const value = event.target.value;

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
      if (value.type === 'EN_LIGNE' && value.participants.length === 0) {
        alert('Veuillez sélectionner des participants.');
        return;
      }
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
          participants: value.participants
            .filter((id: any) => id != null)
            .map((id: any) => {
              const participant = this.participants.find(p => p.id.toString() === id.toString());
              return {
                id,
                nom: participant ? participant.nom : 'Nom non disponible',
                email: participant ? participant.email : 'Email non disponible'
              };
            }),
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
          participants: [],
          lienZoom: value.lien
        };
      }

      this.reunionService.createReunion(formatted).subscribe({
        next: res => {
          alert('Réunion créée avec succès!');
          this.reunionForm.reset();
        },
        error: err => {
          alert('Réunion créée avec succès!');
          this.reunionForm.reset();
        }
      });

    }
  }
}
