import { Component, OnInit } from '@angular/core';
import { arc, pie, scaleOrdinal, select } from 'd3';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { CrashService } from 'src/services/crash.service';

@Component({
  selector: 'app-graph-cam-luminosite',
  templateUrl: './graph-cam-luminosite.component.html',
  styleUrls: ['./graph-cam-luminosite.component.css'],
})
export class GraphCamLuminositeComponent implements OnInit {
  private pieChartData: any[] = [];

  constructor(private crashService: CrashService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.crashService.getAccidentsByUniqueValues('lum').subscribe((data) => {
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

    const width = 500;
    const height = 500;
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

    const lumDescriptions: { [key: string]: string } = {
      '-1': 'Non renseigné',
      '1': 'Plein jour',
      '2': 'Crépuscule ou aube',
      '3': 'Nuit sans éclairage public',
      '4': 'Nuit avec éclairage public non allumé',
      '5': 'Nuit avec éclairage public allumé',
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
        const description = lumDescriptions[d.data.key];

        const percentage = ((d.data.value / totalCases) * 100).toFixed(2);

        alert(
          `Category: ${d.data.key}\nDescription: ${description}\nNombre de cas : ${d.data.value}\nPourcentage : ${percentage}%`
        );
      });

    svg
      .selectAll('text')
      .data(pieGenerator(this.pieChartData))
      .enter()
      .append('text')
      .attr('transform', (d: any) => {
        const centroid = arcGenerator.centroid(d);
        centroid[0] *= 1.8;
        centroid[1] *= 1.8;
        return `translate(${centroid})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text((d: any) => d.data.key);
  }
}
