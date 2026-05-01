import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemercadeoComponent } from './telemercadeo.component';

describe('TelemercadeoComponent', () => {
  let component: TelemercadeoComponent;
  let fixture: ComponentFixture<TelemercadeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelemercadeoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelemercadeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
