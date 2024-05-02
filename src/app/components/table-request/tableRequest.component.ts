import { ApiServices } from '../../services/api.service';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { Column, ExportColumn, PO } from '@models/index';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { cols } from './columns';
import { TagModule } from 'primeng/tag';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-table-request',
  standalone: true,
  template: `
    <p-contextMenu #cm [model]="items"></p-contextMenu>
    <div
      class=" bg-white border border-gray-50  rounded-md px-1 pt-1 w-full"
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
            <td>{{ service.request_date }}</td>
            <td>{{ service.issue_date }}</td>
            <td>{{ service.expiration_date }}</td>
            <td>{{ service.issuer }}</td>

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
          <p class="mt-0 mb-2">{{ selectedRow.url_organization }}</p>

          <h6 class="text-base m-0">Organization email contact</h6>
          <p class="mt-0 mb-2">{{ selectedRow.email_organization }}</p>

          <h6 class="text-base m-0">Status</h6>
          <p class="mt-0 mb-2">{{ selectedRow.status }}</p>

          <h6 class="text-base m-0">Date</h6>
          <p class="mt-0 mb-2">{{ selectedRow.request_date }}</p>
          <p-divider />

          <h6 class="text-base m-0">Files</h6>
          <div class="flex items-center justify-start gap-4 mt-4">
            <div
              class="flex flex-col items-center justify-center cursor-pointer p-2 rounded  {{
                this.pdfSrc ==
                '../../../assets/pdf/DOME_PressRelease_ProjectLaunch.pdf'
                  ? ' bg-[#2d58a721]'
                  : ''
              }} "
              (click)="
                handlePdf(
                  '../../../assets/pdf/DOME_PressRelease_ProjectLaunch.pdf'
                )
              "
            >
              <i class="pi pi-file-pdf" style="font-size: 2rem"></i>
              <p class="truncate w-32 text-sm mb-0">
                {{ selectedRow.id_PO }}.pdf
              </p>
            </div>
            <div
              class="flex flex-col items-center justify-center cursor-pointer p-2 rounded {{
                this.pdfSrc ==
                '../../../assets/pdf/CORDIS_programme_H2020_DT-NMBP-40-2020_en.pdf'
                  ? ' bg-[#2d58a721]'
                  : ''
              }}"
              (click)="
                handlePdf(
                  '../../../assets/pdf/CORDIS_programme_H2020_DT-NMBP-40-2020_en.pdf'
                )
              "
            >
              <i class="pi pi-file-pdf" style="font-size: 2rem"></i>
              <p class="truncate w-32 text-sm mb-0">
                {{ selectedRow.service_name }}.pdf
              </p>
            </div>
          </div>
          <p-divider />

          @if(pdfSrc){
          <ul>
            <li class="text-sm">{{ pdfSrc.split('/').pop() }}</li>
            <li class="text-sm">size: 2.1mb</li>
          </ul>

          }
        </div>

        <!-- <pre class="code-window">
          {{ computedVc() | json }}
        </pre -->

        <pdf-viewer
          [src]="
            pdfSrc || '../../../assets/pdf/DOME_PressRelease_ProjectLaunch.pdf'
          "
          [render-text]="true"
          [original-size]="false"
          style="width: 100%; height: 80vh;"
        >
        </pdf-viewer>
      </div>
      }

      <ng-template pTemplate="footer">
        <p-button
          label="Validate"
          [raised]="true"
          icon="pi pi-check"
          size="small"
          (onClick)="handleValidate(this.selectedRow, 'validated')"
        ></p-button>
        <p-button
          label="Reject"
          [raised]="true"
          icon="pi pi-times"
          size="small"
          severity="danger"
          (onClick)="handleReject(this.selectedRow, 'rejected')"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
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
  ],
})
export class TableRequestComponent implements OnInit {
  private services = signal<PO[]>([]);
  private vc = signal({} as any | null);
  servicesArray = computed(() => this.services());
  computedVc = computed(() => this.vc());
  selectedRow!: PO;
  items!: MenuItem[];
  visible!: boolean;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  pdfSrc = '';
  value = '';

  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  @ViewChild('search') searchInput!: ElementRef;

  clonedProducts: { [s: string]: PO } = {};

  constructor(
    private apiServices: ApiServices,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  onRowSelect(event: any) {
    console.table(event.data);
  }
  handlePdf(file: string) {
    this.pdfSrc = file;
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
    this.pdfSrc = '../../../assets/pdf/DOME_PressRelease_ProjectLaunch.pdf';
    this.primengConfig.ripple = true;
    this.primengConfig.inputStyle = 'outlined';
    this.apiServices.getAllCloudServices().subscribe((services) => {
      this.services.set(services);
    });
    this.apiServices.getOneVC(1).subscribe((vc) => {
      this.vc.set(vc);
    });

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
  onRowEditInit(service: PO) {
    this.clonedProducts[service.id] = { ...service };
  }

  onRowEditSave(service: PO) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Services status is updated',
    });
    console.log(service, 'save');
  }

  viewProduct(service: PO) {
    this.showModal(service);
  }

  deleteProduct(service: PO) {
    this.services.set(this.services().filter((p) => p.id !== service.id));
    this.messageService.add({
      severity: 'info',
      summary: 'service Deleted',
      detail: `Product Offering: ${service.service_name}`,
    });
  }

  editStatus(service: PO, status: string) {
    this.services.set(
      this.services().map(
        (p) => (p.id === service.id ? { ...p, status } : p) as PO
      )
    );
  }

  showModal(service: PO) {
    this.selectedRow = service;
    this.visible = true;
  }

  handleValidate(service: PO, status: string) {
    this.visible = false;

    this.editStatus(service, status);
    this.messageService.add({
      severity: 'success',
      summary: 'Validated',
      detail: 'Services status is Validated',
    });
  }

  handleReject(service: PO, status: string) {
    this.visible = false;
    this.editStatus(service, status);
    this.messageService.add({
      severity: 'success',
      summary: 'Rejected',
      detail: 'Services status is Rejected',
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'in progress':
        return 'info';

      case 'validated':
        return 'success';

      case 'rejected':
        return 'danger';

      default:
        return 'info';
    }
  }
}
