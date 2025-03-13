import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatCard, MatCardContent} from '@angular/material/card';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardContent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

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
