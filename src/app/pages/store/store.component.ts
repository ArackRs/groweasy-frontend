import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {PageViewComponent} from '../../layouts/page-view/page-view.component';
import {Card} from "primeng/card";
import {Chip} from "primeng/chip";
import {Image} from "primeng/image";
import {Device} from '../../models/device';

@Component({
    selector: 'app-store',
  imports: [
    Card,
    PageViewComponent,
    Chip,
    Image,
  ],
    templateUrl: './store.component.html',
    styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  user: User | undefined = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  connectedDevice: Device | undefined = localStorage.getItem('connectedDevice') ? JSON.parse(localStorage.getItem('connectedDevice') as string) : null;

  constructor(
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {

    if (!this.user) {
      this.loadUser();
    }
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
}
