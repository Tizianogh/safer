import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { GeoJsonObject } from 'geojson';
import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';
import { Subject } from 'rxjs';
import { CrashService } from 'src/services/crash.service';

const STYLE_INITIAL = {
  color: 'rgb(136,134,134)',
  fillOpacity: 0.7,
  weight: 2,
};

const STYLE_HOVER = {
  weight: 5,
  color: 'rgba(82, 92, 79, 1)',
};

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent {
  public selectedTab:
    | 'general'
    | 'brightness'
    | 'meteo'
    | 'sex'
    | 'age'
    | 'catv'
    | 'trajet'
    | 'grav' = 'general';
  tabType:
    | 'general'
    | 'brightness'
    | 'meteo'
    | 'age'
    | 'catv'
    | 'trajet'
    | 'grav' = 'general';

  isLoading: boolean = false;
  public regionName: string;
  public regionCode: number;
  public selectedRegion: number;
  public departmentData: any;
  public departmentData$: Subject<any> = new Subject<any>();

  public accidentCountByDepartment: { [key: number]: number } = {};
  public totalAccidents: number;
  public graphTitle: string = "Nombre total d'accidents";

  data: any;

  private selectedLayer: any;

  title = 'safer-webapp';
  public options: any = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: 6,
    center: latLng(46.303558, 6.0164252),
  };

  public layers: any[];
  constructor(
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private crashService: CrashService,
    private ngZone: NgZone
  ) {
    this.layers = [];
    this.regionName = '';

    this.regionCode = 0;
    this.selectedRegion = 0;

    this.totalAccidents = 0;
  }

  private async fetchAccidentCounts(json: GeoJsonObject): Promise<void> {
    const promises = (json as any).features.map(async (feature: any) => {
      if (feature && feature.properties) {
        const departmentCode = feature.properties.code;
        const count = await this.crashService
          .getAccidentCountByDepartment(departmentCode)
          .toPromise();

        this.accidentCountByDepartment[departmentCode] = count ?? 0;
      }
    });

    await Promise.all(promises);
  }

  async ngOnInit() {
    this.isLoading = true;

    this.http
      .get<GeoJsonObject>('/assets/DEPARTMENTS.json')
      .subscribe(async (json: GeoJsonObject | undefined) => {
        if (json) {
          await this.fetchAccidentCounts(json);
        }
        this.isLoading = false;

        this.layers.push(
          L.geoJSON(json, {
            style: (feature) => {
              if (feature && feature.properties) {
                const departmentCode = feature.properties.code;
                const accidentCount =
                  this.accidentCountByDepartment[departmentCode] || 0;
                const fillColor = this.getColorForAccidentCount(accidentCount);
                return {
                  ...STYLE_INITIAL,
                  fillColor,
                };
              } else {
                return STYLE_INITIAL;
              }
            },
            onEachFeature: (feature, layer) => {
              layer.on('click', (e) => this.highlightFeature(e));
            },
          })
        );
      });
  }

  public changeGraphTitle(tabType: string): void {
    switch (tabType) {
      case 'general':
        this.graphTitle = "Nombre total d'accidents";
        break;
      case 'brightness':
        this.graphTitle = 'Accidents par niveau de luminosité';
        break;
      case 'meteo':
        this.graphTitle = 'Accidents par condition météo';
        break;
      case 'age':
        this.graphTitle = "Accidents par tranche d'âge";
        break;
      case 'sex':
        this.graphTitle = 'Accidents par sexe';
        break;
      default:
        this.graphTitle = '';
    }
  }

  private getColorForAccidentCount(count: number): string {
    if (count <= 1000) {
      return '#9acd32'; // Vert clair
    } else if (count <= 2500) {
      return '#ffd700'; // Jaune
    } else if (count <= 5000) {
      return '#ffa500'; // Orange
    } else {
      return '#ff4500'; // Rouge
    }
  }

  public highlightFeature(e: L.LeafletMouseEvent): void {
    if (this.selectedLayer) {
      this.selectedLayer.setStyle(STYLE_INITIAL);
    }
    this.selectedTab = 'general';

    const layer = e.target;
    layer.setStyle(STYLE_HOVER);
    this.selectedLayer = layer;

    this.ngZone.run(() => {
      this.regionName = layer.feature.properties.nom;
      this.regionCode = layer.feature.properties.code;
      this.totalAccidents =
        this.accidentCountByDepartment[this.regionCode] || 0;
      this.ref.detectChanges();
    });

    this.crashService.fetchDepartementData(this.regionCode).subscribe({
      next: (response) => {
        this.departmentData = response;
        console.log('Department data set:', this.departmentData);
      },
      error: (error) => {
        console.error('Error fetching department data:', error);
      },
    });
  }

  closePopup(): void {
    if (this.selectedLayer) {
      this.selectedLayer.setStyle(STYLE_INITIAL);
    }
    this.ngZone.run(() => {
      this.regionName = '';
      this.regionCode = 0;
      this.ref.detectChanges();
    });
  }

  onContainerClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closePopup();
    }
  }

  onDataReady(): void {
    console.log('Data is ready');
    this.departmentData = { ...this.departmentData };
  }
}
