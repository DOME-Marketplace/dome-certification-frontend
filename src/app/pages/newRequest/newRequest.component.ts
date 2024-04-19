import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormRequestComponent } from '../../components/form-request/formRequest.component';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormRequestComponent],
  template: `
    <div class="flex flex-col justify-center items-center">
      <!-- <h1 class="text-xl font-bold text-center">New Request</h1> -->

      <app-form-request />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRequestComponent {}
