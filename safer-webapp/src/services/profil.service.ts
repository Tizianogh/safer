import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  constructor(private http: HttpClient) {}

  getSexeOptions(): Observable<any[]> {
    const url = `${environment.apiURL}/profil/unique-values/sexe`;
    return this.http.get<any[]>(url);
  }

  getTrajetOptions(): Observable<any[]> {
    const url = `${environment.apiURL}/profil/unique-values/trajet`;
    return this.http.get<any[]>(url);
  }

  getCatvOptions(): Observable<any[]> {
    const url = `${environment.apiURL}/profil/unique-values/catv`;
    return this.http.get<any[]>(url);
  }
}
