import {Component, Input} from '@angular/core';
import {Message} from 'primeng/message';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-alert-card',
  imports: [
    Message,
    NgForOf
  ],
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.css'
})
export class AlertCardComponent {
  @Input() alerts!: string[];

}
