import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamLuminositeComponent } from './graph-cam-luminosite.component';

describe('GraphCamLuminositeComponent', () => {
  let component: GraphCamLuminositeComponent;
  let fixture: ComponentFixture<GraphCamLuminositeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamLuminositeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamLuminositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
