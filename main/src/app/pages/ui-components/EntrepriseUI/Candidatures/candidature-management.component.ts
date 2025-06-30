import { Component, OnInit } from '@angular/core';
import { CandidatureService, Candidature } from 'src/app/services/Entreprise.Service/candidature.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms'; // Required for ngModel

@Component({
  selector: 'app-candidature-management',
  templateUrl: './candidature-management.component.html',
  standalone: true,
  imports: [DatePipe, NgIf, NgForOf, MatButton, FormsModule],
  styleUrls: ['./candidature-management.component.css']
})
export class CandidatureManagementComponent implements OnInit {
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];

  // Filter properties
  offerTitles: string[] = [];
  selectedTitle: string = 'ALL';

  // Organize candidatures by offerId
  candidaturesByOffer: { [offreId: number]: Candidature[] } = {};

  // Counts per offer
  candidatureCounts: { [offreId: number]: number } = {};
  acceptedCounts: { [offreId: number]: number } = {};

  entrepriseId = 1; // hardcoded entreprise id

  constructor(private candidatureService: CandidatureService, private router: Router) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.candidatureService.getCandidaturesByEntreprise(this.entrepriseId).subscribe({
      next: (data) => {
        this.candidatures = data;
        this.filteredCandidatures = data;
        this.offerTitles = Array.from(new Set(data.map(c => c.offre.titre))); // Get unique titles
        this.groupCandidaturesByOffer();
        this.loadCountsForOffers();
      },
      error: (err) => {
        console.error('Failed to load candidatures', err);
      }
    });
  }

  onFilterChange(): void {
    if (this.selectedTitle === 'ALL') {
      this.filteredCandidatures = this.candidatures;
    } else {
      this.filteredCandidatures = this.candidatures.filter(c => c.offre.titre === this.selectedTitle);
    }
  }

  private groupCandidaturesByOffer(): void {
    this.candidaturesByOffer = {};
    this.candidatures.forEach(c => {
      const offerId = c.offre.id;
      if (!this.candidaturesByOffer[offerId]) {
        this.candidaturesByOffer[offerId] = [];
      }
      this.candidaturesByOffer[offerId].push(c);
    });
  }

  private loadCountsForOffers(): void {
    Object.keys(this.candidaturesByOffer).forEach(offerIdStr => {
      const offerId = Number(offerIdStr);

      this.candidatureService.getCandidatureCountByOffre(offerId).subscribe({
        next: count => this.candidatureCounts[offerId] = count,
        error: err => console.error(`Failed to load total count for offer ${offerId}`, err)
      });

      this.candidatureService.getAcceptedCandidatureCountByOffre(offerId).subscribe({
        next: count => this.acceptedCounts[offerId] = count,
        error: err => console.error(`Failed to load accepted count for offer ${offerId}`, err)
      });
    });
  }

  updateStatus(candidatureId: number, newStatus: string): void {
    this.candidatureService.updateCandidatureStatus(candidatureId, newStatus).subscribe({
      next: () => this.loadCandidatures(),
      error: err => console.error('Failed to update status', err)
    });
  }

  goToDashboard(): void {
    this.router.navigate(['entreprise/dashboard']);
  }
}
