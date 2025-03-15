import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSensorComponent } from './configure-sensor.component';

describe('ConfigureSensorComponent', () => {
  let component: ConfigureSensorComponent;
  let fixture: ComponentFixture<ConfigureSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureSensorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
