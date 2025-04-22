import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-participant-create-from',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './participant-create-from.component.html',
  styleUrl: './participant-create-from.component.scss'
})
export class ParticipantCreateFromComponent implements OnInit {
  participantForm!: FormGroup;
  users: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly reunionService: ReunionService,
  ) {}

  ngOnInit(): void {
    this.participantForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userId: ['', Validators.required]
    });

    this.reunionService.getUsers().subscribe({
      next: (data: any) => this.users = Array.isArray(data) ? data : []
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
  
    console.log('Données du participant à envoyer :', participantData);
  
    this.reunionService.createParticipant(participantData).subscribe({
      next: () => {
        alert('Participant ajouté avec succès !');
        this.participantForm.reset();
        this.participantForm.markAsUntouched(); // Reset aussi les états de validation
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du participant :', err);
      }
    });
  }
  
}
