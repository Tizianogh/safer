import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamGravComponent } from './graph-cam-grav.component';

describe('GraphCamGravComponent', () => {
  let component: GraphCamGravComponent;
  let fixture: ComponentFixture<GraphCamGravComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamGravComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamGravComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
