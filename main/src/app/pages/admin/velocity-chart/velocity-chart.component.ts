import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; // Import direct pour standalone
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js'; // 'Chart' et 'registerables' pour Chart.js 3+

// Enregistrez tous les éléments nécessaires de Chart.js
// C'est important pour que les graphiques s'affichent correctement.
// Cette ligne est la bonne et doit être présente une seule fois.
Chart.register(...registerables);

// LIGNE INCORRECTE ET REDONDANTE SUPPRIMÉE :
// registerables.forEach(registerable => ChartConfiguration.register(registerable));

@Component({
  selector: 'app-velocity-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], // Importez BaseChartDirective ici
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="barChartData"
        [options]="barChartOptions"
        [type]="barChartType">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative; // Important for responsive charts
      height: 400px;     // Fixed height for the container, chart will fill it
      width: 100%;
      max-width: 800px; /* Adaptez selon vos besoins */
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  `]
})
export class VelocityChartComponent implements OnInit, OnChanges {
  @Input() sprintsData: any[] = []; // Ex: [{ sprintName: 'S1', committedPoints: 20, completedPoints: 18 }, ...]

 public barChartData!: ChartData<ChartType>; // Allow any chart type in the data

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Permet au graphique de s'adapter à la hauteur du conteneur
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Diagramme de Vélocité'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sprint'
        },
        grid: {
          display: false // Masque les lignes de grille verticales
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Points de Story (SP)'
        },
        ticks: {
          stepSize: 5 // Ajustez l'incrément des ticks de l'axe Y
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)' // Couleur des lignes de grille horizontales
        }
      }
    }
  };
  public barChartType: ChartType = 'bar'; // Type de graphique à barres

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Mettre à jour le graphique si les données d'entrée changent
    if (changes['sprintsData'] && !changes['sprintsData'].firstChange) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.sprintsData || this.sprintsData.length === 0) {
      // Initialise des données vides si aucun sprint n'est fourni
      this.barChartData = { labels: [], datasets: [] };
      return;
    }

    const labels = this.sprintsData.map(s => s.sprintName);
    const completedData = this.sprintsData.map(s => s.completedPoints);
    const committedData = this.sprintsData.map(s => s.committedPoints);

    // Calcul de la vélocité moyenne pour la ligne de tendance
    const totalCompleted = completedData.reduce((sum, current) => sum + current, 0);
    const averageVelocity = this.sprintsData.length > 0 ? totalCompleted / this.sprintsData.length : 0;
    const averageLineData = new Array(this.sprintsData.length).fill(averageVelocity);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          data: committedData,
          label: 'Points Engagés',
          backgroundColor: 'rgba(75, 192, 192, 0.7)', // Couleur pour les points engagés (vert-bleu)
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75, 192, 192, 0.9)'
        },
        {
          data: completedData,
          label: 'Points Terminés',
          backgroundColor: 'rgba(153, 102, 255, 0.7)', // Couleur pour les points terminés (violet)
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(153, 102, 255, 0.9)'
        },
        {
          data: averageLineData,
          label: 'Vélocité Moyenne',
          borderColor: 'rgba(255, 99, 132, 1)', // Couleur de la ligne de tendance (rouge)
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fond léger pour la ligne
          fill: false, // Ne pas remplir sous la ligne
          type: 'line', // Rendre comme une ligne sur un graphique à barres
          pointRadius: 3, // Rayon des points sur la ligne
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          borderDash: [5, 5] // Ligne pointillée
        }
      ]
    };
  }
}