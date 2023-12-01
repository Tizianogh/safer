import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamTrajetComponent } from './graph-cam-trajet.component';

describe('GraphCamTrajetComponent', () => {
  let component: GraphCamTrajetComponent;
  let fixture: ComponentFixture<GraphCamTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamTrajetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
