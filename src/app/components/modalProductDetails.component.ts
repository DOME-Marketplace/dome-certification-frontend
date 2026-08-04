import {
  ComplianceProfile,
  CompliancesStandards,
  CompliancesToValidate,
  IssuerCompliance,
} from '@models/compliances';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { InputTextModule } from 'primeng/inputtext';
import moment from 'moment';
import { ApiServices } from '@services/api.service';
import { ResPO } from '@models/ProductOffering';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { ModalRejectProductComponent } from '@components/modalRejectProduct.component';
import { UserRole } from '@models/user.role.model';
import { TooltipModule } from 'primeng/tooltip';
import { TokenService } from '@services/token.service';
import { IssuerService } from '@services/issuer.service';
import { finalize, switchMap } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { CustomOAuthService } from '@services/oauth.service';
import { ResM2MToken } from '@models/auth.model';
import { PropertiesComponent } from '@ui/properties.component';
import { TableComplianceCriteriaComponent } from './tableComplianceCriteria.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalCompliancesValidatedComponent } from './modalCompliancesValidated.component';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import {
  ACCEPTED_CERTIFICATES,
  ALL_DOMAINS,
  allFilesClassified,
  Domain,
  FileClassification,
  FileType,
} from '@utils/certificateCriteriaMap';

