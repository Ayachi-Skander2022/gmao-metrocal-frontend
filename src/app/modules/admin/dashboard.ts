import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  

   getDashboardStats(): Observable<any> {
    const fakeData = {
      totalDemandes: 120,
      demandesEnAttente: 30,
      techniciens: 8,
      clients: 50,
      demandesNonAffectees: 5,
      demandesEnRetard: 7,
      instrumentsFrequents: [
        { nom: 'Thermomètre', total: 25 },
        { nom: 'Balance', total: 18 },
        { nom: 'Manomètre', total: 15 },
        { nom: 'Ph-mètre', total: 10 },
      ],
      interventionsParMois: [
        { mois: 'Janvier', total: 8 },
        { mois: 'Février', total: 12 },
        { mois: 'Mars', total: 15 },
        { mois: 'Avril', total: 10 },
        { mois: 'Mai', total: 14 },
        { mois: 'Juin', total: 18 },
        { mois: 'Juillet', total: 20 },
      ],
      dernieresDemandes: [
        {
          id: 101,
          client: 'Société Alpha',
          appareil: 'Thermomètre',
          technicien: 'Ali Ben Salah',
          date: '2025-07-30',
          statut: 'En attente',
        },
        {
          id: 102,
          client: 'Société Beta',
          appareil: 'Balance',
          technicien: 'Ines Trabelsi',
          date: '2025-07-29',
          statut: 'Validée',
        },
        {
          id: 103,
          client: 'Société Gamma',
          appareil: 'Ph-mètre',
          technicien: 'Khaled Mhiri',
          date: '2025-07-28',
          statut: 'Rejetée',
        }
      ]
    };

    return of(fakeData);
  }
}
