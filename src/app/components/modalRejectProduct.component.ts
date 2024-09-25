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
      appendTo="body"
      [modal]="true"
      [(visible)]="visible"
      [style]="{ width: '40vw' }"
    >
      <div class="flex flex-col  min-h-64  text-start text-black gap-4">
        <h5 class="text-base text-[#043d75] m-0">
          Enter reason below to reject this request
        </h5>
        <quill-editor
          [(ngModel)]="content"
          placeholder="Insert reason for rejection here"
          [styles]="{ minHeight: '150px' }"
        />
      </div>
      <ng-template pTemplate="footer">
        <p-button
          label="Reject"
          icon="pi pi-times"
          size="small"
          severity="danger"
          (onClick)="handleReject(selectedRow)"
          [loading]="rejectingLoading"
        ></p-button>
        <p-button
          label="Close"
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
  @Output() closeModalFromChild = new EventEmitter<void>();
  @Input() selectedRow!: ResPO;
  content = '';
  visible = false;
  rejectingLoading = false;

  handleReject(service: ResPO) {
    this.rejectingLoading = true;

    this.apiServices
      .updateStatus({ status: 'REJECTED', comments: this.content }, service.id)
      .subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rejected',
            detail: 'Services status is Rejected',
          });
          this.visible = false;
          this.closeModalFromChild.emit();
          this.updateTableFromChild.emit();
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
