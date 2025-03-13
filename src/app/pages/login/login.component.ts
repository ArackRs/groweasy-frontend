import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatRadioButton} from '@angular/material/radio';
import {Router, RouterLink} from '@angular/router';
import {SignIn} from '../../model/sign-in';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggle,
    MatRadioButton,
    MatButtonToggleGroup,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  hide = true;
  credentials: SignIn | null = null;

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

      this.credentials = {
        username: this.form.value.username,
        password: this.form.value.password
      };

      this.authService.signIn(this.credentials).subscribe({
        next: () => {
          this.router.navigate(['/home'])
            .then(r => console.log('Redirection a /home:', r));
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
        }
      });
    } else {
      console.error('Formulario no válido');
    }
  }
  // constructor(private fb: FormBuilder, private router: Router) {
  //   this.form = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required]
  //   });
  // }
  //
  // logIn(): void {
  //   if (this.form.valid) {
  //     this.router.navigate(['/home']);
  //   }
  // }
}
