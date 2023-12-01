import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphBarchartDepComponent } from './graph-barchart-dep.component';

describe('GraphBarchartDepComponent', () => {
  let component: GraphBarchartDepComponent;
  let fixture: ComponentFixture<GraphBarchartDepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphBarchartDepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphBarchartDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
