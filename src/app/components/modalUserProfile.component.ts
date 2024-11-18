import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '@models/user.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-user-profile',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      header="User Profile"
      appendTo="body"
      [modal]="true"
      [(visible)]="visible"
      [style]="{ width: '20vw' }"
    >
      <div class="flex flex-col text-start text-black gap-4">
        <div class="flex justify-between">
          <span class="font-bold">Username:</span>
          <span>{{ user?.username }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">First Name:</span>
          <span>{{ user?.firstname }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Last Name:</span>
          <span>{{ user?.lastname }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Country Code:</span>
          <span>{{ user?.country_code }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Address:</span>
          <span>{{ user?.address }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Organization:</span>
          <span>{{ user?.organization_name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-bold">Website:</span>
          <span>{{ user?.website }}</span>
        </div>
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
export class ModalUserProfile {
  visible = false;

  @Input() user!: User;

  handleToggle() {
    this.visible = !this.visible;
  }
}
