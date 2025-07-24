import { Component, input } from '@angular/core';

@Component({
  selector: 'app-property',
  standalone: true,
  template: `
    <div>
      <h6 class="text-base m-0">{{ label() }}</h6>
      @if(isLink() && value()) {
      <a
        class="mt-0 mb-2 no-underline text-sky-950"
        [href]="value()"
        target="_blank"
      >
        {{ displayValue() || value() }}
        <i class="pi pi-external-link ml-1 text-xs"></i>
      </a>
      } @else {
      <p class="mt-0 mb-2">{{ value() }}</p>
      }
    </div>
  `,
})
export class PropertiesComponent {
  label = input<string>('');
  value = input<string | number | null | undefined>('');
  isLink = input<boolean>(false);
  displayValue = input<string | undefined>(undefined);
}
