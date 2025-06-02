import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntrepriseService } from '../../../../services/Admin-Service/entreprise.service';
import { MatToolbar } from "@angular/material/toolbar";  // Adjust path if needed

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatToolbar
  ],
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {
  displayedColumns = ['id', 'name', 'email', 'status', 'actions'];
  entreprises: any[] = [];
  isLoading = false;

  constructor(
    private entrepriseService: EntrepriseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEntreprises();
  }

  loadEntreprises() {
    this.isLoading = true;
    this.entrepriseService.getAll().subscribe({
      next: (data) => {
        this.entreprises = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading entreprises', err);
        this.isLoading = false;
      }
    });
  }

  validate(id: number) {
    this.isLoading = true;
    this.entrepriseService.validate(id).subscribe({
      next: () => this.loadEntreprises(),
      error: (err) => {
        console.error('Error validating entreprise', err);
        this.isLoading = false;
      }
    });
  }

  refuse(id: number) {
    this.isLoading = true;
    this.entrepriseService.refuse(id).subscribe({
      next: () => this.loadEntreprises(),
      error: (err) => {
        console.error('Error refusing entreprise', err);
        this.isLoading = false;
      }
    });
  }



  refreshList() {
    this.loadEntreprises();
  }

  // Method to navigate back to the dashboard
  goToDashboard() {
    this.router.navigate(['student/dashboard']);
  }

  // Empty method definitions to avoid errors
  goToEntreprise() {
    this.router.navigate(['student/JobMarket']);
  }

  goToEvents() {
    this.router.navigate(['student/events']);
  }

  goToOffrePFE() {
    this.router.navigate(['student/offres']);
  }

  goToEncadrants() {
    this.router.navigate(['admin/encadrant']);
  }

  goToMainDashboard(){
    this.router.navigate(['dashboard']);
  }


}
