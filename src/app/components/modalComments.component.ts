import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ResPO } from '@models/ProductOffering';
import { QuillViewComponent } from 'ngx-quill';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-comments',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, QuillViewComponent],
  template: `
    <p-dialog
      header="Request comments"
      appendTo="body"
      [modal]="true"
      [(visible)]="visible"
      [style]="{ width: '40vw' }"
    >
      <div class="flex flex-col  min-h-20  text-start text-black gap-4">
        <quill-view [content]="selectedRow?.comments" />
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Close"
          icon="pi pi-times"
          styleClass="p-button-outlined"
          size="small"
          (onClick)="handleToggle()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ModalCommentsComponent {
  visible = false;
  @Input() selectedRow!: ResPO;

  handleToggle() {
    this.visible = !this.visible;
  }
}