@Component({
  selector: 'app-modal-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AvatarModule,
    ButtonModule,
    DividerModule,
    PdfViewerModule,
    InputTextModule,
    MultiSelectModule,
    CalendarModule,
    ModalRejectProductComponent,
    ModalRejectProductComponent,
    PropertiesComponent,
    TableComplianceCriteriaComponent,
    TooltipModule,
    DropdownModule,
    CheckboxModule,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [maximizable]="true"
      [modal]="true"
      [style]="{ width: '69vw' }"
      (onHide)="handleCloseDetailsModal()"
    >
      <ng-template pTemplate="header" class="flex flex-col items-start">
        <div class="flex items-center justify-between gap-2">
          <p-avatar
            image="{{ selectedRow && selectedRow.image }}"
            shape="circle"
          />
          <span class="font-bold text-lg">
            {{ selectedRow && selectedRow.service_name }}</span
          >
        </div>
        <span class="p-input-icon-left w-96">
          <i class="pi pi-search"></i>
          <input
            #search
            type="text"
            pInputText
            placeholder="Search"
            (keydown)="handleSearch()"
            class="p-inputtext-sm w-full"
          />
        </span>
      </ng-template>
      @if(selectedRow){
      <div class="flex justify-between gap-8">
        <div class="w-full max-w-md flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
              <div>
                <h5 class="m-0 text-xl">Product Information</h5>
              </div>

              <p-divider class="flex-1 m-0" />
            </div>
            <div>
              <app-property label="Product ID" [value]="selectedRow.id_PO" />
              <app-property
                label="Product Name"
                [value]="selectedRow.service_name"
              />
              <app-property
                label="Product Version"
                [value]="selectedRow.service_version"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
              <h5 class="m-0 text-xl flex-1 text-nowrap">
                Organization Information
              </h5>

              <p-divider class="flex-1 m-0" />
            </div>

            <div>
              <app-property
                label="Organization Name"
                [value]="selectedRow.name_organization"
              />
              <app-property
                label="Organization ID"
                [value]="selectedRow.vat_ID"
              />

              <app-property
                label="Organization Country"
                [value]="selectedRow.ISO_Country_Code"
              />

              <app-property
                label="Organization Contact Email"
                value="mailto:{{ selectedRow.email_organization }}"
                [displayValue]="selectedRow.email_organization"
                [isLink]="true"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
              <div class="">
                <h5 class="m-0 text-xl">Compliance Level Information</h5>
              </div>

              <p-divider class="flex-1 m-0" />
            </div>
            <div>
              <app-property
                label="Requested Date"
                [value]="selectedRow.request_date | date"
              />

              @if(selectedRow.issue_date && selectedRow.status !== 'REJECTED'){
              <app-property
                label="Issue Date"
                [value]="selectedRow.issue_date | date"
              />

              } @if(selectedRow.expiration_date && selectedRow.status !==
              'REJECTED'){
              <app-property
                label="Expiration Date"
                [value]="selectedRow.expiration_date | date"
              />
              }
              <app-property label="Status" [value]="selectedRow.status" />

              <div class="flex items-center gap-4">
                <div>
                  <h5 class="m-0 text-lg">Documents</h5>
                </div>

                <p-divider class="flex-1 m-0" />
              </div>

              <div class="grid grid-cols-3 gap-4 mt-4">
                @for ( profile of selectedRow.complianceProfiles ; track
                profile.id ) {
                <div
                  class="flex flex-col items-center justify-center cursor-pointer p-2 rounded  {{
                    this.pdfSelected?.id == profile.id ? ' bg-[#2d58a721]' : ''
                  }} "
                  (click)="handlePdf(profile)"
                >
                  <i class="pi pi-file-pdf" style="font-size: 2rem"></i>
                  <p class="truncate w-32 text-sm mb-0">
                    {{ profile.fileName }}.pdf
                  </p>
                </div>
                }
              </div>
              <p-divider />

              @if(pdfSelected){
              <ul>
                <li class="text-sm">File: {{ pdfSelected.fileName }}</li>
                <li class="text-sm">
                  Size: ({{
                    computedVcBlob().size / 1048576 | number : '1.2-2'
                  }}
                  MB)
                </li>
              </ul>

              } @if(this.selectedRow.status == 'VALIDATED' ){
              <p-divider />
              <div class="flex flex-col  mt-4">
                <h6 class="text-base m-0">Compliances Level Validated</h6>
                <ul>
                  <li
                    class=" text-sm cursor-pointer text-blue-600 hover:underline"
                    (click)="
                      handleShowCompliaceValidatedModal(this.selectedRow.id)
                    "
                  >
                    {{ selectedRow?.requestedComplianceLevel?.value }}
                  </li>
                </ul>
                <!-- <ul>
                  @for ( compliance of this.selectedRow.compliances ; track
                  compliance?.id ) { @if(compliance?.complianceStandard.standard
                  !== "NOT SUPPORTED"){
                  <li class=" text-sm ">
                    {{ compliance?.complianceStandard?.standard }}
                  </li>
                  } }
                </ul> -->
              </div>
              }
            </div>
          </div>
        </div>
        <!-- <pre class="code-window">
          {{ computedVc() | json }}
        </pre -->

        @if(computedVc()){
        <pdf-viewer
          [src]="computedVc() ? computedVc() : ''"
          [render-text]="true"
          [stick-to-page]="true"
          [original-size]="false"
          style="width: 100%; height: 80vh;"
        >
        </pdf-viewer>
        }
      </div>

      @if (selectedRow.status == 'IN_PROGRESS' && (user.role == userRole.ADMIN ||
      user.role == userRole.EMPLOYEE)) {
      <p-divider />
      <div>
        <h5 class="m-0 text-xl mb-2">Document Classification</h5>
        <p class="text-sm text-gray-500 mb-4">
          Classify each uploaded document — this drives the compliance criteria
          coverage and the resulting label level (reviewed on Validate).
        </p>
        <div class="flex flex-col gap-3 mb-2">
          @for (profile of selectedRow.complianceProfiles; track profile.id) {
          <div
            class="border rounded-lg p-3 flex flex-col gap-2"
            [class]="pdfSelected?.id == profile.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200'"
          >
            <div class="flex items-center gap-2 cursor-pointer" (click)="handlePdf(profile)">
              <i class="pi pi-file-pdf text-red-500"></i>
              <span class="text-sm font-medium truncate flex-1">{{ profile.fileName }}</span>
              <i class="pi pi-eye text-gray-400 text-xs"></i>
            </div>
            <div class="flex gap-2 flex-wrap" (click)="$event.stopPropagation()">
              <p-dropdown
                [options]="fileTypeOptions"
                [ngModel]="getClassification(profile.id).type"
                (onChange)="onFileTypeChange(profile.id, $event.value)"
                placeholder="Select type"
                styleClass="text-sm"
                appendTo="body"
              />
              @if (getClassification(profile.id).type === 'certificate') {
              <p-dropdown
                [options]="certOptions"
                [ngModel]="getClassification(profile.id).certName"
                (onChange)="onCertChange(profile.id, $event.value)"
                placeholder="Select certificate"
                styleClass="text-sm"
                appendTo="body"
              />
              }
              @if (getClassification(profile.id).type === 'self-attestation') {
              <div class="flex gap-3 flex-wrap pt-1">
                @for (domain of allDomains; track domain) {
                <p-checkbox
                  [ngModel]="isDomainChecked(profile.id, domain)"
                  (onChange)="onDomainToggle(profile.id, domain, $event.checked)"
                  [binary]="true"
                  [label]="domain"
                />
                }
              </div>
              }
              @if (getClassification(profile.id).type === 'discarded') {
              <span class="text-xs text-gray-400 italic self-center">
                Set aside as not valid — excluded from certification; the label is still issued from the remaining documents.
              </span>
              }
            </div>
          </div>
          }
        </div>
      </div>
      }
      }

      <ng-template pTemplate="footer">
        <!-- @if(selectedRow.status !== 'IN_PROGRESS' && (user.role == userRole.ADMIN
        || user.role == userRole.EMPLOYEE)) {
        <p-button
          label="Resend Email"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleResendEmail(selectedRow)"
        ></p-button>
        }
         -->
        @if (selectedRow.status == 'IN_PROGRESS' && (user.role == userRole.ADMIN
        || user.role == userRole.EMPLOYEE)) {
        <p-button
          label="Validate"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          [disabled]="!hasWalletSession() || !allClassificationsComplete()"
          [pTooltip]="validateDisabledReason()"
          tooltipPosition="top"
          (onClick)="handleOpenValidateModal(this.selectedRow)"
        ></p-button>

        <app-modal-reject-product
          [selectedRow]="selectedRow"
          (updateTableFromChild)="eventToParent()"
          (closeModalFromChild)="handleCloseDetailsModal()"
        />

        }
        <!-- @if (selectedRow.status == 'VALIDATED' && (user.role == userRole.ADMIN
        || user.role == userRole.EMPLOYEE)) {
        <p-button
          label="Show Validated Compliances"
          [raised]="true"
          icon="pi pi-info"
          size="small"
          severity="success"
          [loading]="isLoading"
          (onClick)="handleShowCompliaceValidatedModal(this.selectedRow.id)"
        ></p-button>
        } -->

        <!-- <p-button
          label="Close"
          [raised]="true"
          icon="pi pi-times"
          styleClass="p-button-outlined"
          size="small"
          (onClick)="handleCloseDetailsModal()"
        ></p-button> -->
      </ng-template>
    </p-dialog>

    <!-- Second Modal -->
    <p-dialog
      header="Validate Request"
      [(visible)]="secondModal"
      [style]="{ width: '40 vw' }"
      [modal]="true"
      [focusOnShow]="false"
      (onHide)="handleCloseValidateModal()"
    >
      <div class="flex flex-col  ">
        <div class="grid grid-cols-2 gap-8">
          <div>
            <h6 class="text-xl m-0 mb-8">Compliance Validity</h6>
            <div class="flex gap-8 ">
              <div class="flex flex-1 max-w-[46%] ">
                <span class="p-float-label w-full ">
                  <input
                    class="w-full"
                    pInputText
                    id="request_issue_date"
                    [(ngModel)]="request_issue_date"
                    disabled="true"
                  />
                  <label for="request_issue_date">Issue Date *</label>
                </span>
              </div>
              <div class="flex flex-1 max-w-[54%] flex-col">
                <span class="p-float-label w-full">
                  <p-calendar
                    [(ngModel)]="request_expiration_date"
                    [iconDisplay]="'input'"
                    [showIcon]="true"
                    inputId="request_expiration_date"
                    (ngModelChange)="
                      this.invalidForm.request_expiration_date = false
                    "
                    appendTo="body"
                    class="{{
                      invalidForm.request_expiration_date
                        ? 'ng-invalid ng-dirty'
                        : ''
                    }}"
                    dateFormat="yy-mm-dd"
                    [minDate]="currentDate"
                    [style]="{
                      width: '100%',
                      background: 'white',
                      'background-color': 'white'
                    }"
                  />
                  <label for="request_expiration_date">Expiration Date *</label>
                </span>
                @if(invalidForm.request_expiration_date){
                <small class="ml-2 p-error">Required</small>
                }
              </div>
            </div>

            <span class="p-float-label w-full mt-6">
              <input
                class="w-full"
                pInputText
                id="request_issuer_name"
                [(ngModel)]="request_issuer_name"
                disabled="true"
              />
              <label for="request_issuer_name">Issuer *</label>
            </span>
          </div>
        </div>

        <p-divider />

        <div>
          <h6 class="text-xl m-0 mb-4">Compliance Criteria</h6>
          <app-table-compliance-criteria
            [documents]="selectedRow?.complianceProfiles"
            [fileClassifications]="fileClassifications()"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-sm font-bold border {{ certificationLevelStyle() }}">
            {{ certificationLevelLabel() }}
          </span>
          @if(certificationLevelLabel() !== 'Rejected') {
          <p-button
            label="Confirm and validate"
            [raised]="true"
            icon="pi pi-check"
            size="small"
            [loading]="isLoading"
            [disabled]="!allClassificationsComplete()"
            [pTooltip]="allClassificationsComplete() ? '' : 'Classify every uploaded document (or mark it as “Discard”) before confirming.'"
            tooltipPosition="top"
            (onClick)="handleConfirmValidation()"
          ></p-button>
          } @else {
          <app-modal-reject-product
            [selectedRow]="selectedRow"
            (updateTableFromChild)="eventToParent()"
            (closeModalFromChild)="handleCloseValidateModal(); handleCloseDetailsModal()"
          />
          }
        </div>
        <!-- <p-button
          label="Close"
          [raised]="true"
          icon="pi pi-times"
          size="small"
          severity="danger"
          (onClick)="handleCloseValidateModal()"
        ></p-button> -->
      </ng-template>
    </p-dialog>
  `,
})
export class ModalProductDetails implements OnInit {
  private apiServices = inject(ApiServices);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private issuerService = inject(IssuerService);
  private oauthService = inject(CustomOAuthService);
  private dialogService = inject(DialogService);

  modalComplianceValidatedRef: DynamicDialogRef | null = null;

  public vc = signal({} as any | null);
  public vcBlob = signal({} as any | null);
  public compliancesStandards = signal<CompliancesStandards[]>([]);
  @Input() selectedRow!: ResPO;
  @Output() updateTable = new EventEmitter<void>();
  @Output() updateTableFromChild = new EventEmitter<void>();

  visible: boolean = false;
  user: User | null = null;
  userRole = UserRole;

  pdfSelected: any = {};
  computedVc = computed(() => this.vc());
  computedVcBlob = computed(() => this.vcBlob());
  compliances = computed(() => this.compliancesStandards());

  certificationLevelLabel(): string {
    return this.tableCriteria?.certificationLevel() ?? '';
  }

  certificationLevelStyle(): string {
    switch (this.certificationLevelLabel()) {
      case 'Professional Plus': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Professional': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Baseline': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-red-100 text-red-800 border-red-300';
    }
  }

  secondModal = false;
  isLoading = false;
  rejectingLoading = false;
  invalidForm = {
    request_expiration_date: false,
  };
  request_issuer_name = '';
  request_issue_date = '';
  request_expiration_date = moment().add(1, 'year').toDate();
  request_url_organization = '';
  currentDate = new Date();
  // defaultExpirationDate = moment().add(1, 'year').toDate();

  selectedCompliance!: CompliancesStandards[] | [];

  selectedCompliancesWithFilesAssociated: CompliancesToValidate[] = [];

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  @ViewChild('search') searchInput!: ElementRef;

  @ViewChild(TableComplianceCriteriaComponent)
  tableCriteria!: TableComplianceCriteriaComponent;

  fileClassifications = signal<FileClassification[]>([]);
  allDomains = ALL_DOMAINS;
  fileTypeOptions = [
    { label: 'Certificate', value: 'certificate' },
    { label: 'Self-attestation', value: 'self-attestation' },
    { label: 'Discard (not valid)', value: 'discarded' },
  ];
  certOptions = ACCEPTED_CERTIFICATES.map((c) => ({ label: c, value: c }));

  // Product-page gate: every uploaded document must be classified (or discarded) before the
  // certifier can open Validate. Computed here (not read off the child table component) because
  // the table only renders inside the validate modal, so its `allClassificationsComplete()` is
  // unavailable while the certifier is still on the product page.
  allClassificationsComplete = computed(() => allFilesClassified(this.fileClassifications()));

  // Tooltip / disabled reason for the Validate button (wallet first, then classification).
  validateDisabledReason(): string {
    if (!this.hasWalletSession()) {
      return 'DOME Wallet session required. Please log in via DOME Wallet to validate requests.';
    }
    if (!this.allClassificationsComplete()) {
      return 'Classify every uploaded document (or mark it as “Discard”) before validating.';
    }
    return '';
  }

  ngOnInit() {
    this.user = this.authService.getUserFromSessionStorage();
    this.apiServices.getAllCompliancesStandards().subscribe((compliances) => {
      this.compliancesStandards.set(compliances);
    });
  }

  getOrganizationUrl(): string {
    const url = this.selectedRow?.url_organization || '';
    return url.startsWith('http') ? url : `https://${url}`;
  }
  getAllStandards() {
    this.apiServices.getAllCompliancesStandards().subscribe((standards) => {
      this.compliancesStandards.set(standards);
    });
  }

  handleOpen(service: ResPO) {
    this.visible = !this.visible;
    this.selectedRow = service;
    this.pdfSelected = this.selectedRow?.complianceProfiles[0];
    this.handlePdf(this.pdfSelected);
    // Seed classifications on open so the certifier can classify documents on the product page
    // (the selectors now live here, not in the validate modal).
    this.fileClassifications.set(
      (service.complianceProfiles ?? []).map((p) => ({
        profileId: p.id,
        fileName: p.fileName,
        type: null,
        certName: null,
        coveredDomains: [],
      }))
    );
  }

  handleSearch() {
    const searchValue = this.searchInput.nativeElement.value;
    this.pdfComponent.eventBus.dispatch('find', {
      query: searchValue,
      type: 'again',
      caseSensitive: false,
      findPrevious: undefined,
      highlightAll: true,
      phraseSearch: true,
    });
  }

  handlePdf(pdfDetails: any) {
    this.pdfSelected = pdfDetails;
    this.apiServices.getOneVC(pdfDetails?.id).subscribe((vc) => {
      this.vcBlob.set(vc);
      this.vc.set(URL.createObjectURL(vc));
    });
  }

  handleResendEmail(service: ResPO) {
    this.isLoading = true;

    this.apiServices
      .resendEmail(service.id)
      .subscribe({
        next: () => {
          this.visible = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Email sent successfully',
          });
        },
        error: (e) => {
          console.log(e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while sending the email',
          });
        },
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  hasWalletSession(): boolean {
    return !!this.tokenService.getOAuthIdToken();
  }

  handleOpenValidateModal(service: ResPO) {
    const currentDate = moment();
    // Classifications are already set on the product page (handleOpen); the validate modal only
    // reviews the resulting criteria coverage + level and confirms.
    this.secondModal = true;
    this.request_issue_date = currentDate.format('YYYY-MM-DD');
    this.request_issuer_name = this.user.organization_name;
    this.request_url_organization = service.url_organization;
  }

  handleCloseValidateModal() {
    this.selectedCompliance = [];
    this.invalidForm.request_expiration_date = false;
    this.secondModal = false;
    // Do NOT clear classifications here — they belong to the product page and should survive
    // reopening the validate modal. They are cleared when the product details modal closes.
  }
  handleCloseDetailsModal() {
    this.visible = false;
    this.fileClassifications.set([]);
  }

  getClassification(profileId: number): FileClassification {
    return (
      this.fileClassifications().find((fc) => fc.profileId === profileId) ?? {
        profileId,
        fileName: '',
        type: null,
        certName: null,
        coveredDomains: [],
      }
    );
  }

  isDomainChecked(profileId: number, domain: Domain): boolean {
    return this.getClassification(profileId).coveredDomains.includes(domain);
  }

  onFileTypeChange(profileId: number, type: FileType | null) {
    this.fileClassifications.update((list) =>
      list.map((fc) =>
        fc.profileId === profileId
          ? { ...fc, type, certName: null, coveredDomains: [] }
          : fc
      )
    );
  }

  onCertChange(profileId: number, certName: string) {
    this.fileClassifications.update((list) =>
      list.map((fc) => (fc.profileId === profileId ? { ...fc, certName } : fc))
    );
  }

  onDomainToggle(profileId: number, domain: Domain, checked: boolean) {
    this.fileClassifications.update((list) =>
      list.map((fc) => {
        if (fc.profileId !== profileId) return fc;
        const coveredDomains = checked
          ? [...fc.coveredDomains, domain]
          : fc.coveredDomains.filter((d) => d !== domain);
        return { ...fc, coveredDomains };
      })
    );
  }

  handleConfirmValidation() {
    // Validation of expiration date
    this.invalidForm = {
      request_expiration_date: !this.request_expiration_date,
    };

    if (this.invalidForm.request_expiration_date) {
      return;
    }

    if (!this.allClassificationsComplete()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please classify all uploaded documents (or mark them as discarded) before confirming.',
      });
      return;
    }

    // A product that does not reach Baseline (labelCode === null) cannot be issued a
    // label credential — the certifier must reject it instead of validating.
    if (this.tableCriteria.labelCode() === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot validate',
        detail:
          'This product does not meet the Baseline compliance level and cannot be certified. Please reject it instead.',
      });
      return;
    }

    this.isLoading = true;

    // Preparar datos para la llamada
    const data = {
      status: 'VALIDATED',
      expiration_date: this.request_expiration_date,
    };

    // Get data from tableComplianceCriteriaComponent — include every met criterion
    // (both "Yes" and "Yes with Certification") so the VC lists all validated criteria.
    const complianceData = this.tableCriteria
      .getCompliaceData()
      .filter((c) => c.compliance !== 'No')
      .map((cd) => ({
        complianceCriteriaId: cd.id,
        complianceProfileId: cd.document.id,
      }));

    const idToken = this.tokenService.getOAuthIdToken();

    const requestBody = {
      poId: this.selectedRow.id,
      payload: complianceData,
      data,
      validUntil: this.request_expiration_date,
      idToken,
      labelLevel: this.tableCriteria.labelCode(),
      response_uri: `${this.issuerService.marketPlaceURL}/admin/uploadcertificate/urn:ngsi-ld:product-specification:${this.selectedRow.id_PO}`,
    };

    this.issuerService
      .createlabelCredential(requestBody)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Validated',
            detail: 'Service status is Validated',
          });
          this.handleCloseValidateModal();
          this.handleCloseDetailsModal();
          this.updateTable.emit();
        },
        error: (e) => {
          console.error('Error:', e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update service status',
          });
        },
      });
  }

  handleShowCompliaceValidatedModal(productId: number) {
    if (!productId) return;
    // if (
    //   this.userRole.ADMIN !== this.user?.role &&
    //   this.userRole.EMPLOYEE !== this.user?.role
    // ) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'You are not authorized to perform this action',
    //   });
    //   return;
    // }
    this.modalComplianceValidatedRef = this.dialogService.open(
      ModalCompliancesValidatedComponent,
      {
        header: 'Compliances Criteria Validated',
        width: '90%',

        data: {
          productId,
        },
      }
    );
  }

  eventToParent() {
    this.updateTableFromChild.emit();
  }
}
