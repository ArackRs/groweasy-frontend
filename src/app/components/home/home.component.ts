import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardModule} from '@angular/material/card';
import {NgStyle} from '@angular/common';
import {FloatingBoxComponent} from '../floating-box/floating-box.component';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {DeviceService} from '../../services/device.service';
import {Device} from '../../model/device';
import {Sensor} from '../../model/sensor';
import {DevicesComponent} from '../devices/devices.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardModule,
    NgStyle,
    FloatingBoxComponent,
    DevicesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  showModal = false;
  showDevice = false;
  user: User | null = null;
  devices: Device[] = [];
  sensors: Sensor[] = [];
  connectedDevice: Device | null = null;
  selectedSensor!: Sensor;

  constructor(
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
  ) {}

  ngOnInit(): void {

    // this.loadDevices();
  }

  loadUser() {
    const username = this.userService.getUsername();

    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        alert('No se pudo cargar el perfil. Intente de nuevo más tarde.');
      }
    });
  }

  loadDevices(){
    this.deviceService.getAll().subscribe({
      next: (devices) => {
        console.log('Dispositivos:', devices);
        this.devices = devices;
        this.sensors = devices.flatMap((device) => device.sensors);
      },
      error: (error) => {
        console.error('Error al obtener los dispositivos:', error);
        alert('No se pudieron cargar los dispositivos. Intente de nuevo más tarde.');
      }
    });
  }

  toggleModal(sensor: Sensor){
    this.showModal = !this.showModal;
    this.selectedSensor = sensor;
  }

  toggleDevice() {
    this.showDevice = !this.showDevice;
  }

  handleDeviceSelected($event: Device) {
    console.log('Dispositivo seleccionado:', $event);
    this.connectedDevice = $event;
    this.sensors = this.connectedDevice.sensors;
    console.log("Sensors", this.sensors);
  }
}
