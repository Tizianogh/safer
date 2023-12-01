import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph-histo-dep',
  templateUrl: './graph-histo-dep.component.html',
  styleUrls: ['./graph-histo-dep.component.css'],
})
export class GraphHistoDepComponent implements OnChanges {
  @Input() departmentData: any;
  @Input() startYear: number;
  @Input() endYear: number;

  public showErrorMessage: boolean;
  public isLoading: boolean;
  public endYearMin: number;

  constructor() {
    this.endYearMin = 2017;
    this.startYear = 2017;
    this.endYear = 2021;
    this.showErrorMessage = false;
    this.isLoading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentData']) {
      if (this.departmentData) {
        console.log('Department data received:', this.departmentData);
        this.isLoading = true;
        setTimeout(() => {
          this.updateGraph();
          this.isLoading = false;
        }, 2000);
      } else {
        this.isLoading = true;
      }
    } else if (changes['startYear'] || changes['endYear']) {
      this.updateGraph();
    }
  }

  updateGraph(): void {
    if (this.departmentData && !isNaN(this.startYear) && !isNaN(this.endYear)) {
      this.createBoxplot(this.startYear, this.endYear);
    }
  }

  createBoxplot(startYear: number, endYear: number): void {
    if (!this.departmentData) {
      console.warn('Department data is not available yet.');
      return;
    }
    d3.select('.boxplot-container').selectAll('svg').remove();

    const filteredData = Object.entries(this.departmentData)
      .filter(([year]) => {
        const y = parseInt(year);
        return y >= startYear && y <= endYear;
      })
      .map(([year, value]) => ({
        year: parseInt(year),
        value: value as number,
      }));

    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 450 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('.boxplot-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const years = filteredData.map((entry) => String(entry.year));

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(years)
      .paddingInner(1)
      .paddingOuter(0.5);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(...filteredData.map((entry) => entry.value))])
      .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    const boxWidth = 30;

    filteredData.forEach(({ year, value }) => {
      const xPos = x(String(year));

      if (xPos !== undefined && !isNaN(xPos)) {
        svg
          .append('rect')
          .attr('x', xPos)
          .attr('y', y(value))
          .attr('height', height - y(value))
          .attr('width', boxWidth)
          .attr('fill', '#69b3a2');
      }
    });
  }

  onStartYearInput(): void {
    if (this.startYear > this.endYear) {
      alert('La date de début ne peut pas être supérieure à la date de fin.');
      this.startYear = this.endYear; // Rétablir la valeur précédente
    } else {
      this.updateGraph();
    }
  }

  onEndYearInput(): void {
    if (this.endYear < this.startYear) {
      alert('La date de fin ne peut pas être inférieure à la date de début.');
      this.endYear = this.startYear; // Rétablir la valeur précédente
    } else {
      this.updateGraph();
    }
  }

  checkEndYear(): void {
    this.showErrorMessage = this.endYear < this.startYear;
  }

  updateEndYearMin(startYear: number): void {
    this.endYearMin = startYear;
    if (this.endYear < this.startYear) {
      this.endYear = this.startYear;
    }
  }
}
