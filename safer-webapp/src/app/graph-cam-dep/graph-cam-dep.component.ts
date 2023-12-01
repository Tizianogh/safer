import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { CrashService } from 'src/services/crash.service';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-graph-cam-dep',
  templateUrl: './graph-cam-dep.component.html',
  styleUrls: ['./graph-cam-dep.component.css'],
})
export class GraphCamDepComponent implements OnInit {
  public pieChartData: any[] = [];
  @Input() departmentData: any;
  @Input() departmentCode: number = 0;
  @Input() tabType:
    | 'brightness'
    | 'meteo'
    | 'age'
    | 'catv'
    | 'trajet'
    | 'grav' = 'brightness';

  constructor(
    private crashService: CrashService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentCode']) {
      this.fetchData();
    }
  }

  fetchData(): void {
    if (!this.departmentCode) {
      console.warn("Le code de département n'est pas encore disponible.");
      return;
    }

    if (this.tabType === 'age') {
      this.fetchAgeData();
    } else if (this.tabType === 'catv') {
      this.fetchCatvData();
    } else if (this.tabType === 'trajet') {
      this.fetchTrajetData(); // Ajout de cette ligne
    } else if (this.tabType === 'grav') {
      // Ajout de cette condition
      this.fetchGravData(); // Appel à la nouvelle méthode
    } else {
      const type = this.tabType === 'brightness' ? 'lum' : 'atm';

      this.crashService
        .getAccidentsByUniqueValuesAndCondition(
          type,
          'dep',
          this.departmentCode
        )
        .subscribe((data) => {
          console.log('Données reçues:', data);
          this.pieChartData = Object.entries(data).map(([key, value]) => ({
            key,
            value,
          }));
          console.log('Données converties:', this.pieChartData);
          this.createPieChart();
        });
    }
  }

  fetchTrajetData(): void {
    this.crashService
      .getAccidentsByUniqueValuesAndCondition(
        'trajet',
        'dep',
        this.departmentCode
      )
      .subscribe((data) => {
        console.log('Données reçues:', data);
        this.pieChartData = Object.entries(data).map(([key, value]) => ({
          key,
          value,
        }));
        console.log('Données converties:', this.pieChartData);
        this.createPieChart();
      });
  }

  fetchGravData(): void {
    // Nouvelle méthode pour récupérer les données de 'grav'
    this.crashService
      .getAccidentsByUniqueValuesAndCondition(
        'grav',
        'dep',
        this.departmentCode
      )
      .subscribe((data) => {
        console.log('Données reçues:', data);
        this.pieChartData = Object.entries(data).map(([key, value]) => ({
          key,
          value,
        }));
        console.log('Données converties:', this.pieChartData);
        this.createPieChart();
      });
  }

  fetchAgeData(): void {
    this.crashService
      .getAccidentsByUniqueValuesAndCondition(
        'an_nais',
        'dep',
        this.departmentCode
      )
      .subscribe((data) => {
        const ageGroupTotals: { [key: string]: number } = {};

        for (const [year, count] of Object.entries(data)) {
          const ageGroup = this.sharedService.yearOfBirthToAgeGroup(+year);
          if (!(ageGroup in ageGroupTotals)) {
            ageGroupTotals[ageGroup] = 0;
          }
          ageGroupTotals[ageGroup] += +(count as number);
        }

        this.pieChartData = Object.entries(ageGroupTotals).map(
          ([ageGroup, count]) => ({
            key: ageGroup,
            value: +(count as number),
          })
        );

        this.createPieChart();
      });
  }

  fetchCatvData(): void {
    this.crashService
      .getAccidentsByUniqueValuesAndCondition(
        'catv',
        'dep',
        this.departmentCode
      )
      .subscribe((data) => {
        console.log('Données reçues:', data);
        this.pieChartData = Object.entries(data).map(([key, value]) => ({
          key,
          value,
        }));
        console.log('Données converties:', this.pieChartData);
        this.createPieChart();
      });
  }

  createPieChart(): void {
    if (!this.pieChartData) {
      console.warn(
        'Les données du diagramme en camembert ne sont pas encore disponibles.'
      );
      return;
    }

    d3.select('.pie-chart-container').selectAll('svg').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select('.pie-chart-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<any>()
      .value((d: any) => d.value)
      .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const lumDescriptions = {
      '-1': 'Non renseigné',
      '1': 'Plein jour',
      '2': 'Crépuscule ou aube',
      '3': 'Nuit sans éclairage public',
      '4': 'Nuit avec éclairage public non allumé',
      '5': 'Nuit avec éclairage public allumé',
    };

    const atmDescriptions = {
      '-1.0': 'Non renseigné',
      '1': 'Normale',
      '2': 'Pluie légère',
      '3': 'Pluie forte',
      '4': 'Neige - grêle',
      '5': 'Brouillard - fumée',
      '6': 'Vent fort - tempête',
      '7': 'Temps éblouissant',
      '8': 'Temps couvert',
      '9': 'Autre',
    };

    const catvDescriptions = {
      '1': '2/3 roues motorisés',
      '4': 'Petit véhicule pouvant être conduit sur la chaussée',
      '5': 'Véhicule / Véhicule utilitaire',
      '6': 'Transport en commun',
    };

    const trajetDescriptions = {
      '1': 'Domicile - Travail',
      '2': 'Domicile - école',
      '3': 'Course / Achat',
      '4': 'Utilisation professionnelle',
      '5': 'Promenade loisir',
      '9': 'Autres',
    };

    const gravDescriptions = {
      '1': 'Indemme',
      '2': 'Tué',
      '3': 'Blessé / Hospitalisé',
      '4': 'Blessé léger',
    };

    const path = svg
      .selectAll('path')
      .data(pie(this.pieChartData))
      .enter()
      .append('path')
      .attr('d', <any>arc)
      .attr('fill', (d: any, i: number) => color(String(i)))
      .on('click', (event: MouseEvent, d: any) => {
        let description;
        if (this.tabType === 'brightness') {
          description =
            lumDescriptions[d.data.key as keyof typeof lumDescriptions];
        } else if (this.tabType === 'meteo') {
          description =
            atmDescriptions[d.data.key as keyof typeof atmDescriptions];
        } else if (this.tabType === 'catv') {
          description =
            catvDescriptions[d.data.key as keyof typeof catvDescriptions];
        } else if (this.tabType === 'trajet') {
          description =
            trajetDescriptions[d.data.key as keyof typeof trajetDescriptions];
        } else if (this.tabType === 'grav') {
          description =
            gravDescriptions[d.data.key as keyof typeof gravDescriptions];
        }

        const total = this.pieChartData.reduce(
          (acc, cur) => acc + cur.value,
          0
        );
        const percentage = (d.data.value / total) * 100;

        alert(
          `Catégorie: ${d.data.key}\n${
            description ? `Description: ${description}\n` : ''
          }Nombre de cas : ${d.data.value}\nPourcentage : ${percentage.toFixed(
            2
          )}%`
        );
      });

    const labelOffset = -25;

    const labelArc = d3
      .arc()
      .innerRadius(radius + labelOffset)
      .outerRadius(radius + labelOffset);

    svg
      .selectAll('text')
      .data(pie(this.pieChartData))
      .enter()
      .append('text')
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text((d: any) => {
        if (this.tabType === 'meteo' || this.tabType === 'catv') {
          return parseInt(d.data.key, 10).toString();
        } else {
          return d.data.key;
        }
      });
  }
}
