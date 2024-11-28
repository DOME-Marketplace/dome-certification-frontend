import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableRequestComponent } from '@components/tableRequest.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableRequestComponent],
  template: ` <app-table-request /> `,
})
export class DashboardComponent { }
