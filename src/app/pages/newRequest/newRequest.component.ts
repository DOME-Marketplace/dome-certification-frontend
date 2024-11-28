import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormRequestComponent } from '@components/formRequest.component';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormRequestComponent],
  template: `
    <div class="flex flex-col justify-center items-center">

      <app-form-request />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRequestComponent { }
