import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatRadioButton} from '@angular/material/radio';
import {Router, RouterLink} from '@angular/router';
import {SignIn} from '../../model/sign-in';
import {AuthService} from '../../services/auth.service';
import {FloatLabel} from 'primeng/floatlabel';
import {NgClass, NgIf} from '@angular/common';
import {Password} from 'primeng/password';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {AuthFormComponent} from '../../layouts/auth-form/auth-form.component';

@Component({
    selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggle,
    MatRadioButton,
    MatButtonToggleGroup,
    RouterLink,
    FloatLabel,
    FormsModule,
    NgIf,
    NgClass,
    Password,
    InputText,
    Button,
    AuthFormComponent
  ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loadingSignUp: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const credentials: SignIn = {
        username: this.form.value.username,
        password: this.form.value.password
      };

      this.authService.signIn(credentials).subscribe({
        next: () => {
          this.router.navigate(['/home']).then(r => console.log('Redirection a /home:', r));
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
        }
      });
    } else {
      console.error('Formulario no válido');
    }
  }
}

