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
