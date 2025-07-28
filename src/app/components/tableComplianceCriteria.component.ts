import { Component, computed, input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ComplianceProfile } from '@models/compliances';

interface ComplianceCriteria {
  category: string;
  code: string;
  criteria: string;
  compliance: 'Yes' | 'No';
  link?: string;
  document?: string;
}

@Component({
  selector: 'app-table-compliance-criteria',
  standalone: true,
  imports: [TableModule, DropdownModule, FormsModule],
  template: `
    <p-table [value]="data" class="p-datatable-sm">
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
              [(ngModel)]="data[rowIndex].compliance"
              (onChange)="onComplianceChange($event.value, rowIndex)"
              styleClass="w-28 font-bold"
              [panelStyle]="{ width: '6rem' }"
              [style]="{
                'border-color':
                  data[rowIndex].compliance === 'Yes' ? '#15803d' : '#b91c1c'
              }"
            />
          </td>
          <td>
            <p-dropdown
              [options]="documentOptions()"
              [(ngModel)]="data[rowIndex].document"
              (onChange)="onDocumentChange($event.value, rowIndex)"
              styleClass="w-48 font-bold"
              [panelStyle]="{ width: '6rem' }"
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

  dataSignal = signal<ComplianceCriteria[]>([
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-1',
      criteria:
        'The Company, when a Cloud Customer is contracting the Offering, offers a written contract under a EU/EEA/Member State law and specifically addressing GDPR requirements.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P2.1.1',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-2',
      criteria:
        'The Company has defined the roles and responsibilities of each party in the delivery of the Offering.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P2.1.2',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-3',
      criteria:
        'The Company has defined the technical and organizational measures in accordance with the roles and responsibilities of the parties in the delivery of the Offering, including an adequate level of detail.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P2.1.3',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-4',
      criteria:
        'The Company shall not access Customer Data unless authorized by the Customer or when the access is in accordance with applicable laws governing the contract of the Offering.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P5.2.1',
    },
    {
      category: 'DATA PROTECTION & MANAGEMENT',
      code: 'DP-5',
      criteria:
        'The Company hereby declares that the Offering is compliant with all the requirements of applicable laws and regulations concerning the protection of personal data, and specifically the General Data Protection Regulation (Regulation (EU) 2016/679).',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P1.1.5',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-1',
      criteria:
        'Organization of information security: the Company plans, implements, maintains and continuously improves the information security framework within the organisation.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.1',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-2',
      criteria:
        'Information Security Policies: the Company has a global information security policy, derived into policies and procedures regarding security requirements and to support business requirements.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.2',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-3',
      criteria:
        'Risk Management: the Company ensures that risks related to information security are properly identified, assessed, and treated, and that the residual risk is acceptable to the Company pursuant to its own criteria.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.3',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-4',
      criteria:
        'Human Resources: the Company ensures that its employees understand their responsibilities, are aware of their responsibilities regarding information security, and that the organisation’s assets are protected in the event of changes in responsibilities or termination.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.4',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-5',
      criteria:
        'Asset Management: the Company identifies the organisation’s own assets and ensures an appropriate level of protection throughout their lifecycle.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.5',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-6',
      criteria:
        'Physical Security: the Company prevents unauthorised physical access and protects premises and assets against theft, damage, loss and outage of operations.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.6',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-7',
      criteria:
        'Operational Security: the Company ensures proper and regular operation, including appropriate measures for planning and monitoring capacity, protection against malware, logging and monitoring events, and dealing with vulnerabilities, malfunctions and failures',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.7',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-8',
      criteria:
        'Identity, Authentication and access control management: the Company limits access to information and information processing facilities.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.8',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-9',
      criteria:
        'Cryptography and Key management: the Company ensures appropriate and effective use of cryptography to protect the confidentiality, authenticity and integrity of information.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.9',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-10',
      criteria:
        'Communication Security: the Company ensures the protection of information in networks and the corresponding information processing systems',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.10',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-11',
      criteria:
        'Portability and Interoperability: the Offering provides a means by which a Cloud Customer can obtain its stored data, and the Company provides documentation on how (and where appropriate, through documented APIs) the Cloud Customer can obtain its stored data at the end of the contractual relationship and the Company documents how the data is securely deleted from the Offering infrastructure and in what timeframe.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.11',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-12',
      criteria:
        'Change and Configuration Management: the Company ensures that changes and configuration actions to information systems maintain an adequate security of the Offering.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.12',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-13',
      criteria:
        'Development of Information systems: the Company ensures information security in the development cycle of the Offering.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.13',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-14',
      criteria:
        'Procurement Management: the Company ensures the protection of information that suppliers of the Company can access and monitors the agreed services and security requirements.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.14',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-15',
      criteria:
        'Incident Management: the Company ensures a consistent and comprehensive approach to the capture, assessment, communication and escalation of security incidents.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.15',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-16',
      criteria:
        'Business Continuity: the Company plans, implements, maintains and tests procedures and measures for business continuity and emergency management.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.16',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-17',
      criteria:
        'Compliance: the Company takes positive and affirmative steps to ensure compliance with legal, regulatory, self-imposed or contractual information security and compliance requirements.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.17',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-18',
      criteria:
        'Dealing with information requests from government agencies: the Company ensures an appropriate handling of government investigation requests for legal review, information to Cloud Customers, and limitation of access to or disclosure of Cloud Customer data.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.19',
    },
    {
      category: 'CYBERSECURITY',
      code: 'CS-19',
      criteria:
        'Offering security: the Company provides appropriate mechanisms for cloud customers to enable Offering security. The Company ensures that the by-default configuration of the Offering is secure.',
      compliance: 'Yes',
      link: 'https://docs.gaia-x.eu/policy-rules-committee/compliance-document/25.03/criteria_cloud_services/#P3.1.20',
    },
  ]);

  get data() {
    return this.dataSignal();
  }

  onComplianceChange(newValue: 'Yes' | 'No', rowIndex: number) {
    const updated = [...this.dataSignal()];
    updated[rowIndex] = { ...updated[rowIndex], compliance: newValue };
    this.dataSignal.set(updated);
  }
  onDocumentChange(newValue: string, rowIndex: number) {
    console.log(this.documentOptions());
    const updated = [...this.dataSignal()];
    updated[rowIndex] = { ...updated[rowIndex], document: newValue };
    this.dataSignal.set(updated);
  }
}
