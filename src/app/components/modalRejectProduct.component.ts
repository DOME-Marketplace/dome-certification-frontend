import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResPO } from '@models/ProductOffering';
import { ApiServices } from '@services/api.service';
import { QuillEditorComponent } from 'ngx-quill';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-reject-product',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    QuillEditorComponent,
    FormsModule,
  ],
  template: `
    <p-button
      label="Reject"
      [raised]="true"
      icon="pi pi-times"
      size="small"
      severity="danger"
      (onClick)="visible = true"
      [loading]="rejectingLoading"
    ></p-button>
    <p-dialog
      header="Reject Request"
      [(visible)]="visible"
      [style]="{ width: '50vw' }"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
    >
      <quill-editor [(ngModel)]="content" />
      <ng-template pTemplate="footer">
        <p-button
          label="Reject"
          [raised]="true"
          icon="pi pi-times"
          size="small"
          severity="danger"
          (onClick)="handleReject(selectedRow)"
          [loading]="rejectingLoading"
        ></p-button>
        <p-button
          label="Close"
          [raised]="true"
          icon="pi pi-times"
          styleClass="p-button-outlined"
          size="small"
          (onClick)="visible = false"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ModalRejectProductComponent {
  private apiServices = inject(ApiServices);
  private messageService = inject(MessageService);
  @Output() updateTableFromChild = new EventEmitter<void>();
  @Input() selectedRow!: ResPO;
  content = 'editor';
  visible = false;
  rejectingLoading = false;

  handleReject(service: ResPO) {
    this.updateTableFromChild.emit();
    return;
    this.rejectingLoading = true;

    this.apiServices
      .updateStatus({ status: 'REJECTED' }, service.id)
      .subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rejected',
            detail: 'Services status is Rejected',
          });
          // this.updateTableFromChild.emit();
          // this.handleCloseDetailsModal();
        },
        error: (e) => {
          console.error('Error:', e);
          this.messageService.add({
            severity: 'warning',
            summary: 'Connection Error',
            detail: 'Failed to connect with server',
          });
        },
        next: () => {
          this.rejectingLoading = false;
        },
      });
  }
}
