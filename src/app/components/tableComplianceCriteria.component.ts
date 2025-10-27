import { Component, computed, inject, input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ComplianceProfile } from '@models/compliances';
import { ApiServices } from '@services/api.service';
import { CompliancesCriteraRes } from '@models/compliancesCriteria.model';

interface ComplianceData {
  id: number;
  labelLevel: string;
  rulesVersion: string;
  category: string;
  code: string;
  link: string;
  compliance: 'Yes' | 'No';
  document: ComplianceProfile;
}

@Component({
  selector: 'app-table-compliance-criteria',
  standalone: true,
  imports: [TableModule, DropdownModule, FormsModule],
  template: `
    <p-table [value]="tableData()" class="p-datatable-sm">
      <ng-template pTemplate="header">
        <tr>
          <th>CATEGORY</th>
          <th style="width: 80px;">CODE</th>
          <th>CRITERIA</th>
          <th>COMPLIANCE</th>
          <th>DOCUMENT</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
        <tr>
          <td>{{ row.category }}</td>
          <td style="width: 80px;">
            <a [href]="row.link" target="_blank">{{ row.code }}</a>
          </td>
          <td>{{ row.criteria }}</td>
          <td>
            <p-dropdown
              [options]="complianceOptions"
              (onChange)="onComplianceChange($event.value, rowIndex)"
              styleClass="w-28 font-bold"
              appendTo="body"
            />
          </td>
          <td>
            <p-dropdown
              [options]="documentOptions()"
              (onChange)="onDocumentChange($event.value, rowIndex)"
              styleClass="w-48 font-bold"
              appendTo="body"
            />
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
  apiServices = inject(ApiServices);
  documents = input<ComplianceProfile[]>([]);
  documentOptions = computed(() => {
    return this.documents().map((doc) => ({
      label: doc.fileName,
      value: doc.id,
    }));
  });

  complianceOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  tableData = signal<CompliancesCriteraRes[]>([]);
  complianceData = signal<ComplianceData[]>([]);

  getCompliaceData() {
    return this.complianceData();
  }

  constructor() {
    this.apiServices.getCompliancesCriteria().subscribe((data) => {
      this.tableData.set(data);
      this.complianceData.set(
        data.map((row) => ({
          id: row.id,
          compliance: 'Yes',
          category: row.category,
          code: row.code,
          labelLevel: row.labelLevel,
          rulesVersion: row.rulesVersion,
          link: row.link,
          document: this.documents()[0],
        }))
      );
    });
  }

  onComplianceChange(newValue: 'Yes' | 'No', rowIndex: number) {
    const updatedData = this.complianceData();
    updatedData[rowIndex].compliance = newValue;
    this.complianceData.set(updatedData);
  }
  onDocumentChange(docId: number, rowIndex: number) {
    const updatedData = this.complianceData();

    const selectedDocument = this.documents().find((doc) => doc.id === docId);
    console.log('selectedDocument', selectedDocument);
    if (selectedDocument) {
      updatedData[rowIndex].document = selectedDocument;
      this.complianceData.set(updatedData);
    }
  }
}
