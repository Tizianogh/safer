import { Component, ViewEncapsulation } from '@angular/core';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3 from 'd3-selection';
import * as d3Shape from 'd3-shape';
import { CrashService } from 'src/services/crash.service';

@Component({
  selector: 'app-graph',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent {
  title = 'Graphique accidents par année';

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  public startYear: number;
  public endYear: number;

  constructor(private crashService: CrashService) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.line = d3Shape.line<[number, number]>();
    this.startYear = 2017;
    this.endYear = 2021;
  }

  ngOnInit() {
    this.fetchDataAndDrawGraph();
  }

  private fetchDataAndDrawGraph(): any[] {
    let processedData: any[] = [];
    this.crashService.fetchCountAccidents().subscribe(
      (data) => {
        processedData = this.processData(data);
        this.initSvg();
        this.initAxis(processedData);
        this.drawAxis(processedData);
        this.drawLine(processedData);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des données du département :',
          error
        );
      }
    );
    return processedData;
  }

  private processData(data: any): any[] {
    const processedData = Object.entries(data)
      .filter(([year]) => {
        const y = parseInt(year);
        return y >= this.startYear && y <= this.endYear;
      })
      .map(([year, nbAccident]) => ({
        Annee: parseInt(year),
        NbAccident: nbAccident,
      }));

    return processedData;
  }

  private initSvg() {
    d3.select('svg').select('g').remove();
    this.svg = d3
      .select('svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  private initAxis(processedData: any[]) {
    const years = Array.from(new Set(processedData.map((d) => d.Annee)));
    this.x = d3Scale.scaleBand().range([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(years);
    this.y.domain([0, d3Array.max(processedData, (d) => d.NbAccident)]);
  }

  private updateXAxis(processedData: any[]) {
    const years = Array.from(new Set(processedData.map((d: any) => d.Annee)));
    this.x.domain(years);

    this.svg.select('.axis--x').call(d3Axis.axisBottom(this.x));
  }

  private drawAxis(processedData: any[]) {
    this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x))
      .append('text')
      .attr('class', 'axis-title')
      .attr('x', this.width / 2)
      .attr('y', this.margin.bottom + -5)
      .style('text-anchor', 'middle')
      .text('Année');

    const maxY = d3Array.max(processedData, (d) => d.NbAccident);
    const tickValues = this.generateTickValues(maxY);

    this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y).tickValues(tickValues))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '1%')
      .style('text-anchor', 'end')
      .text("Nombre d'accidents");
  }

  private generateTickValues(maxY: number): number[] {
    const step = Math.ceil(maxY / 10);
    const tickValues = Array.from({ length: 11 }, (_, i) => i * step);
    return tickValues;
  }

  onStartYearInput(): void {
    if (this.startYear > this.endYear) {
      alert('La date de début ne peut pas être supérieure à la date de fin.');
      this.startYear = this.endYear; // Rétablir la valeur précédente
    } else {
      this.updateGraph(); // Modifiez cette ligne
    }
  }

  onEndYearInput(): void {
    if (this.endYear < this.startYear) {
      alert('La date de fin ne peut pas être inférieure à la date de début.');
      this.endYear = this.startYear; // Rétablir la valeur précédente
    } else {
      this.updateGraph(); // Modifiez cette ligne
    }
  }

  private updateGraph(): void {
    this.initSvg();
    const processedData = this.fetchDataAndDrawGraph();
    this.initAxis(processedData);
    this.drawAxis(processedData);
    this.drawLine(processedData);
  }

  private drawLine(processedData: any[]) {
    this.line = d3Shape
      .line()
      .x((d: any) => this.x(d.Annee))
      .y((d: any) => this.y(d.NbAccident));

    this.svg
      .append('path')
      .datum(processedData)
      .attr('class', 'line')
      .attr('d', this.line);
  }
}
