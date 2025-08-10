import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) { }
  
  registerC(sigupRequest: any): Observable<any> {

    return this.http.post(`${BASIC_URL}api/auth/signupClient`, sigupRequest);
  }

  registerI(sigupRequest: any): Observable<any> {

     return this.http.post(`${BASIC_URL}api/auth/signupTech`, sigupRequest);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/auth/login`, loginRequest);
  }

}
