import { Component, OnInit } from '@angular/core';
import { arc, pie, scaleOrdinal, select } from 'd3';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { CrashService } from 'src/services/crash.service';

@Component({
  selector: 'app-graph-cam-sexe',
  templateUrl: './graph-cam-sexe.component.html',
  styleUrls: ['./graph-cam-sexe.component.css'],
})
export class GraphCamSexeComponent implements OnInit {
  private pieChartData: any[] = [];

  constructor(private crashService: CrashService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.crashService.getAccidentsByUniqueValues('sexe').subscribe((data) => {
      console.log('Received data:', data);
      this.pieChartData = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));
      this.createPieChart();
    });
  }

  createPieChart(): void {
    if (!this.pieChartData) {
      console.warn('Pie chart data is not available yet.');
      return;
    }

    const width = 450;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    const svg = select('.pie-chart-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pieGenerator = pie<any>()
      .value((d: any) => d.value)
      .sort(null);

    const arcGenerator = arc().innerRadius(0).outerRadius(radius);

    const color = scaleOrdinal(schemeCategory10);

    const sexDescriptions: { [key: string]: string } = {
      '-1': 'Non renseigné',
      '1': 'Masculin',
      '2': 'Féminin',
    };

    const totalCases = this.pieChartData.reduce(
      (total, d) => total + d.value,
      0
    );

    svg
      .selectAll('path')
      .data(pieGenerator(this.pieChartData))
      .enter()
      .append('path')
      .attr('d', <any>arcGenerator)
      .attr('fill', (d: any, i: number) => color(String(i)))
      .on('click', (event: MouseEvent, d: any) => {
        const description = sexDescriptions[d.data.key];
        alert(
          `Category: ${d.data.key}\nDescription: ${description}\nNombre de cas : ${d.data.value}`
        );
      });

    svg
      .selectAll('text')
      .data(pieGenerator(this.pieChartData))
      .enter()
      .append('text')
      .attr('transform', (d: any) => {
        const centroid = arcGenerator.centroid(d);
        if (d.data.key === '-1') {
          centroid[0] *= 1.5;
        } else {
          centroid[0] *= 2;
        }
        return `translate(${centroid})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text((d: any) => {
        const percentage = ((d.data.value / totalCases) * 100).toFixed(1);
        return `${d.data.key} (${percentage}%)`;
      });
  }
}
