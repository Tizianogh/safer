import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamInseeComponent } from './graph-cam-insee.component';

describe('GraphCamInseeComponent', () => {
  let component: GraphCamInseeComponent;
  let fixture: ComponentFixture<GraphCamInseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamInseeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamInseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
