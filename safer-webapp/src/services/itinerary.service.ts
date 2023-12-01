import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  private departmentData: FeatureCollection | undefined;

  constructor(private http: HttpClient) {
    this.loadDepartmentData();
  }

  getRouteAndRisk(
    fromAddress: string,
    toAddress: string,
    sexe: number,
    age: number,
    trajet: number,
    catv: number
  ): Observable<any> {
    const url =
      `${environment.apiURL}/risk/calculate-risk` +
      `?start_address=${encodeURIComponent(fromAddress)}` +
      `&end_address=${encodeURIComponent(toAddress)}` +
      `&sexe=${sexe}` +
      `&age=${age}` +
      `&trajet=${trajet}` +
      `&catv=${catv}`;
    return this.http.get<any>(url);
  }

  private loadDepartmentData() {
    this.http
      .get<GeoJsonObject>('/assets/DEPARTMENTS.json')
      .subscribe((json) => {
        this.departmentData = json as FeatureCollection;
      });
  }

  getDepartmentData(departmentCode: string): Observable<any> {
    if (!this.departmentData) {
      return of(null);
    }
    const departmentFeature = this.departmentData.features.find(
      (feature: Feature) =>
        feature.properties && feature.properties['code'] === departmentCode
    );

    return of(departmentFeature);
  }
}
