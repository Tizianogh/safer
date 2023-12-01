import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamMeteoComponent } from './graph-cam-meteo.component';

describe('GraphCamMeteoComponent', () => {
  let component: GraphCamMeteoComponent;
  let fixture: ComponentFixture<GraphCamMeteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamMeteoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamMeteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
