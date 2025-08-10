import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Userstorage } from '../../../auth/service/storage/userstorage';

const BASIC_URL = "http://localhost:8080/api/tech/";


@Injectable({
  providedIn: 'root'
})
export class Techservice {

  constructor(private http: HttpClient){}


  
   getDemandes(technicienId: number): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL + "demandes/" + technicienId, {
    headers: this.createAuthorizationHeader()
  });
}


createIntervention(demandeId: number, data: any): Observable<any> {
    return this.http.post(BASIC_URL + "createIntervention/" +demandeId, data, {
       headers: this.createAuthorizationHeader()
    });
  }


  getInterventionsByTechnicien(technicienId: number): Observable<any[]> {
    return this.http.get<any[]>(BASIC_URL+ 'getInterventionBytechnicien/' +technicienId, {
       headers: this.createAuthorizationHeader()
    });
  }


  
   createAuthorizationHeader(): HttpHeaders {
  return new HttpHeaders().set(
    'Authorization',
    'Bearer ' + Userstorage.getToken()
  );
}
  
}
