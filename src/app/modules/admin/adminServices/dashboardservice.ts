import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Userstorage } from '../../../auth/service/storage/userstorage';
// @ts-ignore
import { EventSourcePolyfill } from 'event-source-polyfill';
import { DemandeResponseDto } from '../../demandes-response/demandes-response-module';
import { appConfig } from '../../../app.config';
import { appSettings } from '../../../../environments/app-settings';



const BASIC_URL = appSettings.apiUrl + '/admin/';  // <-- utilise apiUrl dynamique


export interface DashboardStats {
      totalDemandes:  number,
    demandesEnAttente: number,
    totalInterventions: number,
    totalClients: number,
    demandeAcceptees: number;
}

@Injectable({
  providedIn: 'root'
})
export class Dashboardservice {
  

private eventSource?: EventSourcePolyfill;

  constructor(private ngZone: NgZone, private http: HttpClient) {}

  // Crée les headers Authorization
  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + Userstorage.getToken());
  }

  // Récupérer les stats initiales (GET avec header)
  getInitialStats(): Observable<DashboardStats> {
    const headers = {
      'Authorization': 'Bearer ' + Userstorage.getToken()
    };

    return new Observable(observer => {
      fetch(BASIC_URL + "stats", { headers })
        .then(response => {
          if (!response.ok) throw new Error('Erreur HTTP ' + response.status);
          return response.json();
        })
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }

  // Stream SSE avec header Authorization via event-source-polyfill
  getStatsStream(): Observable<DashboardStats> {
    return new Observable(observer => {
      this.eventSource = new EventSourcePolyfill(BASIC_URL + "stream", {
        headers: {
          'Authorization': 'Bearer ' + Userstorage.getToken()
        }
      });

      this.eventSource.onmessage = (event: { data: string; }) => {
        this.ngZone.run(() => {
          const data: DashboardStats = JSON.parse(event.data);
          observer.next(data);
        });
      };

      this.eventSource.onerror = (error: any) => {
        this.ngZone.run(() => {
          observer.error(error);
        });
        this.eventSource?.close();
      };

      // Fermeture propre du stream à la désinscription
      return () => {
        this.eventSource?.close();
      };
    });
  }


  getLastDemandes(limit: number = 3): Observable<DemandeResponseDto[]> {
  return this.http.get<DemandeResponseDto[]>(`${BASIC_URL}last-demandes?limit=${limit}`, {
    headers: this.createAuthorizationHeader()
  });
}


}
