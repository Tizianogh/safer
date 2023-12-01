import { Component } from '@angular/core';
import { arc, pie, scaleOrdinal, select } from 'd3';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { CrashService } from 'src/services/crash.service';

@Component({
  selector: 'app-graph-cam-grav',
  templateUrl: './graph-cam-grav.component.html',
  styleUrls: ['./graph-cam-grav.component.css'],
})
export class GraphCamGravComponent {
  private pieChartData: any[] = [];

  constructor(private crashService: CrashService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.crashService.getAccidentsByUniqueValues('grav').subscribe((data) => {
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

    const weatherDescriptions: { [key: string]: string } = {
      '1': 'Indemme',
      '2': 'Tué',
      '3': 'Blessé / Hospitalisé',
      '4': 'Blessé léger',
    };

    const totalCases = this.pieChartData.reduce(
      (total, d) => total + d.value,
      0
    );

    const arcs = svg
      .selectAll('path')
      .data(pieGenerator(this.pieChartData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', <any>arcGenerator)
      .attr('fill', (d: any, i: number) => color(String(i)))
      .on('click', (event: MouseEvent, d: any) => {
        const percentage = ((d.data.value / totalCases) * 100).toFixed(1);
        const description = weatherDescriptions[d.data.key];
        alert(
          `Category: ${d.data.key}\nDescription: ${description}\nPercentage: ${percentage}%`
        );
      });

    arcs
      .append('text')
      .attr('transform', (d: any) => {
        const centroid = arcGenerator.centroid(d);
        const x = centroid[0];
        const y = centroid[1];
        const h = Math.sqrt(x * x + y * y);
        return `translate(${(x / h) * radius * 0.9},${(y / h) * radius * 0.9})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text((d: any) => {
        const key = parseInt(d.data.key).toString();
        return `${key}`;
      });
  }
}
