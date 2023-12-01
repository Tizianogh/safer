import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamComponent } from './graph-cam.component';

describe('GraphCamComponent', () => {
  let component: GraphCamComponent;
  let fixture: ComponentFixture<GraphCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
