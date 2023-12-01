import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { CrashService } from 'src/services/crash.service';

@Component({
  selector: 'app-graph-barchart-dep',
  templateUrl: './graph-barchart-dep.component.html',
  styleUrls: ['./graph-barchart-dep.component.css'],
})
export class GraphBarchartDepComponent implements OnChanges {
  @Input() departmentData: any;
  @Input() departmentCode: number = 0;

  public barChartData: any[] = [];

  constructor(private crashService: CrashService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentCode']) {
      this.fetchData();
    }
  }

  fetchData(): void {
    if (!this.departmentCode) {
      console.warn('Department code is not available yet.');
      return;
    }

    this.crashService
      .getAccidentsByUniqueValuesAndCondition(
        'sexe',
        'dep',
        this.departmentCode
      )
      .subscribe((data) => {
        this.barChartData = Object.entries(data).map(([key, value]) => ({
          key,
          value,
        }));
        this.createBarChart();
      });
  }

  createBarChart(): void {
    if (!this.barChartData) {
      console.warn('Bar chart data is not available yet.');
      return;
    }

    d3.select('.bar-chart-container').selectAll('svg').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3
      .select('.bar-chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(this.barChartData.map((d) => d.key));
    y.domain([0, d3.max(this.barChartData, (d) => d.value)]);

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').attr('class', 'y axis').call(d3.axisLeft(y));

    svg
      .selectAll('.bar')
      .data(this.barChartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(d.key) as any)
      .attr('width', x.bandwidth())
      .attr('y', (d: any) => y(d.value))
      .attr('height', (d: any) => height - y(d.value))
      .attr('fill', (d: any) => this.getColor(d.key))
      .on('click', (event: MouseEvent, d: any) => {
        const sexDescription = this.getSexDescription(d.key);

        const total = this.barChartData.reduce(
          (acc, cur) => acc + cur.value,
          0
        );
        const percentage = (d.value / total) * 100;

        alert(
          `Sexe: ${sexDescription}\nNombre d'accidents: ${
            d.value
          }\nPourcentage : ${percentage.toFixed(2)}%`
        );
      });


    svg
      .selectAll('text.bar')
      .data(this.barChartData)
      .enter()
      .append('text')
      .attr('class', 'bar')
      .attr('text-anchor', 'middle')
      .attr('x', (d: any) => (x(d.key) as any) + x.bandwidth() / 2)
      .attr('y', (d: any) => y(d.value) - 5)
      .text((d: any) => d.value);
  }

  getSexDescription(key: string): string {
    switch (key) {
      case '-1':
        return 'Non renseigné';
      case '1':
        return 'Masculin';
      case '2':
        return 'Féminin';
      default:
        return 'Inconnu';
    }
  }
  getColor(key: string): string {
    switch (key) {
      case '-1':
        return '#ccc'; // Couleur pour la catégorie -1
      case '1':
        return 'steelblue'; // Couleur pour la catégorie 1
      case '2':
        return 'salmon'; // Couleur pour la catégorie 2
      default:
        return 'gray'; // Couleur par défaut pour les autres catégories
    }
  }

}
