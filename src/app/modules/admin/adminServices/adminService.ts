import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Userstorage } from '../../../auth/service/storage/userstorage';

const BASIC_URL = "http://localhost:8080/api/admin/";

@Injectable({
  providedIn: 'root'
})
export class DemandesServiceAdmin {


  constructor(private http: HttpClient) { }


    



 getInterventions(): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+ "getAllInterventions" , {
    headers: this.createAuthorizationHeader()
  });
}

 getInstruments(): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+ "getAllInstruments" , {
    headers: this.createAuthorizationHeader()
  });
}

 getTechniciens(): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+ "getTechniciens" , {
    headers: this.createAuthorizationHeader()
  });
}




 getClients(): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+ "getClients" , {
    headers: this.createAuthorizationHeader()
  });
}



//Demandes
 getDemandes(): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+ "getDemandes" , {
    headers: this.createAuthorizationHeader()
  });
}


updateStatutDemande(id: number, statut: string): Observable<string> {
  const url = `${BASIC_URL}updateStatutDemande/${id}?statut=${statut}`;
  const headers = this.createAuthorizationHeader(); // retourne HttpHeaders

  return this.http.put(url, null, {
    headers: headers,
    responseType: 'text'
  });
}



affecterDemande(demandeId: number, technicienId: number): Observable<string> {
  const url = `${BASIC_URL}${demandeId}/affecter/${technicienId}`;
  const headers = this.createAuthorizationHeader();

  return this.http.put(url, null, {
    headers: headers,
    responseType: 'text' as 'text' // ✅ très important
  });
}


//Etalons
addEtalon(etalon: any): Observable<any> {
  const formData = new FormData();

  formData.append('nom', etalon.nom);
  formData.append('reference', etalon.reference);
  formData.append('etat', etalon.etat);

  if (etalon.image) {
    if (this.isDataURL(etalon.image)) {
      const blob = this.dataURLtoBlob(etalon.image);
      formData.append('image', blob, 'etalon-image.jpg');
    } else if (etalon.image instanceof File) {
      formData.append('image', etalon.image, etalon.image.name);
    } else if (typeof etalon.image === 'string') {
      // image en base64 (sans data URL)
      formData.append('image', this.cleanBase64(etalon.image));
    }
    // sinon on ignore ou gérer un cas particulier
  }

  return this.http.post(BASIC_URL + "addEtalon/", formData, {
    headers: this.createAuthorizationHeader()
  });
}

private isDataURL(str: any): boolean {
  return typeof str === 'string' && str.startsWith('data:image');
}





updateEtalon(idEtalon: number, etalon: any): Observable<any> {
  const formData = new FormData();
  
  formData.append('nom', etalon.nom);
  formData.append('reference', etalon.reference);
  formData.append('etat', etalon.etat);
  
  if (etalon.image) {
    if (this.isDataURL(etalon.image)) {
      const blob = this.dataURLtoBlob(etalon.image);
      formData.append('image', blob, 'etalon-image.jpg');
    } else if (etalon.image instanceof File) {
      formData.append('image', etalon.image, etalon.image.name);
    } else {
      formData.append('image', this.cleanBase64(etalon.image));
    }
  }

  return this.http.put(
    `${BASIC_URL}updateEtalon/${idEtalon}`,
    formData,
    { headers: this.createAuthorizationHeader() }
  );
}


private cleanBase64(base64: string): string {
  return base64.replace(/^data:image\/\w+;base64,/, '');
}

private dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}





deleteEtalon(id : number) :Observable<any> {
  return this.http.delete(BASIC_URL+ "deleteEtalon/" +id , {
    headers: this.createAuthorizationHeader()
  });
}


 getAllEtalons(): Observable<any[]> {
  return this.http.get<any[]>(BASIC_URL+ "getAllEtalons" , {
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

//Autorisation
   createAuthorizationHeader(): HttpHeaders {
  return new HttpHeaders().set(
    'Authorization',
    'Bearer ' + Userstorage.getToken()
  );
}






  
}
