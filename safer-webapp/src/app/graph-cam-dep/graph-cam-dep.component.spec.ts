import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamDepComponent } from './graph-cam-dep.component';

describe('GraphCamDepComponent', () => {
  let component: GraphCamDepComponent;
  let fixture: ComponentFixture<GraphCamDepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamDepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
