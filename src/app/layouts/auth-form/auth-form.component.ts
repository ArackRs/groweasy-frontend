import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Divider} from 'primeng/divider';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-auth-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Divider,
    Toast
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {

}
