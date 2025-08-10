import { Component } from '@angular/core';
import { DemoNgZorroAntdModule } from '../../../../DemoNgZorroAntdModules';
import { CommonModule } from '@angular/common';
// Importer le module ngx-charts
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import { Dashboardservice, DashboardStats } from '../../adminServices/dashboardservice';
import { Subscription } from 'rxjs';
import { DemandeResponseDto } from '../../../demandes-response/demandes-response-module';

@Component({
  selector: 'app-dashboard',
  imports: [DemoNgZorroAntdModule, CommonModule, NgxChartsModule],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})


export class Dashboard {


   stats: DashboardStats = {
    totalDemandes:  0,
    demandesEnAttente: 0,
    totalInterventions: 0,
    totalClients: 0,
    demandeAcceptees: 0
  };


   lastdemandes: DemandeResponseDto[] = [];



   private sseSubscription?: Subscription;

  constructor(private dashboardService: Dashboardservice) {}

  ngOnInit(): void {
    // Charger les stats initiales
    this.dashboardService.getInitialStats().subscribe({
      next: data => this.stats = data,
      error: err => console.error('Erreur lors de la récupération initiale', err)
    });

    // Écouter le flux SSE pour mises à jour en temps réel
    this.sseSubscription = this.dashboardService.getStatsStream().subscribe({
      next: data => this.stats = data,
      error: err => {
        console.error('Erreur SSE', err);
        // ici tu peux gérer la reconnexion si tu veux
      }
    });

    this.dashboardService.getLastDemandes(5).subscribe({
    next: data => this.lastdemandes = data,
    error: err => console.error(err)
  });
  }

  ngOnDestroy(): void {
    this.sseSubscription?.unsubscribe();
  }

  






totalDemandes: number = 120;
  demandesEnAttente: number = 23;
  totalTechniciens: number = 8;
  totalClients: number = 36;


    nonAffecteesCount = 0;
  enRetardCount = 0;
  mostEtalonnees: { instrument: string; count: number }[] = [];
  interventionsParMois: { mois: string; total: number }[] = [];

  dernieresDemandes = [
    {
      id: 101,
      client: 'Société Alpha',
      appareil: 'Balance électronique',
      technicien: 'Ali Ben Salem',
      date: '2025-08-01',
      statut: 'Validée'
    },
    {
      id: 102,
      client: 'Société Beta',
      appareil: 'Manomètre',
      technicien: 'Rania Kacem',
      date: '2025-08-03',
      statut: 'En attente'
    },
    {
      id: 103,
      client: 'Société Gamma',
      appareil: 'Thermomètre',
      technicien: 'Mohamed Ferchichi',
      date: '2025-08-04',
      statut: 'Refusée'
    },
    {
      id: 104,
      client: 'Société Delta',
      appareil: 'Multimètre',
      technicien: 'Imen Ayari',
      date: '2025-08-05',
      statut: 'Validée'
    },
    {
      id: 105,
      client: 'Société Omega',
      appareil: 'Capteur de pression',
      technicien: 'Karim Jlassi',
      date: '2025-08-06',
      statut: 'En cours'
    }
  ];




  colorScheme: Color = {
  name: 'customScheme',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#0a1c42', '#007acc', '#3b8ad9', '#66b3ff', '#99ccff']
};


  interventionsChartData = [
    {
      name: 'Interventions',
      series: [
        { name: 'Janvier', value: 3 },
        { name: 'Février', value: 6 },
        { name: 'Mars', value: 8 },
        { name: 'Avril', value: 5 },
        { name: 'Mai', value: 7 }
      ]
    }
  ];







  loadStats(): void {
  const fakeData = {
    nonAffectees: 5,
    enRetard: 3,
    mostEtalonnees: [
      { instrument: 'Balance', count: 12 },
      { instrument: 'Thermomètre', count: 9 },
      { instrument: 'Multimètre', count: 7 },
    ],
    interventionsParMois: [
      { mois: 'Janvier', total: 3 },
      { mois: 'Février', total: 6 },
      { mois: 'Mars', total: 4 },
      { mois: 'Avril', total: 7 },
      { mois: 'Mai', total: 5 },
    ]
  };

  this.nonAffecteesCount = fakeData.nonAffectees;
  this.enRetardCount = fakeData.enRetard;
  this.mostEtalonnees = fakeData.mostEtalonnees;
  this.interventionsParMois = fakeData.interventionsParMois;
}




  getColor(statut: string): string {
    switch (statut) {
      case 'Validée':
        return 'green';
      case 'En attente':
        return 'orange';
      case 'Refusée':
        return 'red';
      case 'En cours':
        return 'blue';
      default:
        return 'default';
    }
  }

}
