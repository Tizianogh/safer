import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CrashService {
  constructor(private http: HttpClient) {}

  getAllAccidents(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/accidents`);
  }

  fetchDepartementData(department: number): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/accidents/count/year-range/2017/2021/department/${department}`
    );
  }

  fetchCountAccidents(): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/accidents/count/year-range/2017/2021`
    );
  }

  getAccidentsByUniqueValues(criteria: string): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/accidents/count/unique-values/${criteria}`
    );
  }

  getAccidentsByUniqueValuesAndCondition(
    criteria: string,
    field: string,
    value: number
  ): Observable<any> {
    return this.http.get(
      `${environment.apiURL}/accidents/count/unique-values/${criteria}/${field}/${value}`
    );
  }

  getAccidentCountByDepartment(code: number): Observable<number> {
    return this.http.get<number>(
      `${environment.apiURL}/accidents/count/department/${code}`
    );
  }

  getSpecificFieldsForAccidents(criteria1: string, criteria2: string) {
    return this.http.get(
      `${environment.apiURL}/accidents/specific-fields/${criteria1}/${criteria2}`
    );
  }
}
