import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphHistoDepComponent } from './graph-histo-dep.component';

describe('GraphHistoDepComponent', () => {
  let component: GraphHistoDepComponent;
  let fixture: ComponentFixture<GraphHistoDepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphHistoDepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphHistoDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
