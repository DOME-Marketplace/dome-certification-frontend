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
                value="Baseline"
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
                  @for ( compliance of this.selectedRow.compliances ; track
                  compliance?.id ) { @if(compliance?.complianceStandard.standard
                  !== "NOT SUPPORTED"){
                  <li class=" text-sm ">
                    {{ compliance?.complianceStandard?.standard }}
                  </li>
                  } }
                </ul>
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
        @if(selectedRow.status !== 'IN_PROGRESS' && (user.role == userRole.ADMIN
        || user.role == userRole.EMPLOYEE)) {
        <p-button
          label="Resend Email"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleResendEmail(selectedRow)"
        ></p-button>
        } @if (selectedRow.status == 'IN_PROGRESS' && (user.role ==
        userRole.ADMIN || user.role == userRole.EMPLOYEE)) {
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
      [style]="{ width: '36vw' }"
      [modal]="true"
      (onHide)="handleCloseValidateModal()"
    >
      <div class="flex flex-col  ">
        <div>
          <h6 class="text-base m-0 mb-4">Compliance uploads</h6>
          <div class="flex flex-col gap-2 w-full">
            @for ( profile of selectedRow?.complianceProfiles ; track
            profile.id; ) {
            <div class="flex items-center flex-1 max-w-1/2 gap-2">
              <a
                class="flex my-0 flex-1 max-w-1/2 flex-row items-center gap-2 no-underline text-base m-0 text-[#043d75] truncate"
                href="{{ profile?.url }}"
                target="_blank"
              >
                <i
                  class="pi pi-file-pdf text-[#043d75]"
                  style="font-size: 2rem "
                ></i>
                <span class="truncate max-w-1/2 w-full ">
                  {{ profile?.fileName }}
                </span>
              </a>
              <div class="flex-1 ">
                @if(selectedRow?.compliances ){

                <p-dropdown
                  class="w-full"
                  [options]="compliances()"
                  placeholder="Add compliance *"
                  (onChange)="onOptionChange(profile, $event.value)"
                  optionLabel="standard"
                  styleClass="w-full"
                  [showClear]="true"
                  [panelStyle]="{ width: '100%' }"
                  [id]="'dropdown-' + profile?.id"
                  class="{{
                    invalidForm.selectedCompliance ? 'ng-invalid ng-dirty' : ''
                  }}"
                />

                } @if(invalidForm.selectedCompliance){
                <small class="ml-2 p-error">Required</small>
                }
              </div>
            </div>
            }
          </div>
        </div>
        <p-divider class="" />
        <div>
          <h6 class="text-base m-0 mb-8">Compliance validity</h6>
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
    selectedCompliance: false,
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
  onOptionChange(
    profile: ComplianceProfile,
    dropdownValue: CompliancesStandards
  ) {
    this.invalidForm.selectedCompliance = false;
    const handleCompliancesToValidate: CompliancesToValidate = {
      description: dropdownValue.description,
      hash: profile.hash,
      profileId: profile.id,
      standard: dropdownValue.standard,
      standardId: dropdownValue.id,
    };
    this.selectedCompliancesWithFilesAssociated = [
      ...this.selectedCompliancesWithFilesAssociated.filter(
        ({ profileId: id }) => id !== profile.id
      ),
      handleCompliancesToValidate,
    ];
    console.log(this.selectedCompliancesWithFilesAssociated);
  }

  handleCloseValidateModal() {
    this.selectedCompliance = [];
    this.invalidForm.selectedCompliance = false;
    this.invalidForm.request_expiration_date = false;
    this.secondModal = false;
  }
  handleCloseDetailsModal() {
    this.visible = false;
  }

  handleConfirmValidation() {
    console.log(this.selectedCompliancesWithFilesAssociated);

    // Validar form
    this.invalidForm = {
      selectedCompliance:
        !this.selectedCompliancesWithFilesAssociated ||
        this.selectedCompliancesWithFilesAssociated.length !==
          this.selectedRow?.complianceProfiles.length,
      request_expiration_date: !this.request_expiration_date,
    };

    if (
      this.invalidForm.selectedCompliance ||
      this.invalidForm.request_expiration_date
    ) {
      return;
    }

    this.isLoading = true;

    // Preparar datos para la llamada
    const data = {
      status: 'VALIDATED',
      expiration_date: this.request_expiration_date,
      compliances: this.selectedCompliancesWithFilesAssociated.map(
        (compliance) => ({
          profileId: compliance.profileId,
          standardId: compliance.standardId,
        })
      ),
    };

    const idToken = this.tokenService.getOAuthIdToken();
    // const idToken =
    //   'eyJraWQiOiJkaWQ6a2V5OnpEbmFldk44NVo3VkpnY0JvUWVxUVU3ZDhrWnB1VmhEU2RtOGhRdEpZV2p2ZWszVkwiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlUzVZWXlCdlpNaWpIckNLQnV6YTIyOEY1YlVCTG1EYW5XeW5CVGpldks5cEUiLCJ2Y19qc29uIjoie1wiQGNvbnRleHRcIjpbXCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjJcIixcImh0dHBzOi8vdHJ1c3QtZnJhbWV3b3JrLmRvbWUtbWFya2V0cGxhY2UuZXUvY3JlZGVudGlhbHMvbGVhcmNyZWRlbnRpYWxlbXBsb3llZS92MVwiXSxcImNyZWRlbnRpYWxTdWJqZWN0XCI6e1wibWFuZGF0ZVwiOntcImlkXCI6XCI4NjBiOWY2ZC00OTg1LTRkNWUtOTY4ZC0wOTI4NWZlMzJjODJcIixcImxpZmVfc3BhblwiOntcImVuZF9kYXRlX3RpbWVcIjpcIjIwMjYtMDEtMjNUMDg6NTI6MDIuNzU3NjMzNTYyWlwiLFwic3RhcnRfZGF0ZV90aW1lXCI6XCIyMDI1LTAxLTIzVDA4OjUyOjAyLjc1NzYzMzU2MlpcIn0sXCJtYW5kYXRlZVwiOntcImVtYWlsXCI6XCJhbnRvbmlvLmFsdmFyZXpAZGVrcmEuY29tXCIsXCJmaXJzdF9uYW1lXCI6XCJBbnRvbmlvXCIsXCJpZFwiOlwiZGlkOmtleTp6RG5hZVM1WVl5QnZaTWlqSHJDS0J1emEyMjhGNWJVQkxtRGFuV3luQlRqZXZLOXBFXCIsXCJsYXN0X25hbWVcIjpcIkFsdmFyZXogTG9wZXpcIixcIm1vYmlsZV9waG9uZVwiOlwiKzM0IDY2NDc0MDA2MVwifSxcIm1hbmRhdG9yXCI6e1wiY29tbW9uTmFtZVwiOlwiTm9lbGlhIEd1ZXJyYSBNZWxnYXJlc1wiLFwiY291bnRyeVwiOlwiU3BhaW5cIixcImVtYWlsQWRkcmVzc1wiOlwibm9lbGlhLmd1ZXJyYUBkZWtyYS5jb21cIixcIm9yZ2FuaXphdGlvblwiOlwiREVLUkEgVGVzdGluZyBhbmQgQ2VydGlmaWNhdGlvbiwgUy5BLlUuXCIsXCJvcmdhbml6YXRpb25JZGVudGlmaWVyXCI6XCJWQVRFUy1BMjk1MDc0NTZcIixcInNlcmlhbE51bWJlclwiOlwiNTMzNzE4ODhDXCJ9LFwicG93ZXJcIjpbe1wiaWRcIjpcIjU0Mzk4YWZlLWNjYzYtNDQ0YS1iZDUxLWQwMjU3NzZiNDRhYlwiLFwidG1mX2FjdGlvblwiOltcIlVwbG9hZFwiLFwiQXR0ZXN0XCJdLFwidG1mX2RvbWFpblwiOlwiRE9NRVwiLFwidG1mX2Z1bmN0aW9uXCI6XCJDZXJ0aWZpY2F0aW9uXCIsXCJ0bWZfdHlwZVwiOlwiRG9tYWluXCJ9XSxcInNpZ25lclwiOntcImNvbW1vbk5hbWVcIjpcIlpFVVMgT0xJTVBPU1wiLFwiY291bnRyeVwiOlwiRVVcIixcImVtYWlsQWRkcmVzc1wiOlwiZG9tZXN1cHBvcnRAaW4yLmVzXCIsXCJvcmdhbml6YXRpb25cIjpcIk9MSU1QT1wiLFwib3JnYW5pemF0aW9uSWRlbnRpZmllclwiOlwiVkFURVUtQjk5OTk5OTk5XCIsXCJzZXJpYWxOdW1iZXJcIjpcIklEQ0VVLTk5OTk5OTk5UFwifX19LFwiaWRcIjpcIjMxN2Y4ZWRmLTU4YzUtNDgxYS04YjgwLTkzY2UyNzIyNmFlMFwiLFwiaXNzdWVyXCI6XCJkaWQ6ZWxzaTpWQVRFVS1COTk5OTk5OTlcIixcInR5cGVcIjpbXCJMRUFSQ3JlZGVudGlhbEVtcGxveWVlXCIsXCJWZXJpZmlhYmxlQ3JlZGVudGlhbFwiXSxcInZhbGlkRnJvbVwiOlwiMjAyNS0wMS0yM1QwODo1MjowMi43NTc2MzM1NjJaXCIsXCJ2YWxpZFVudGlsXCI6XCIyMDI2LTAxLTIzVDA4OjUyOjAyLjc1NzYzMzU2MlpcIn0iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly92ZXJpZmllci5kb21lLW1hcmtldHBsYWNlLXNieC5vcmciLCJnaXZlbl9uYW1lIjoiQW50b25pbyIsIm5vbmNlIjoiV1ZReFZYVTFVMmhpTUVkYUxsSXVhV3gtYVV3eFRGTllTRTQwVkZacE1tMDJNM1ZvU1dKRFJUVk5lbFpqIiwiYXVkIjoiZGlkOmtleTp6RG5hZWhta0Vob3liTGdSa1ZiS3BBdjQ3VnU4MVJ3NVRtTFVBNVByUkt1V1NiaHhuIiwiYWNyIjoiMCIsImF1dGhfdGltZSI6MTc0NDM2MDA1MywibmFtZSI6IkFudG9uaW8gQWx2YXJleiBMb3BleiIsImV4cCI6MTc0NDM2MDExMywiaWF0IjoxNzQ0MzYwMDUzLCJmYW1pbHlfbmFtZSI6IkFsdmFyZXogTG9wZXoiLCJlbWFpbCI6ImFudG9uaW8uYWx2YXJlekBkZWtyYS5jb20ifQ.fHca5WPUhN7cvyr_MO3ak3_WBip59BpZz2FmES9DKSGOE1M65FmFIEizR44cpLn8wXcn1oTkvv22p9-7L4wHOw';

    if (!idToken) {
      console.error('Please retry login');
      this.isLoading = false;
      return;
    }

    const compliances = this.selectedCompliancesWithFilesAssociated
      .filter((c) => c.standard !== 'NOT SUPPORTED')
      .map<IssuerCompliance>((c) => ({
        hash: c.hash,
        scope: c.description,
        standard: c.standard,
      }));

    const payload = this.issuerService.createPayload(
      this.selectedRow,
      compliances,
      this.request_expiration_date
    );
    console.log(payload);
    this.issuerService
      .issuanceCompliances(data, payload, idToken, this.selectedRow.id)
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

  eventToParent() {
    this.updateTableFromChild.emit();
  }
}
