import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCamSexeComponent } from './graph-cam-sexe.component';

describe('GraphCamSexeComponent', () => {
  let component: GraphCamSexeComponent;
  let fixture: ComponentFixture<GraphCamSexeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCamSexeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCamSexeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
