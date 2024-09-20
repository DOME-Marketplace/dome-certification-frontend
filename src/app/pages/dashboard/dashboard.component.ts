import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableRequestComponent } from '@components/tableRequest.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableRequestComponent],
  template: `
    <div class="flex flex-col justify-center items-center">
      <!-- <h1 class="text-xl font-bold text-center">Certificates Manager</h1> -->

      <app-table-request />
    </div>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
