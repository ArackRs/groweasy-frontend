import { Component } from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {PageViewComponent} from '../../layouts/page-view/page-view.component';
import {Card} from "primeng/card";

@Component({
    selector: 'app-store',
  imports: [
    Card,
    PageViewComponent,
  ],
    templateUrl: './store.component.html',
    styleUrl: './store.component.css'
})
export class StoreComponent {
  user: User | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
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

  logout(): void {
    this.authService.signOut();
  }
}
