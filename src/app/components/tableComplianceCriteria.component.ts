import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

interface ComplianceCriteria {
  category: string;
  code: string;
  criteria: string;
  compliance: 'Yes' | 'No';
}

@Component({
  selector: 'app-table-compliance-criteria',
  standalone: true,
  imports: [TableModule],
  template: `
    <p-table [value]="data" class="p-datatable-sm">
      <ng-template pTemplate="header">
        <tr>
          <th>CATEGORY</th>
          <th>CODE</th>
          <th>CRITERIA</th>
          <th>COMPLIANCE (Y/N)</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td>{{ row.category }}</td>
          <td>{{ row.code }}</td>
          <td>{{ row.criteria }}</td>
          <td
            [class]="
              'font-bold ' +
              (row.compliance === 'Yes' ? 'text-green-700' : 'text-red-700')
            "
          >
            {{ row.compliance }}
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [
    `
      :host ::ng-deep .p-datatable-sm .p-datatable-tbody > tr > td,
      :host ::ng-deep .p-datatable-sm .p-datatable-thead > tr > th {
        font-size: 0.95rem;
      }
      .text-green-700 {
        color: #15803d;
      }
      .text-red-700 {
        color: #b91c1c;
      }
      .font-bold {
        font-weight: 700;
      }
    `,
  ],
})
export class TableComplianceCriteriaComponent {
  data: ComplianceCriteria[] = [
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-1',
      criteria:
        'The Company, when a Cloud Customer is contracting the Offering, offers a written contract under a EU/EEA/Member State law and specifically addressing GDPR requirements.',
      compliance: 'Yes',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-2',
      criteria:
        'The Company has defined the roles and responsibilities of each party in the delivery of the Offering.',
      compliance: 'Yes',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-3',
      criteria:
        'The Company has defined the technical and organizational measures in accordance with the roles and responsibilities of the parties in the delivery of the Offering, including an adequate level of detail.',
      compliance: 'Yes',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-4',
      criteria:
        'The Company shall not access Customer Data unless authorized by the Customer or when the access is in accordance with applicable laws governing the contract of the Offering.',
      compliance: 'Yes',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-5',
      criteria:
        'The Company hereby declares that the Offering is compliant with all the requirements of applicable laws and regulations concerning the protection of personal data, and specifically the General Data Protection Regulation (Regulation (EU) 2016/679).',
      compliance: 'Yes',
    },
  ];
}
