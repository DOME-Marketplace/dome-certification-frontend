import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServices } from '../services/api.service';
import { CompliancesValidatedRes } from '../models/compliancesCriteriaValidated.model';
import { TableModule } from 'primeng/table';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-compliances-validated',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    @if (loading()) {
    <div class="py-8 text-center text-gray-500">Loading...</div>
    } @else {
    <p-table
      [value]="compliances()"
      [responsiveLayout]="'scroll'"
      class="p-datatable-sm"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Code</th>
          <th>Category</th>
          <th>Document</th>
          <th>Issuer</th>
          <th>Organization</th>
          <th>Date</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td style="width: 80px;">
            <a [href]="row.complianceCriteria.link" target="_blank">{{
              row.complianceCriteria.code
            }}</a>
          </td>
          <td>{{ row.complianceCriteria.category }}</td>
          <td>{{ row.complianceProfile.fileName }}</td>
          <td>{{ row.issuer.firstname }} {{ row.issuer.lastname }}</td>
          <td>
            {{ row.issuer.organization_name }}
          </td>
          <td>{{ row.createdAt | date }}</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="4" class="text-center text-gray-400">No hay datos</td>
        </tr>
      </ng-template>
    </p-table>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCompliancesValidatedComponent {
  private api = inject(ApiServices);
  dialogService = inject(DialogService);
  config = inject(DynamicDialogConfig);

  productId = signal<number | null>(this.config.data?.productId ?? null);
  loading = signal(false);
  compliances = signal<CompliancesValidatedRes[]>([]);

  constructor() {
    effect(
      () => {
        const id = this.productId();
        if (id != null) {
          this.loadCompliances(id);
        }
      },
      { allowSignalWrites: true }
    );
  }

  private loadCompliances(id: number) {
    this.loading.set(true);
    this.api.getProductCompliances(id).subscribe({
      next: (res) => {
        this.compliances.set(res ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.compliances.set([]);
        this.loading.set(false);
      },
    });
  }
}
