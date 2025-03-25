import {Component, Input} from '@angular/core';
import {Card} from "primeng/card";
import {ChartData} from 'chart.js';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-metric-card',
  imports: [
    Card,
    NgForOf,
    NgClass
  ],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css'
})
export class MetricCardComponent {

  @Input() doughnutChartData!: ChartData<"doughnut">;
}
