import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResPO } from '@models/ProductOffering';
import { Column, ExportColumn } from '@models/Table';
import moment from 'moment';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { cols } from './columns';
import { ApiServices } from '@services/api.service';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Compliaces } from '@models/compliaces.mode';

@Component({
  selector: 'app-dashboard-customer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ContextMenuModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    DialogModule,
    AvatarModule,
    DividerModule,
    TagModule,
    PdfViewerModule,
    InputTextModule,
    MultiSelectModule,
  ],
  template: `
    <p-contextMenu #cm [model]="items"></p-contextMenu>
    <div
      class=" bg-white border border-gray-50  rounded-md px-1 pt-1 w-full z-0"
      style="    border: 1px solid #e5e5e5;"
    >
      <p-table
        #dt
        [columns]="cols"
        [value]="servicesArray()"
        [(contextMenuSelection)]="selectedRow"
        [contextMenu]="cm"
        [tableStyle]="{ 'min-width': '80rem', 'font-size': '14px' }"
        styleClass=" p-datatable-striped "
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [rowsPerPageOptions]="[5, 10, 25]"
        selectionMode="single"
        [(selection)]="selectedRow"
        dataKey="id"
        (onRowSelect)="onRowSelect($event)"
        responsiveLayout="stack"
        [breakpoint]="'900px'"
        [globalFilterFields]="['id_PO', 'service_name', 'status', 'date']"
      >
        <!-- p-input-filled  -->
        <!-- <ng-template pTemplate="caption">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              class="p-inputtext-sm w-full bg-[#fafafa] "
              placeholder="Global Search"
              (input)="dt.filterGlobal($event.target, 'contains')"
            />
          </span>
        </ng-template> -->
        <ng-template pTemplate="header" let-columns>
          <tr>
            @for( col of columns ; track col.field ){
            <th style=" white-space: nowrap " pSortableColumn="{{ col.field }}">
              {{ col.header }} <p-sortIcon field="{{ col.field }}"></p-sortIcon>
            </th>
            }
            <th style="width: 80px;"></th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-service let-ri="rowIndex">
          <tr [pSelectableRow]="service" [pContextMenuRow]="service">
            <td>{{ service.id_PO }}</td>
            <td>{{ service.service_name }}</td>
            <td>{{ service.service_version }}</td>
            <td>
              <p-tag
                class="text-nowrap"
                [value]="service.status"
                [severity]="getSeverity(service.status)"
              ></p-tag>
            </td>
            <td>{{ service.request_date | date }}</td>
            <td>{{ service.issue_date | date }}</td>
            <td>{{ service.expiration_date | date }}</td>
            <td>{{ service.issuer.username }}</td>

            <td>
              <div class="flex items-center justify-center h-4 ">
                <button
                  pButton
                  pRipple
                  type="button"
                  icon="pi pi-external-link"
                  (click)="viewProduct(service)"
                  class="p-button-rounded p-button-text "
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="paginatorleft">
          <!-- <p-button
            type="button"
            icon="pi pi-plus"
            styleClass="p-button-text "
          ></p-button> -->
          <p-button
            label="EXPORT"
            [text]="true"
            icon="pi pi-file-export"
            iconPos="left"
            size="small"
            (click)="dt.exportCSV()"
          ></p-button>
        </ng-template>
      </p-table>
    </div>

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
          <h6 class="text-base m-0">PO Number</h6>
          <p class="mt-0 mb-2">{{ selectedRow.id_PO }}</p>

          <h6 class="text-base m-0">Service Name</h6>
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
          <p class="mt-0 mb-2">-</p>

          }

          <h6 class="text-base m-0">Expiration Date</h6>
          <p class="mt-0 mb-0">{{ selectedRow.expiration_date | date }}</p>

          @if(!selectedRow.expiration_date){
          <p class="mt-0 mb-0">-</p>

          }
          <p-divider />

          <h6 class="text-base m-0">Compliance Profiles</h6>
          <div class="flex items-center justify-start gap-4 mt-4">
            @for ( profile of selectedRow.complianceProfiles ; track profile.id
            ) {
            <div
              class="flex flex-col items-center justify-center cursor-pointer p-2 rounded  {{
                this.pdfSelected.id == profile.id ? ' bg-[#2d58a721]' : ''
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
        @if(this.selectedRow.status == 'REJECTED' ){
        <p-button
          label="Update request"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          [loading]="isLoading"
          (onClick)="handleResendEmail(this.selectedRow)"
        ></p-button>
        }
      </ng-template>
    </p-dialog>
  `,
})
export class DashboardCustomerComponent {
  private services = signal<ResPO[]>([]);
  public vc = signal({} as any | null);
  public vcBlob = signal({} as any | null);
  servicesArray = computed(() => this.services());
  computedVc = computed(() => this.vc());
  computedVcBlob = computed(() => this.vcBlob());
  selectedRow!: ResPO;
  items!: MenuItem[];
  visible: boolean = false;
  secondModal = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  pdfSelected: any;
  value = '';
  isLoading = false;
  rejectingLoading = false;

