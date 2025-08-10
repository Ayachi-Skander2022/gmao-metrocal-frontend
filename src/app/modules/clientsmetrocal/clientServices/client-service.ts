import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Userstorage } from '../../../auth/service/storage/userstorage';
import { DemandeResponseDto } from '../../demandes-response/demandes-response-module';

const BASIC_URL = "http://localhost:8080/api/client/";

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  
    constructor(private http: HttpClient) { }


createDemande(demande: any, instrumentId: number): Observable<any> {
  return this.http.post(`${BASIC_URL}demandes/${instrumentId}`, demande, {
    headers: this.createAuthorizationHeader()
  });
}


    

 getDemandesByClientId(): Observable<any[]> {
      const userId = Userstorage.getUserId();
  return this.http.get<any[]>(BASIC_URL+ "getByClient/" +userId, {
    headers: this.createAuthorizationHeader()
  });
}


     addInstrument(instrument: any): Observable<any> {
       
       return this.http.post(BASIC_URL+ "addInstrument", instrument , {
       headers: this.createAuthorizationHeader()
    });  }


    
 getInstrumentsByClientId(): Observable<any[]> {
      const userId = Userstorage.getUserId();
  return this.http.get<any[]>(BASIC_URL+ "getInstrumentsByClient/" +userId, {
    headers: this.createAuthorizationHeader()
  });
}


 getInterventionsByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(BASIC_URL+ 'getInterventionByClient/' +clientId, {
       headers: this.createAuthorizationHeader()
    });
  }


  downloadCertificate(id: number): Observable<Blob> {
  const headers = this.createAuthorizationHeader()

  return this.http.get(`${BASIC_URL}intervention/${id}/certificate`, {
    headers,
    responseType: 'blob'
  });
}





   createAuthorizationHeader(): HttpHeaders {
  return new HttpHeaders().set(
    'Authorization',
    'Bearer ' + Userstorage.getToken()
  );
}

    
}
