import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamCatvComponent } from './graph-cam-catv.component';

describe('GraphCamCatvComponent', () => {
  let component: GraphCamCatvComponent;
  let fixture: ComponentFixture<GraphCamCatvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamCatvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamCatvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
