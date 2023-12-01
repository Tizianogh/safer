import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3-selection';

import { CrashService } from 'src/services/crash.service';
import { SharedService } from 'src/services/shared.service';

@Component({
  selector: 'app-graph-cam',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph-cam.component.html',
  styleUrls: ['./graph-cam.component.css'],
})
export class GraphCamComponent implements OnInit {
  title = "Histogramme répartition accidents par rapport à l'âge";

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private chartWidth: number = 400;
  private chartHeight: number = 400;
  private width: number;
  private height: number;

  private x: any;
  private y: any;
  private svg: any;

  constructor(
    private crashService: CrashService,
    private sharedService: SharedService
  ) {
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.crashService
      .getAccidentsByUniqueValues('an_nais')
      .subscribe((data) => {
        const ageGroupTotals: { [key: string]: number } = {};
        for (const [year, count] of Object.entries(data)) {
          const ageGroup = this.sharedService.yearOfBirthToAgeGroup(+year);
          if (!(ageGroup in ageGroupTotals)) {
            ageGroupTotals[ageGroup] = 0;
          }
          ageGroupTotals[ageGroup] += +(count as number);
        }

        const dataArray = Object.entries(ageGroupTotals).map(
          ([ageGroup, count]) => ({
            ageGroup,
            count: +(count as number),
          })
        );

        this.initSvg();
        this.initAxis(dataArray);
        this.drawAxis();
        this.drawBars(dataArray);
      });
  }
  private initSvg() {
    this.svg = d3
      .select('svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.svg.append('g').attr('class', 'bars');
    this.svg.append('g').attr('class', 'labels');
  }

  private initAxis(data: any[]) {
    this.x = scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = scaleLinear().rangeRound([this.height, 0]);

    this.x.domain(data.map((d) => d.ageGroup));
    this.y.domain([0, max(data, (d: any) => d.count)]);
  }

  private drawAxis() {
    this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(axisBottom(this.x))
      .append('text')
      .attr('class', 'axis-title')
      .attr('x', this.width / 2)
      .attr('y', this.margin.bottom + -4)
      .style('text-anchor', 'middle')
      .text('Année');

    const yAxis = this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(axisLeft(this.y));

    yAxis
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('x', -this.height / 2)
      .attr('y', -this.margin.left + -4)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text("Nombre d'accidents");
  }

  private drawBars(data: any[]) {
    this.svg
      .select('.bars')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => this.x(d.ageGroup))
      .attr('y', (d: any) => this.y(d.count))
      .attr('width', this.x.bandwidth())
      .attr('height', (d: any) => this.height - this.y(d.count))
      .style('fill', (d: any) => this.getColorForAgeGroup(d.ageGroup));

    this.svg
      .select('.labels')
      .selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: any) => this.x(d.ageGroup) + this.x.bandwidth() / 2)
      .attr('y', (d: any) => this.y(d.count) - 5) // Ajustez la position en Y pour décaler le texte vers le haut
      .attr('text-anchor', 'middle') // Centre le texte horizontalement
      .text((d: any) => this.getPercentage(d.count, data))
      .style('fill', 'black');
  }

  private getPercentage(value: number, data: any[]): string {
    const totalCount = data.reduce((acc, cur) => acc + cur.count, 0);
    return ((value / totalCount) * 100).toFixed(1) + '%';
  }

  private getColorForAgeGroup(ageGroup: string): string {
    const index = this.sharedService.ageGroupOrder.indexOf(ageGroup);
    return this.sharedService.ageGroupColors[index];
  }
}
