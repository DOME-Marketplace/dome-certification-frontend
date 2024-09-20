import { compliances } from './../utils/compliances';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnInit,
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
import { Compliaces } from '@models/compliaces.mode';
import { catchError, finalize, of, tap } from 'rxjs';

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
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [maximizable]="true"
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

          <h6 class="text-base m-0">Name</h6>
          <p class="mt-0 mb-2">{{ selectedRow.service_name }}</p>

          <h6 class="text-base m-0">Name of the organization</h6>
          <p class="mt-0 mb-2">{{ selectedRow.name_organization }}</p>

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

          @if(!selectedRow.request_date){
          <p class="mt-0 mb-2">nd</p>

          }

          <h6 class="text-base m-0">Status</h6>
          <p class="mt-0 mb-2">{{ selectedRow.status }}</p>

          <h6 class="text-base m-0">Issue Date</h6>
          <p class="mt-0 mb-2">{{ selectedRow.issue_date | date }}</p>

          @if(!selectedRow.issue_date){
          <p class="mt-0 mb-2">nd</p>

          }

          <h6 class="text-base m-0">Expiration Date</h6>
          <p class="mt-0 mb-0">{{ selectedRow.expiration_date | date }}</p>

          @if(!selectedRow.expiration_date){
          <p class="mt-0 mb-0">nd</p>

          }
          <p-divider />

          <h6 class="text-base m-0">Compliance Profiles</h6>
          <div class="flex items-center justify-start gap-4 mt-4">
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
        @if(this.selectedRow.status == 'VALIDATED' || this.selectedRow.status ==
        'REJECTED'){
        <p-button
          label="Resend Email"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleResendEmail(this.selectedRow)"
        ></p-button>
        } @else {
        <p-button
          label="Validate"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleValidate(this.selectedRow, 'validated')"
        ></p-button>
        <p-button
          label="Reject"
          [raised]="true"
          icon="pi pi-times"
          size="small"
          severity="danger"
          (onClick)="handleReject(this.selectedRow)"
          [loading]="rejectingLoading"
        ></p-button>
        }
      </ng-template>
    </p-dialog>

    <!-- Second Modal -->
    <p-dialog
      header="Validate Request"
      [(visible)]="secondModal"
      [style]="{ width: '50vw' }"
      [modal]="true"
    >
      <div class="flex flex-col gap-8 ">
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

          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="request_expiration_date"
              [(ngModel)]="request_expiration_date"
              disabled="true"
            />
            <label for="request_expiration_date">Expiration Date *</label>
          </span>
        </div>

        <span class="p-float-label w-full">
          <input
            class="w-full"
            pInputText
            id="request_issuer_name"
            [(ngModel)]="request_issuer_name"
            disabled="true"
          />
          <label for="request_issuer_name">Issuer *</label>
        </span>

        <div class="flex gap-8">
          <p-multiSelect
            class="{{ this.invalidForm ? 'ng-invalid ng-dirty' : '' }}"
            appendTo="body"
            [options]="compliances"
            placeholder="Select a Compliance Profile *"
            optionLabel="name"
            [(ngModel)]="selectedCompliance"
            (onChange)="this.invalidForm = false"
          ></p-multiSelect>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="request_url_organization"
              [(ngModel)]="request_url_organization"
              disabled="true"
            />
            <label for="request_url_organization">Website *</label>
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
export class ModalProductDetails {
  private apiServices = inject(ApiServices);
  private messageService = inject(MessageService);
  public vc = signal({} as any | null);
  public vcBlob = signal({} as any | null);
  @Input() selectedRow: any = {};
  visible: boolean = false;

  pdfSelected: any = {};
  computedVc = computed(() => this.vc());
  computedVcBlob = computed(() => this.vcBlob());
  compliances = compliances;

  secondModal = false;
  isLoading = false;
  rejectingLoading = false;
  invalidForm = false;
  request_issuer_name = '';
  request_issue_date = '';
  request_expiration_date = '';
  request_url_organization = '';

  selectedCompliance!: Compliaces[] | [];

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  @ViewChild('search') searchInput!: ElementRef;

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

    // TODO: Implement resend email
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Email sent successfully',
    });

    this.visible = false;
    this.isLoading = false;

    // this.apiServices
    //   .resendEmail(service.id)
    //   .subscribe({
    //     next: () => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Success',
    //         detail: 'Email sent successfully',
    //       });
    //     },
    //     error: () => {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: 'An error occurred while sending the email',
    //       });
    //     },
    //   })
    //   .add(() => {
    //     this.isLoading = false;
    //   });
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
    this.request_issuer_name = service.issuer.username;
    this.request_url_organization = service.url_organization;
    this.request_expiration_date = expirationDateString;
  }

  handleReject(service: ResPO) {
    this.rejectingLoading = true;

    this.apiServices
      .updateStatus({ status: 'REJECTED' }, service.id)
      .subscribe(
        (res) => {
          console.log(res);

          this.messageService.add({
            severity: 'success',
            summary: 'Rejected',
            detail: 'Services status is Rejected',
          });
          this.getAllPOs();
          this.visible = false;
        },
        (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'warning',
            summary: 'Connection Error',
            detail: 'Failed to connect with server',
          });
        }
      )
      .add(() => {
        this.rejectingLoading = false;
      });
  }

  getAllPOs() {
    this.apiServices.getAllCloudServices().subscribe((services) => {
      //   this.services.set(services);
    });
  }

  sendValidateConfirmation(data, id) {
    this.isLoading = true;

    this.apiServices
      .updateStatus(data, id)
      .pipe(
        tap((res) => {
          this.isLoading = false;
          this.handleCloseValidateModal();
          this.visible = false;
          // this.getAllPOs();
          console.log(res);
          console.log(this.isLoading);
          console.log(this.secondModal);
          this.messageService.add({
            severity: 'success',
            summary: 'Validated',
            detail: 'Service status is Validated',
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update service status',
          });
          return of(null); // Retorna un observable vacío para continuar el flujo
        }),
        finalize(() => {
          this.isLoading = false; // Se ejecuta independientemente del resultado
        })
      )
      .subscribe();
  }

  handleConfirmValidation() {
    console.log(this.selectedCompliance);
    if (!this.selectedCompliance) {
      this.invalidForm = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one compliance',
      });
      return;
    }

    const data = {
      status: 'VALIDATED',
      compliances: this.selectedCompliance.map((compliance) => compliance.name),
    };
    this.sendValidateConfirmation(data, this.selectedRow.id);
  }

  handleCloseValidateModal() {
    this.secondModal = !this.secondModal;
  }
}
