import { Component, computed, inject, input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ComplianceProfile } from '@models/compliances';
import { ApiServices } from '@services/api.service';
import { CompliancesCriteraRes } from '@models/compliancesCriteria.model';
import {
  CATEGORY_TO_DOMAIN,
  certCovers,
  criterionNumber,
  FileClassification,
} from '@utils/certificateCriteriaMap';

type ComplianceValue = 'Yes' | 'Yes with Certification' | 'No';
type Coverage = 'certified' | 'self-attested' | 'gap';

interface ComplianceData {
  id: number;
  labelLevel: string;
  rulesVersion: string;
  category: string;
  code: string;
  criteria: string;
  link: string;
  coverage: Coverage;
  compliance: ComplianceValue;
  document: ComplianceProfile | undefined;
}

@Component({
  selector: 'app-table-compliance-criteria',
  standalone: true,
  imports: [TableModule, TagModule],
  template: `
    <p-table [value]="complianceData()" class="p-datatable-sm">
      <ng-template pTemplate="header">
        <tr>
          <th>CATEGORY</th>
          <th style="width: 110px;">CODE</th>
          <th>CRITERIA</th>
          <th style="width: 140px;">COVERAGE</th>
          <th>DOCUMENT</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr [class]="row.coverage === 'gap' ? 'bg-red-50' : ''">
          <td>{{ row.category }}</td>
          <td style="width: 110px;">
            <a [href]="row.link" target="_blank">{{ row.code }}</a>
            @if (row.labelLevel === 'P') {
            <p-tag value="Prof" severity="warning" styleClass="text-xs ml-1" />
            }
          </td>
          <td class="text-sm">{{ row.criteria }}</td>
          <td style="width: 140px;">
            <p-tag [value]="coverageLabel(row.coverage)" [severity]="coverageSeverity(row.coverage)" styleClass="text-xs" />
          </td>
          <td class="text-xs text-gray-500 truncate">{{ row.document?.fileName ?? '—' }}</td>
        </tr>
      </ng-template>
    </p-table>

    @if (gapGuidance()) {
    <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      {{ gapGuidance() }}
    </div>
    }
  `,
  styles: [
    `
      :host ::ng-deep .p-datatable-sm .p-datatable-tbody > tr > td,
      :host ::ng-deep .p-datatable-sm .p-datatable-thead > tr > th {
        font-size: 0.95rem;
      }
    `,
  ],
})
export class TableComplianceCriteriaComponent {
  private apiServices = inject(ApiServices);

  documents = input<ComplianceProfile[]>([]);
  fileClassifications = input<FileClassification[]>([]);

  // Criteria come from the backend. Some are Professional-tier (labelLevel 'P') even within the
  // Cybersecurity category — CS-20 in particular (intentional). They stay grouped with CS but are
  // flagged with a "Prof" tag in the table so the certifier can tell them from Baseline ('BL').
  tableData = signal<CompliancesCriteraRes[]>([]);

  constructor() {
    this.apiServices.getCompliancesCriteria().subscribe((data) => {
      this.tableData.set(data);
    });
  }

  // Auto-derive per-criterion coverage from the document classifications.
  // certified  = a classified certificate covers this criterion (via the cert->criteria map)
  // self-attested = a self-attestation document covers this criterion's domain
  // gap        = neither
  complianceData = computed<ComplianceData[]>(() => {
    const classifications = this.fileClassifications();
    const docsById = new Map(this.documents().map((d) => [d.id, d]));

    return this.tableData().map((c) => {
      const domain = CATEGORY_TO_DOMAIN[c.category];
      const num = criterionNumber(c.code);

      const certFc = classifications.find(
        (fc) => fc.type === 'certificate' && certCovers(fc.certName, domain, num)
      );
      const selfFc = classifications.find(
        (fc) => fc.type === 'self-attestation' && !!domain && fc.coveredDomains.includes(domain)
      );

      let coverage: Coverage = 'gap';
      let compliance: ComplianceValue = 'No';
      let document: ComplianceProfile | undefined;

      if (certFc) {
        coverage = 'certified';
        compliance = 'Yes with Certification';
        document = docsById.get(certFc.profileId);
      } else if (selfFc) {
        coverage = 'self-attested';
        compliance = 'Yes';
        document = docsById.get(selfFc.profileId);
      }

      return {
        id: c.id,
        labelLevel: c.labelLevel,
        rulesVersion: c.rulesVersion,
        category: c.category,
        code: c.code,
        criteria: c.criteria,
        link: c.link,
        coverage,
        compliance,
        document,
      };
    });
  });

