import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectDeviceComponent } from './connect-device.component';

describe('ConnectDeviceComponent', () => {
  let component: ConnectDeviceComponent;
  let fixture: ComponentFixture<ConnectDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
