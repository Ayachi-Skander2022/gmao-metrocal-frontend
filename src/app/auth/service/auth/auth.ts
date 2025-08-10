import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appSettings } from '../../../../environments/app-settings';

const BASIC_URL = appSettings.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) { }
  
  registerC(sigupRequest: any): Observable<any> {

    return this.http.post(`${BASIC_URL}/auth/signupClient`, sigupRequest);
  }

  registerI(sigupRequest: any): Observable<any> {

     return this.http.post(`${BASIC_URL}/auth/signupTech`, sigupRequest);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(`${BASIC_URL}/auth/login`, loginRequest);
  }


  
}