  invalidForm = false;

  compliances: Compliaces[] = [
    { name: 'ISO 22301:2019' },
    { name: 'ISO/IEC 27000:2018' },
    { name: 'ISO/IEC 27001:2022' },
    { name: 'ISO/IEC 27002:2022' },
    { name: 'ISO/IEC 27701:2019' },
    { name: 'ISO/IEC 27017:2015' },
  ];

  selectedCompliance!: Compliaces[] | [];
  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  @ViewChild('search') searchInput!: ElementRef;

  request_issuer_name = '';
  request_issue_date = '';
  request_expiration_date = '';
  request_url_organization = '';

  clonedProducts: { [s: string]: ResPO } = {};

  constructor(
    private apiServices: ApiServices,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

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
  handleCloseValidateModal() {
    this.secondModal = !this.secondModal;
  }
  onRowSelect(event: any) {
    console.table(event.data);
  }

  handlePdf(pdfDetails: any) {
    this.pdfSelected = pdfDetails;
    this.apiServices.getOneVC(pdfDetails.id).subscribe((vc) => {
      this.vcBlob.set(vc);
      this.vc.set(URL.createObjectURL(vc));
    });
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

  ngOnInit() {
    this.cols = cols;
    this.primengConfig.ripple = true;
    this.primengConfig.inputStyle = 'outlined';
    this.getAllPOs();

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.items = [
      {
        label: 'View',
        icon: 'pi pi-fw pi-search',
        command: () => this.viewProduct(this.selectedRow),
      },

      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: () => this.deleteProduct(this.selectedRow),
      },
    ];
  }
  onRowEditInit(service: ResPO) {
    this.clonedProducts[service.id] = { ...service };
  }

  onRowEditSave(service: ResPO) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Services status is updated',
    });
    console.log(service, 'save');
  }

  viewProduct(service: ResPO) {
    this.pdfSelected = service.complianceProfiles[0];
    this.handlePdf(this.pdfSelected);
    this.showModal(service);
  }

  deleteProduct(service: ResPO) {
    this.services.set(this.services().filter((p) => p.id !== service.id));
    this.messageService.add({
      severity: 'info',
      summary: 'service Deleted',
      detail: `Product Offering: ${service.service_name}`,
    });
  }

  // editStatus(service: ResPO, status: string) {
  //   this.services.set(
  //     this.services().map(
  //       (p) => (p.id === service.id ? { ...p, status } : p) as ResPO
  //     )
  //   );
  // }

  showModal(service: ResPO) {
    this.selectedRow = service;
    this.visible = true;
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

  getAllPOs() {
    this.apiServices.getAllCloudServicesByUserId().subscribe((services) => {
      this.services.set(services);
    });
  }
  sendValidateConfirmation(data, id) {
    this.isLoading = true;

    this.apiServices
      .updateStatus(data, id)
      .subscribe(
        (res) => {
          console.log(res);
          this.handleCloseValidateModal();
          this.getAllPOs();
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Validated',
            detail: 'Service status is Validated',
          });
        },
        (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update service status',
          });
        }
      )
      .add(() => {
        this.isLoading = false;
      });
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

  getSeverity(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return 'info';

      case 'VALIDATED':
        return 'success';

      case 'REJECTED':
        return 'danger';

      case 'EXPIRED':
        return 'error';

      default:
        return 'info';
    }
  }
}
