import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ApiBaseService} from './services/api-base.service';

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinner],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isSleeping: boolean = true;

  constructor(
    private readonly apiBaseService: ApiBaseService<any>,
  ) {
  }

  ngOnInit(): void {

    this.apiBaseService.healthCheck().subscribe({
      next: (res) => {
        console.log('Health check OK', res);
      },
      error: (error) => {
        console.error('Health check failed', error);
      }
    });
    setTimeout((): void => {
      this.isSleeping = false;
    }, 2000);
  }
}
