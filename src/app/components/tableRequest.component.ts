import { ApiServices } from '@services/api.service';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Column, ExportColumn, ResPO } from '@models/index';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalProductDetails } from '@components/modalProductDetails.component';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { UserRole } from '@models/user.role.model';
import { EmptySvgImageComponent } from '../ui/empty-svg-image.component';
import { ModalCommentsComponent } from './modalComments.component';

@Component({
  selector: 'app-table-request',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    ContextMenuModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    DialogModule,
    AvatarModule,
    DividerModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    ModalProductDetails,
    EmptySvgImageComponent,
    ModalCommentsComponent,
  ],
  template: `
    <p-contextMenu #cm [model]="items"></p-contextMenu>
    <div
      class=" bg-white border border-gray-50  rounded-md px-1 pt-1 w-full z-0 "
    >
      <p-table
        #dt
        class="min-h-[800px]"
        [columns]="cols"
        [value]="productsArray()"
        [(contextMenuSelection)]="selectedRow"
        [contextMenu]="cm"
        [tableStyle]="{
          'min-width': '80rem',
          'font-size': '14px',
          'min-height': productsArray().length < 1 ? '600px' : 'auto',

        }"
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
            <td class="text-nowrap">{{ service.id_PO }}</td>
            <td class="text-nowrap">{{ service.service_name }}</td>
            <td class="text-nowrap">{{ service.service_version }}</td>
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
            <td>{{ service?.issuer?.organization_name || '' }}</td>
            <td>
              @if(service?.comments){
              <p-button
                label="Show"
                [text]="true"
                (onClick)="onModalCommentsToggle(service)"
              />
              }
            </td>

            <td>
              <div class="flex items-center justify-center h-4 ">
                <button
                  pButton
                  pRipple
                  type="button"
                  icon="pi pi-external-link"
                  (click)="showModal(service)"
                  class="p-button-rounded p-button-text "
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="paginatorleft">
          <p-button
            label="REFRESH"
            [text]="true"
            type="button"
            size="small"
            icon="pi pi-refresh"
            styleClass="p-button-text"
            (click)="getAllPOs()"
          ></p-button>
          <p-button
            label="EXPORT"
            [text]="true"
            icon="pi pi-file-export"
            iconPos="left"
            size="small"
            (click)="dt.exportCSV()"
          ></p-button>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <td [attr.colspan]="cols.length + 1">
            <div class="flex justify-center items-center ">
              <app-empty-svg-image />
            </div>
          </td>
        </ng-template>
      </p-table>
    </div>
    <app-modal-product-details
      [selectedRow]="selectedRow"
      (updateTable)="getAllPOs()"
      (updateTableFromChild)="getAllPOs()"
    />
    <app-modal-comments [selectedRow]="selectedRow" />
  `,
})
export class TableRequestComponent implements OnInit {
  private apiServices = inject(ApiServices);
  private primengConfig = inject(PrimeNGConfig);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  private products = signal<ResPO[]>([]);
  productsArray = computed(() => this.products());

  selectedRow!: ResPO;
  items!: MenuItem[];
  cols!: Column[];
  exportColumns!: ExportColumn[];
  user: User | null = null;
  modalShowComment = false;

  @ViewChild(ModalProductDetails) modalProductDetails!: ModalProductDetails;
  @ViewChild(ModalCommentsComponent) modalComments!: ModalCommentsComponent;

  onRowSelect(event: any) {
    // console.log(event.data);
  }

  ngOnInit() {
    this.cols = cols;
    this.primengConfig.ripple = true;
    // this.primengConfig.inputStyle = 'outlined';
    this.user = this.authService.getUserFromSessionStorage();
    this.getAllPOs();

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.items = [
      {
        label: 'View',
        icon: 'pi pi-fw pi-search',
        command: () => this.showModal(this.selectedRow),
      },

      // {
      //   label: 'Delete',
      //   icon: 'pi pi-fw pi-trash',
      //   command: () => this.deleteProduct(this.selectedRow),
      // },
    ];
  }

  onModalCommentsToggle(service: ResPO) {
    this.selectedRow = service;
    this.modalComments.handleToggle();
  }

  getAllPOs() {
    if (
      this.user.role === UserRole.ADMIN ||
      this.user.role === UserRole.EMPLOYEE
    ) {
      this.apiServices.getAllCloudServices().subscribe((res) => {
        this.products.set(res);
      });
    } else {
      this.apiServices.getAllCloudServicesByUserId().subscribe((res) => {
        this.products.set(res);
      });
    }
  }

  deleteProduct(product: ResPO) {
    this.products.set(this.products().filter((p) => p.id !== product.id));
    this.messageService.add({
      severity: 'info',
      summary: 'service Deleted',
      detail: `Product Offering: ${product.service_name}`,
    });
  }

  showModal(service: ResPO) {
    this.selectedRow = service;
    this.modalProductDetails.handleOpen(service);
  }
  showModalComment(service: ResPO) {
    this.selectedRow = service;
    this.modalShowComment = !this.modalShowComment;
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
        return 'warning'; // Cambiado de 'error' a 'warning'

      default:
        return 'info';
    }
  }
}

const cols = [
  { field: 'id_PO', header: 'PO ID' },
  { field: 'service_name', header: 'Name' },
  { field: 'service_version', header: 'Ver.' },
  { field: 'status', header: 'Status' },
  { field: 'request_date', header: 'Request Date' },
  { field: 'issue_date', header: 'Issue Date' },
  { field: 'expiration_date', header: 'Exp. Date' },
  { field: 'issuer', header: 'Issuer' },
  { field: 'comments', header: 'Comments' },
];
