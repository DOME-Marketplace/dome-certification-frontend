import { UserRole } from './../models/user.role.model';
import { compliances } from './../utils/compliances';
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
import { PO, ResPO } from '@models/ProductOffering';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Compliaces } from '@models/compliaces.mode';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { ModalRejectProductComponent } from './modalRejectProduct.component';

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
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [maximizable]="true"
      [modal]="true"
      [style]="{ width: '69vw' }"
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
        <div class="w-full max-w-md">
          <h6 class="text-base m-0">Product Offering Id</h6>
          <p class="mt-0 mb-2">{{ selectedRow.id_PO }}</p>

          <h6 class="text-base m-0">Product Offering Name</h6>
          <p class="mt-0 mb-2">{{ selectedRow.service_name }}</p>

          <h6 class="text-base m-0">Product Offering Version</h6>
          <p class="mt-0 mb-2">{{ selectedRow.service_version }}</p>

          <h6 class="text-base m-0">Name of the organization</h6>
          <p class="mt-0 mb-2">{{ selectedRow.name_organization }}</p>
          <h6 class="text-base m-0">VAT ID</h6>
          <p class="mt-0 mb-2">{{ selectedRow.VAT_ID }}</p>

          <h6 class="text-base m-0">ISO Country Code</h6>
          <p class="mt-0 mb-2">{{ selectedRow.ISO_Country_Code }}</p>

          <h6 class="text-base m-0">Address</h6>
          <p class="mt-0 mb-2">{{ selectedRow.address_organization }}</p>

          <h6 class="text-base m-0">Website of the organization</h6>
          <a
            class="mt-0 mb-2 no-underline  text-sky-950"
            href="{{ selectedRow.url_organization }}"
            >{{ selectedRow.url_organization }}
            <i class="pi pi-external-link ml-1 text-xs"></i
          ></a>

          <h6 class="text-base m-0 mt-2">Organization email contact</h6>
          <a
            class="mt-0 mb-2 text no-underline text-sky-950"
            href="mailto:{{ selectedRow.email_organization }}"
            >{{ selectedRow.email_organization }}
            <i class="pi pi-external-link ml-1 text-xs"></i>
          </a>

          <h6 class="text-base m-0 mt-2">Request Date</h6>
          <p class="mt-0 mb-2">{{ selectedRow.request_date | date }}</p>

          <h6 class="text-base m-0">Status</h6>
          <p class="mt-0 mb-2">{{ selectedRow.status }}</p>

          @if(selectedRow.issue_date && selectedRow.status !== 'REJECTED'){
          <h6 class="text-base m-0">Issue Date</h6>
          <p class="mt-0 mb-2">{{ selectedRow.issue_date | date }}</p>
          } @if(selectedRow.expiration_date && selectedRow.status !==
          'REJECTED'){
          <h6 class="text-base m-0">Expiration Date</h6>
          <p class="mt-0 mb-0">{{ selectedRow.expiration_date | date }}</p>
          }

          <p-divider />

          <h6 class="text-base m-0">Compliance Profiles</h6>
          <div class="grid grid-cols-3 gap-4 mt-4">
            @for ( profile of selectedRow.complianceProfiles ; track profile.id
            ) {
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
              Size: ({{ computedVcBlob().size / 1048576 | number : '1.2-2' }}
              MB)
            </li>
          </ul>

          } @if(this.selectedRow.status == 'VALIDATED' ){
          <p-divider />
          <div class="flex flex-col  mt-4">
            <h6 class="text-base m-0">Compliances Validated</h6>

            <ul>
              @for ( compliance of this.selectedRow.compliances ; track
              compliance.id ) {
              <li class=" text-sm ">
                {{ compliance.complianceName }}
              </li>

              }
            </ul>
          </div>
          }
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
          (onClick)="handleValidate(this.selectedRow, 'validated')"
        ></p-button>

        <app-modal-reject-product
          [selectedRow]="selectedRow"
          (updateTableFromChild)="eventToParent()"
          (closeModalFromChild)="handleCloseDetailsModal()"
        />

        }

        <p-button
          label="Close"
          [raised]="true"
          icon="pi pi-times"
          styleClass="p-button-outlined"
          size="small"
          (onClick)="handleCloseDetailsModal()"
        ></p-button>
      </ng-template>
    </p-dialog>

    <!-- Second Modal -->
    <p-dialog
      header="Validate Request"
      [(visible)]="secondModal"
      [style]="{ width: '50vw' }"
      [modal]="true"
    >
      <div class="flex flex-col gap-6 ">
        <div>
        <p-multiSelect
          class=" w-full  {{ invalidForm.selectedCompliance ? 'ng-invalid ng-dirty' : '' }}"
          appendTo="body"
          inputId="compliance"
          [options]="compliances"
          styleClass="w-full"
          
          placeholder="Select Compliances"
          optionLabel="name"
          [(ngModel)]="selectedCompliance"
          (onChange)="this.invalidForm.selectedCompliance = false"
          [style]="{ width: '100%' }"
          [panelStyle]="{ width: '100%' }"
        />

        @if(invalidForm.selectedCompliance){
            <small class="ml-2 p-error">Required</small>
          }

          </div>

        <div class="flex gap-8 mt-6">
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
<div class= "w-full">
  
  <span class="p-float-label w-full">
    <p-calendar
    [(ngModel)]="request_expiration_date"
              [iconDisplay]="'input'"
              [showIcon]="true"
              inputId="request_expiration_date"
              (ngModelChange)="this.invalidForm.request_expiration_date = false"
              appendTo="body"
              class="{{ invalidForm.request_expiration_date ? 'ng-invalid ng-dirty' : '' }}"
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
      <ng-template pTemplate="footer">
        <p-button
          label="Confirm and validate"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleConfirmValidation()"
        ></p-button>
        <p-button
          label="Close"
          [raised]="true"
          icon="pi pi-times"
          size="small"
          severity="danger"
          (onClick)="handleCloseValidateModal()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ModalProductDetails implements OnInit {
  private apiServices = inject(ApiServices);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  public vc = signal({} as any | null);
  public vcBlob = signal({} as any | null);
  @Input() selectedRow: any = {};
  @Output() updateTable = new EventEmitter<void>();
  @Output() updateTableFromChild = new EventEmitter<void>();

  visible: boolean = false;
  user: User | null = null;
  userRole = UserRole;

  pdfSelected: any = {};
  computedVc = computed(() => this.vc());
  computedVcBlob = computed(() => this.vcBlob());
  compliances = compliances;

  secondModal = false;
  isLoading = false;
  rejectingLoading = false;
  invalidForm = {
    selectedCompliance: false,
    request_expiration_date: false,
  };
  request_issuer_name = '';
  request_issue_date = '';
  request_expiration_date = '';
  request_url_organization = '';
  currentDate = new Date();

  selectedCompliance!: Compliaces[] | [];

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  @ViewChild('search') searchInput!: ElementRef;

  ngOnInit() {
    this.user = this.authService.getUserFromSessionStorage();
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

  handleValidate(service: ResPO, status: string) {
    // this.visible = false;

    const currentDate = moment();

    // Calcular la fecha de expiración (2 años después)
    const expirationDate = currentDate.add(2, 'years');
    const expirationDateString = expirationDate.format('YYYY-MM-DD');

    // Convertir la fecha de expiración a una cadena en formato deseado
    this.secondModal = true;
    this.request_issue_date = currentDate.format('YYYY-MM-DD');
    this.request_issuer_name = this.user.organization_name;
    this.request_url_organization = service.url_organization;
  }

  sendValidateConfirmation(data, id) {
    this.isLoading = true;

    this.apiServices.updateStatus(data, id).subscribe({
      complete: () => {
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
      next: () => {
        this.isLoading = false;
      },
    });
  }
  eventToParent() {
    this.updateTableFromChild.emit();
  }

  handleConfirmValidation() {
    if (!this.selectedCompliance || this.selectedCompliance.length === 0) {
      this.invalidForm.selectedCompliance = true;

    }
    if (!this.request_expiration_date) {
      this.invalidForm.request_expiration_date = true;

    }
    if (this.invalidForm.selectedCompliance || this.invalidForm.request_expiration_date) {
      return;
    }

    const data = {
      status: 'VALIDATED',
      expiration_date: this.request_expiration_date,
      compliances: this.selectedCompliance.map((compliance) => compliance.name),
    };
    this.sendValidateConfirmation(data, this.selectedRow.id);
  }

  handleCloseValidateModal() {
    this.selectedCompliance = [];
    this.request_expiration_date = '';
    this.invalidForm.selectedCompliance = false;
    this.invalidForm.request_expiration_date = false;
    this.secondModal = !this.secondModal;
  }
  handleCloseDetailsModal() {
    this.visible = !this.visible;
  }
}
