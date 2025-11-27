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
import { DropdownModule } from 'primeng/dropdown';
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
    DropdownModule,
    CalendarModule,
    ModalRejectProductComponent,
    ModalRejectProductComponent,
    PropertiesComponent,
    TableComplianceCriteriaComponent,
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
                label="Requested Compliances Level"
                [value]="
                  selectedRow.requestedComplianceLevel?.value || 'No specified'
                "
              />
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
          <h6 class="text-xl m-0 mb-8">Compliance Criteria</h6>
          <app-table-compliance-criteria
            [documents]="selectedRow?.complianceProfiles"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Confirm and validate"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleConfirmValidation()"
        ></p-button>
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

  handleOpenValidateModal(service: ResPO) {
    const currentDate = moment();
    // Convertir la fecha de expiración a una cadena en formato deseado
    this.secondModal = true;
    this.request_issue_date = currentDate.format('YYYY-MM-DD');
    this.request_issuer_name = this.user.organization_name;
    this.request_url_organization = service.url_organization;
  }

  handleCloseValidateModal() {
    this.selectedCompliance = [];
    this.invalidForm.request_expiration_date = false;
    this.secondModal = false;
  }
  handleCloseDetailsModal() {
    this.visible = false;
  }

  handleConfirmValidation() {
    // Validation of expiration date
    this.invalidForm = {
      request_expiration_date: !this.request_expiration_date,
    };

    if (this.invalidForm.request_expiration_date) {
      return;
    }

    this.isLoading = true;

    // Preparar datos para la llamada
    const data = {
      status: 'VALIDATED',
      expiration_date: this.request_expiration_date,
    };

    // Get data from tableComplianceCriteriaComponent
    const complianceData = this.tableCriteria
      .getCompliaceData()
      .filter((c) => c.compliance === 'Yes')
      .map((cd) => ({
        complianceCriteriaId: cd.id,
        complianceProfileId: cd.document.id,
      }));

    const idToken = this.tokenService.getOAuthIdToken();
    // const idToken =
    //   'eyJraWQiOiJkaWQ6a2V5OnpEbmFlWmYxOHNuSGpQd2tvSEJwMkRCVUVmVFpLNU5KZEJYM0Z2QjVqcUZCbnB1Ym8iLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlYzEzUFpRRFVxdHVucTdzdGNHR2k0dk4xeWRURG85eU16d3pqc1BXcG5uVGUiLCJ2Y19qc29uIjoie1wiQGNvbnRleHRcIjpbXCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjJcIixcImh0dHBzOi8vd3d3LmRvbWUtbWFya2V0cGxhY2UuZXUvMjAyNS9jcmVkZW50aWFscy9sZWFyY3JlZGVudGlhbGVtcGxveWVlL3YyXCJdLFwiY3JlZGVudGlhbFN1YmplY3RcIjp7XCJtYW5kYXRlXCI6e1wiaWRcIjpcIjAxZGRlZTE4LWU4NGQtNDJhNi1iODc1LWIzZTljNmNjZTViNVwiLFwibWFuZGF0ZWVcIjp7XCJlbWFpbFwiOlwiYW50b25pby5hbHZhcmV6QGRla3JhLmNvbVwiLFwiZmlyc3ROYW1lXCI6XCJBbnRvbmlvXCIsXCJmaXJzdF9uYW1lXCI6XCJBbnRvbmlvXCIsXCJpZFwiOlwiZGlkOmtleTp6RG5hZWMxM1BaUURVcXR1bnE3c3RjR0dpNHZOMXlkVERvOXlNend6anNQV3BublRlXCIsXCJsYXN0TmFtZVwiOlwiQWx2YXJleiBMb3BlelwiLFwibGFzdF9uYW1lXCI6XCJBbHZhcmV6IExvcGV6XCIsXCJuYXRpb25hbGl0eVwiOlwiU3BhaW5cIn0sXCJtYW5kYXRvclwiOntcImNvbW1vbk5hbWVcIjpcIk5vZWxpYSBHdWVycmEgTWVsZ2FyZXNcIixcImNvdW50cnlcIjpcIlNwYWluXCIsXCJlbWFpbEFkZHJlc3NcIjpcIm5vZWxpYS5ndWVycmFAZGVrcmEuY29tXCIsXCJvcmdhbml6YXRpb25cIjpcIkRFS1JBIFRlc3RpbmcgYW5kIENlcnRpZmljYXRpb24sIFMuQS5VLlwiLFwib3JnYW5pemF0aW9uSWRlbnRpZmllclwiOlwiVkFURVMtQTI5NTA3NDU2XCIsXCJzZXJpYWxOdW1iZXJcIjpcIlwifSxcInBvd2VyXCI6W3tcImFjdGlvblwiOltcIlVwbG9hZFwiLFwiQXR0ZXN0XCJdLFwiZG9tYWluXCI6XCJET01FXCIsXCJmdW5jdGlvblwiOlwiQ2VydGlmaWNhdGlvblwiLFwiaWRcIjpcImE0ZThkYzY2LTIxNWQtNGIwMy05MDM2LTFmYWY1MzZmYmUwZlwiLFwidG1mX2FjdGlvblwiOltcIlVwbG9hZFwiLFwiQXR0ZXN0XCJdLFwidG1mX2RvbWFpblwiOlwiRE9NRVwiLFwidG1mX2Z1bmN0aW9uXCI6XCJDZXJ0aWZpY2F0aW9uXCIsXCJ0bWZfdHlwZVwiOlwiRG9tYWluXCIsXCJ0eXBlXCI6XCJEb21haW5cIn1dfX0sXCJkZXNjcmlwdGlvblwiOlwiVmVyaWZpYWJsZSBDcmVkZW50aWFsIGZvciBlbXBsb3llZXMgb2YgYW4gb3JnYW5pemF0aW9uXCIsXCJpZFwiOlwiN2VhYmMyZjQtY2M1Mi00OWM1LWExZGYtOTI2ZmFhYTAwY2ViXCIsXCJpc3N1ZXJcIjp7XCJjb21tb25OYW1lXCI6XCJTZWFsIFNpZ25hdHVyZSBDcmVkZW50aWFscyBpbiBTQlggZm9yIHRlc3RpbmdcIixcImNvdW50cnlcIjpcIkVTXCIsXCJlbWFpbEFkZHJlc3NcIjpcIm5vZWxpYS5ndWVycmFAZGVrcmEuY29tXCIsXCJpZFwiOlwiZGlkOmVsc2k6VkFURVMtQjYwNjQ1OTAwXCIsXCJvcmdhbml6YXRpb25cIjpcIklOMlwiLFwib3JnYW5pemF0aW9uSWRlbnRpZmllclwiOlwiVkFURVMtQjYwNjQ1OTAwXCIsXCJzZXJpYWxOdW1iZXJcIjpcIkI0NzQ0NzU2MFwifSxcInR5cGVcIjpbXCJMRUFSQ3JlZGVudGlhbEVtcGxveWVlXCIsXCJWZXJpZmlhYmxlQ3JlZGVudGlhbFwiXSxcInZhbGlkRnJvbVwiOlwiMjAyNS0wNi0xMFQxMDowMjoyNy44NTY1NzU2MThaXCIsXCJ2YWxpZFVudGlsXCI6XCIyMDI2LTA2LTEwVDEwOjAyOjI3Ljg1NjU3NTYxOFpcIn0iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly92ZXJpZmllci5kb21lLW1hcmtldHBsYWNlLWRldjIub3JnIiwiZ2l2ZW5fbmFtZSI6IkFudG9uaW8iLCJub25jZSI6IlgweE9aM2xQWlhoc1N6UkdlVll4Tm5sWGIzSkJZMk5ETVRreU1rZExOVkF4YXk0elIzTnNhMGxETlZWViIsImF1ZCI6ImRpZDprZXk6ekRuYWVtdUZ6R25iZVNweEdVS21YTW8zNTROaHZpdmZhbzNVanJOcUx5SktYMzRndyIsImFjciI6IjAiLCJhdXRoX3RpbWUiOjE3NjM2NTk4MzMsIm5hbWUiOiJBbnRvbmlvIEFsdmFyZXogTG9wZXoiLCJleHAiOjE3NjM2NTk4OTMsImlhdCI6MTc2MzY1OTgzMywiZmFtaWx5X25hbWUiOiJBbHZhcmV6IExvcGV6IiwiZW1haWwiOiJhbnRvbmlvLmFsdmFyZXpAZGVrcmEuY29tIn0.BrsSgtA0fDweYqvilgDSqWR-2t-aOLEJTJa1lD59sp8-o7bvKBCkRecOWXiWRKG82xRMz_w1pfE3_D-9AFDRtQ';
    if (!idToken) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'You are not logged with DOME-WALLET or your session has expired.',
      });
      this.isLoading = false;
      return;
    }

    const requestBody = {
      poId: this.selectedRow.id,
      payload: complianceData,
      data,
      validUntil: this.request_expiration_date,
      idToken,
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
