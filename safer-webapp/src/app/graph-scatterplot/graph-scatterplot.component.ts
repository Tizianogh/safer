import { Component } from '@angular/core';
import * as d3 from 'd3';
import { CrashService } from 'src/services/crash.service';

@Component({
  selector: 'app-graph-scatterplot',
  templateUrl: './graph-scatterplot.component.html',
  styleUrls: ['./graph-scatterplot.component.css'],
})
export class GraphScatterplotComponent {
  constructor(private crashService: CrashService) {}

  ngOnInit(): void {
    // Afficher le loader
    d3.select('#scatterplot-loader').style('display', 'block');

    this.crashService
      .getSpecificFieldsForAccidents('an_nais', 'grav')
      .subscribe((data: any) => {
        console.log(data);
        if (typeof data === 'object' && !Array.isArray(data)) {
          data = Object.values(data);
          console.log(data);
        }

        // Cacher le loader
        d3.select('#scatterplot-loader').style('display', 'none');

        this.drawScatterplot(data);
      });
  }
  drawScatterplot(data: any[]): void {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#scatterplot')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.an_nais), d3.max(data, (d) => d.an_nais)])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.grav)])
      .range([height, 0]);

    svg
      .append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Année de naissance');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Gravité');

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.an_nais))
      .attr('cy', (d) => y(d.grav))
      .attr('r', 3)
      .style('fill', '#69b3a2');
  }
}
