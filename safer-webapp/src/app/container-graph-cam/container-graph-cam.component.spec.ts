import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerGraphCamComponent } from './container-graph-cam.component';

describe('ContainerGraphCamComponent', () => {
  let component: ContainerGraphCamComponent;
  let fixture: ComponentFixture<ContainerGraphCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerGraphCamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerGraphCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