  // Compliance level per the DOME rule, using the backend's per-criterion labelLevel
  // (BL = DP + CS baseline; P = CS-20 + Portability + Sustainability) and certificate evidence:
  //   Baseline          = all BL criteria covered (self-attested or certified)
  //   Professional      = + all P criteria covered + >=1 security cert (a DP/CS criterion certified)
  //   Professional Plus = + >=1 green-deal cert (a Sustainability criterion certified)
  certificationLevel = computed(() => {
    const data = this.complianceData();
    if (data.length === 0) return 'Rejected';

    const covered = (v: ComplianceValue) => v === 'Yes' || v === 'Yes with Certification';
    const bl = data.filter((r) => r.labelLevel === 'BL');
    const p = data.filter((r) => r.labelLevel === 'P');

    const allBLCovered = bl.length > 0 && bl.every((r) => covered(r.compliance));
    // Guard: an empty professional-tier set must NOT vacuously pass (fail closed) — otherwise a
    // criteria feed missing the P-tier rows would silently grant Professional.
    const allPCovered = p.length > 0 && p.every((r) => covered(r.compliance));
    const hasSecurityCert = data.some(
      (r) =>
        (r.category === 'DATA PROTECTION & MANAGEMENT' || r.category === 'CYBERSECURITY') &&
        r.compliance === 'Yes with Certification'
    );
    // Professional Plus needs a Portability OR Sustainability certificate (not just green/ST).
    const hasPtStCert = data.some(
      (r) =>
        (r.category === 'PORTABILITY' || r.category === 'SUSTAINABILITY') &&
        r.compliance === 'Yes with Certification'
    );

    if (!allBLCovered) return 'Rejected';
    if (allPCovered && hasSecurityCert && hasPtStCert) return 'Professional Plus';
    if (allPCovered && hasSecurityCert) return 'Professional';
    return 'Baseline';
  });

  // The gx:labelLevel code sent to the backend (null when Rejected -> not issuable).
  labelCode = computed<'BL' | 'P' | 'PP' | null>(() => {
    switch (this.certificationLevel()) {
      case 'Professional Plus':
        return 'PP';
      case 'Professional':
        return 'P';
      case 'Baseline':
        return 'BL';
      default:
        return null;
    }
  });

  // Human guidance on what's missing to reach the next level (mirrors certificationLevel()).
  gapGuidance = computed<string>(() => {
    const data = this.complianceData();
    if (data.length === 0) return '';
    const level = this.certificationLevel();
    if (level === 'Professional Plus') return '';

    const covered = (v: ComplianceValue) => v === 'Yes' || v === 'Yes with Certification';
    const blGaps = data.filter((r) => r.labelLevel === 'BL' && !covered(r.compliance)).map((r) => r.code);
    const pGaps = data.filter((r) => r.labelLevel === 'P' && !covered(r.compliance)).map((r) => r.code);
    const hasSecurityCert = data.some(
      (r) =>
        (r.category === 'DATA PROTECTION & MANAGEMENT' || r.category === 'CYBERSECURITY') &&
        r.compliance === 'Yes with Certification'
    );

    if (level === 'Rejected') {
      return `Not yet Baseline — every Data Protection & Cybersecurity criterion must be covered. Missing: ${blGaps.join(', ')}.`;
    }
    if (level === 'Baseline') {
      const needs: string[] = [];
      if (pGaps.length) needs.push(`cover the remaining Professional-tier criteria (${pGaps.join(', ')})`);
      if (!hasSecurityCert) needs.push('classify at least one security certificate (e.g. ISO/IEC 27001)');
      return `To reach Professional: ${needs.join('; ')}.`;
    }
    // Professional -> Professional Plus
    return 'To reach Professional Plus: classify at least one Portability or Sustainability certificate (e.g. SWIPO IaaS or CNDCP).';
  });

  certificationLevelStyle = computed(() => {
    switch (this.certificationLevel()) {
      case 'Professional Plus':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Professional':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Baseline':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  });

  // Every uploaded document must be fully classified before validating.
  allClassificationsComplete = computed(() => {
    const cls = this.fileClassifications();
    if (cls.length === 0) return false;
    return cls.every((fc) => {
      if (!fc.type) return false;
      if (fc.type === 'certificate') return !!fc.certName;
      if (fc.type === 'self-attestation') return fc.coveredDomains.length > 0;
      return false;
    });
  });

  // Rows fed to the backend payload (only met criteria; the modal filters out 'No').
  getCompliaceData() {
    return this.complianceData();
  }

  coverageLabel(coverage: Coverage): string {
    return { certified: 'Certified', 'self-attested': 'Self-attested', gap: 'Gap' }[coverage];
  }

  coverageSeverity(coverage: Coverage): 'success' | 'info' | 'danger' {
    switch (coverage) {
      case 'certified':
        return 'success';
      case 'self-attested':
        return 'info';
      case 'gap':
        return 'danger';
    }
  }
}
