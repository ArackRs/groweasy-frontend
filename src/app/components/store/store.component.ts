import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {NgStyle} from '@angular/common';
import {User} from '../../model/user';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    NgStyle
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
