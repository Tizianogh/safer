import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { SharedService } from 'src/services/shared.service';

const inseeData = [
  {
    ageGroup: '<15',
    males: 5750207,
    females: 6025619,
    total: 11775826,
  },
  { ageGroup: '15-19', males: 2062755, females: 2181207, total: 4243962 },
  { ageGroup: '20-24', males: 1944044, females: 2030202, total: 3974246 },
  { ageGroup: '25-29', males: 1867343, females: 1851224, total: 3718567 },
  { ageGroup: '30-34', males: 2058778, females: 1982491, total: 4041269 },
  { ageGroup: '35-39', males: 2154822, females: 2025139, total: 4179961 },
  { ageGroup: '40-44', males: 2197666, females: 2097058, total: 4294724 },
  { ageGroup: '45-49', males: 2133300, females: 2077464, total: 4210764 },
  { ageGroup: '50-54', males: 2283986, females: 2216586, total: 4500572 },
  { ageGroup: '55-59', males: 2279154, females: 2161119, total: 4440273 },
  { ageGroup: '60-64', males: 2187449, females: 2011149, total: 4198598 },
  { ageGroup: '65-69', males: 2080110, females: 1828697, total: 3908807 },
  { ageGroup: '70-74', males: 2002141, females: 1703117, total: 3705258 },
  {
    ageGroup: '>75',
    males: 4120459,
    females: 2729305,
    total: 6849764,
  },
];

@Component({
  selector: 'app-graph-cam-insee',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph-cam-insee.component.html',
  styleUrls: ['./graph-cam-insee.component.css'],
})
export class GraphCamInseeComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private chartWidth: number = 500;
  private chartHeight: number = 500;
  private width = 500;
  private height = 500;
  private color: any;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private totalPopulation = 0;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.createSvg();
    this.color = d3.scaleOrdinal().range(this.sharedService.ageGroupColors);
    this.totalPopulation = inseeData.reduce((acc, curr) => acc + curr.total, 0);
    this.drawPie(inseeData, 'Insee Data', 0);
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g');
  }

  private getColorForAgeGroup(ageGroup: string): string {
    const index = this.sharedService.ageGroupOrder.indexOf(ageGroup);
    return this.sharedService.ageGroupColors[index];
  }

  private drawPie(data: any[], title: string, xOffset: number): void {
    const pie = d3.pie<any>().value((d: any) => Number(d.total));
    const arc = d3.arc().outerRadius(this.radius).innerRadius(0);
    const g = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.width / 2 + xOffset}, ${
          this.height / 2 + this.margin
        })`
      );

    const ageGroupLabel = d3
      .arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

    const arcs = g
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.getColorForAgeGroup(d.data.ageGroup))
      .on('click', (e: MouseEvent, d: any) => {
        if (d?.data) {
          alert(
            `Age group: ${d.data.ageGroup}\nMales: ${d.data.males}\nFemales: ${d.data.females}\nTotal: ${d.data.total}`
          );
        } else {
          console.log('d or d.data is undefined', d);
        }
      });

    arcs
      .append('text')
      .attr('transform', (d: any) => `translate(${ageGroupLabel.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text((d: any) => {
        const percentage = (
          (d.data.total / this.totalPopulation) *
          100
        ).toFixed(1);
        return `${d.data.ageGroup} (${percentage}%)`;
      })
      .style('font-size', '12px')
      .style('fill', 'white');

    g.append('text')
      .attr('x', 0)
      .attr('y', -this.height / 2 + this.margin)
      .attr('text-anchor', 'middle')
      .text(title)
      .style('font-size', '18px');
  }
}
