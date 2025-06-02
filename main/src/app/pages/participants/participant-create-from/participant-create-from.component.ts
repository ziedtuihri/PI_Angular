import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-participant-create-from',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './participant-create-from.component.html',
  styleUrl: './participant-create-from.component.scss'
})
export class ParticipantCreateFromComponent implements OnInit {
  participantForm!: FormGroup;
  users: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly reunionService: ReunionService,
  ) { }

  ngOnInit(): void {
    this.participantForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userId: ['', Validators.required]
    });

    this.reunionService.getUsers().subscribe({
      next: (data: any) => {
        console.log('Données reçues de getUsers():', data);
        this.users = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      }
    });



  }
  

  onSubmit(): void {
    if (this.participantForm.invalid) {
      this.participantForm.markAllAsTouched();
      return;
    }

    const participantData = {
      nom: this.participantForm.get('nom')?.value,
      email: this.participantForm.get('email')?.value,
      user: { id: this.participantForm.get('userId')?.value }
    };

    this.reunionService.createParticipant(participantData).subscribe({
      next: () => {
        alert('Participant ajouté avec succès !');
        this.participantForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du participant :', err);
      }
    });
  }

}
