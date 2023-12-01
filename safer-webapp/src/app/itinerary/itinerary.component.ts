import { Component, NgZone } from '@angular/core';
import { LatLngTuple, geoJSON, latLng, polyline, tileLayer } from 'leaflet';
import { ItineraryService } from 'src/services/itinerary.service';
import { ProfilService } from 'src/services/profil.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css'],
})
export class ItineraryComponent {
  options: any;
  layers: any[] = [];
  fromAddress = '';
  toAddress = '';
  loading = false;
  riskScore: any;
  age: number = 0;
  sexe: number = 0;
  trajet: number = 0;
  catv: number = 1;

  sexeOptions: any[] = [];
  trajetOptions: any[] = [];
  catvOptions: any[] = [];
  globalPredictionBrut: any;
  globalPrediction: any;

  hoveredDepartmentRisk: number | null = null;

  constructor(
    private itineraryService: ItineraryService,
    private zone: NgZone,
    private profilService: ProfilService
  ) {}

  ngOnInit() {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors',
        }),
      ],
      zoom: 13,
      center: latLng(48.856614, 2.3522219),
    };

    this.profilService.getSexeOptions().subscribe((options) => {
      this.sexeOptions = options;
      if (options.length > 0) this.sexe = options[0];
    });

    this.profilService.getTrajetOptions().subscribe((options) => {
      this.trajetOptions = options;
      if (options.length > 0) this.trajet = options[0];
    });

    this.profilService.getCatvOptions().subscribe((options) => {
      this.catvOptions = options;
      if (options.length > 0) this.catv = options[0];
    });
  }

  getSexeDisplayValue(option: number): string {
    switch (option) {
      case 1:
        return 'Homme';
      case 2:
        return 'Femme';
      default:
        return 'Homme';
    }
  }

  getCatvDisplayValue(option: number): string {
    switch (option) {
      case 1:
        return '2/3 roues motorisée';
      case 2:
        return 'Véhicule non motorisé';
      case 3:
        return 'Poid lourd';
      case 4:
        return 'Petit véhicule pouvant être utilisé sur la chaussée';
      case 5:
        return 'Véhicule / Véhicule utilitaire';
      case 6:
        return 'Transport en commun';
      default:
        return '2/3 roues motorisée';
    }
  }

  getTrajetDisplayValue(option: number): string {
    switch (option) {
      case 1:
        return 'Domicile – travail';
      case 2:
        return 'Domicile – école';
      case 3:
        return 'Courses – achats';
      case 4:
        return 'Utilisation professionnelle';
      case 5:
        return 'Promenade – loisirs';
      case 9:
        return 'Autre';
      default:
        return 'Autre';
    }
  }

  getGravDisplayValue(option: number): string {
    switch (option) {
      case 1:
        return 'Indemne';
      case 2:
        return 'Tué';
      case 3:
        return 'Blessé hospitalisé';
      case 4:
        return 'Blessé léger';
      default:
        return 'Indemne';
    }
  }

  getRouteFromAddresses() {
    if (!this.fromAddress || !this.toAddress) return;

    this.loading = true;

    console.log(this.sexe);
    this.itineraryService
      .getRouteAndRisk(
        this.fromAddress,
        this.toAddress,
        this.sexe,
        this.age,
        this.trajet,
        this.catv
      )
      .subscribe(
        (data) => {
          this.layers = this.layers.filter(
            (layer) =>
              !layer.options.className || layer.options.className !== 'route'
          );

          const coordinates = data.route.features[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple
          );
          const routePolyline = polyline(coordinates, { className: 'route' });
          this.layers.push(routePolyline);

          const riskData = JSON.parse(data.risk);
          console.log(riskData);
          this.globalPrediction = this.getGravDisplayValue(
            JSON.parse(data.prediction)
          );

          this.globalPredictionBrut = JSON.parse(data.prediction);

          riskData.forEach((departmentRisk: any) => {
            const departmentCode = departmentRisk.department;
            console.log('departmentCode', departmentCode);
            const riskScore = departmentRisk.risk_score;
            console.log('riskScore', riskScore);
            this.itineraryService
              .getDepartmentData(departmentCode.toString())
              .subscribe((departmentData) => {
                let color;
                if (riskScore < 30) {
                  color = 'green';
                } else if (riskScore < 50) {
                  color = 'yellow';
                } else {
                  color = 'red';
                }

                const departmentLayer = geoJSON(departmentData, {
                  style: { color: color },
                  onEachFeature: (feature, layer) => {
                    layer.on({
                      mouseover: () => {
                        this.zone.run(() => {
                          this.hoveredDepartmentRisk = riskScore;
                        });
                      },
                      mouseout: () => {
                        this.zone.run(() => {
                          this.hoveredDepartmentRisk = null;
                        });
                      },
                    });
                  },
                });
                this.layers.push(departmentLayer);
              });
          });

          this.loading = false;
        },
        (error) => {
          console.error(
            "Erreur lors de la récupération de l'itinéraire et du score de risque :",
            error
          );
          this.loading = false;
        }
      );
  }
}
