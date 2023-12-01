import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphScatterplotComponent } from './graph-scatterplot.component';

describe('GraphScatterplotComponent', () => {
  let component: GraphScatterplotComponent;
  let fixture: ComponentFixture<GraphScatterplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphScatterplotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphScatterplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
