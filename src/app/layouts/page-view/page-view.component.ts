import {Component, Input, OnInit} from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {Device} from '../../models/device';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {DeviceService} from '../../services/device.service';

@Component({
  selector: 'app-page-view',
  imports: [
    SidebarComponent,
  ],
  templateUrl: './page-view.component.html',
  styleUrl: './page-view.component.css'
})
export class PageViewComponent implements OnInit {
  showDevice: boolean = false;
  user: User | undefined = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  connectedDevice: Device | undefined = localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;
  @Input() title: string = '';
  @Input() subtitle: string = '';

  constructor(
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
  ) {}

  ngOnInit(): void {

    if (!this.user) {
      this.loadUser();
    }

    this.deviceService.deviceSelected$.subscribe((device: Device): void => {
      this.connectedDevice = device;
    });
  }

  loadUser() {
    const username: string = this.userService.getUsername();

    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        alert('No se pudo cargar el perfil. Intente de nuevo más tarde.');
      }
    });
  }

  toggleDevice() {
    this.showDevice = !this.showDevice;
  }

}
