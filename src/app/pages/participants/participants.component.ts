import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-participants',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent implements OnInit {
  participants: any[] = [];
  users: any[] = [];
  participantForm!: FormGroup;
  participant: any | undefined;
  isModalOpen = false;

  currentPage: number = 1;  // current page number
  itemsPerPage: number = 5; // items per page

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


    this.loadParticipants();
    // Fetching users
    this.reunionService.getUsers().subscribe({
      next: (data: any) => this.users = Array.isArray(data) ? data : [],
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });

  }


  loadParticipants() {
    this.reunionService.getParticipants().subscribe({
      next: (data: any) => {
        this.participants = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error fetching participants:', error);
      }
    });

  }

  // Pagination helper methods
  getPagedParticipants() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.participants.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.participants.length / this.itemsPerPage);
  }

  editParticipant(participant: any): void {
    this.participant = participant;
    this.isModalOpen = true;

    this.participantForm.patchValue({
      id: participant.id,
      nom: participant.nom,
      email: participant.email,
      userId: participant.user?.id
    });
  }


  
  deleteParticipant(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce participant ?')) {
      this.reunionService.deleteParticipant(id).subscribe({
        next: () => {
          alert('Participant supprimé avec succès');
          this.participants = this.participants.filter(p => p.id !== id);
          this.isModalOpen = false;
        },
        error: err => {
          if (err.error) {
            alert(err.error.message);
          } else {
            console.error('Erreur lors de la suppression :', err);
          }
        }
      });
    }
  }
  


  updateParticipant(): void {
    if (this.participantForm.invalid) {
      this.participantForm.markAllAsTouched();
      return;
    }

    const updatedParticipant = {
      id: this.participant.id,
      nom: this.participantForm.get('nom')?.value,
      email: this.participantForm.get('email')?.value,
      user: { id: this.participantForm.get('userId')?.value }
    };

    console.log('Données du participant à envoyer pour la mise à jour :', updatedParticipant);

    this.reunionService.updateParticipant(updatedParticipant).subscribe({
      next: (data: any) => {
        alert('Participant mis à jour avec succès !');
        this.resetForm();
        this.isModalOpen = false;
        this.loadParticipants();

      },
      error: (err) => {
        alert('Erreur lors de la mise à jour du participant');
      }
    });
  }


  resetForm(): void {
    this.participantForm.reset();
    this.participantForm.markAsUntouched(); // Réinitialisation des états de validation
  }
}
