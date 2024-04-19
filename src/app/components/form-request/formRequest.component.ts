import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

interface Certificates {
  name: string;
  code: string;
}

@Component({
  selector: 'app-form-request',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    MultiSelectModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
  ],
  template: `
    <div
      class=" bg-white border border-gray-50  rounded-md px-6 py-6 w-[998px]"
      style="    border: 1px solid #e5e5e5;"
    >
      <form>
        <div class="flex flex-col justify-between gap-6">
          <h3 class="text-xl text-gray-500 font-medium m-0">
            New service certificate request
          </h3>

          <div class="flex justify-between items-center gap-6">
            <span class="p-float-label w-full">
              <input class="w-full" pInputText id="service-provider" />
              <label for="service-provider">Service Provider</label>
            </span>
            <span class="p-float-label w-full">
              <input class="w-full" pInputText id="cloud-service" />
              <label for="cloud-service">Cloud Service</label>
            </span>
          </div>
          <div class="flex justify-between items-center gap-6">
            <span class="p-float-label w-full">
              <input class="w-full" pInputText id="address" />
              <label for="address">Billing Address</label>
            </span>
          </div>
          <div class="p-float-label w-full">
            <p-dropdown
              [options]="certificates"
              [(ngModel)]="selectedCertificates"
              optionLabel="name"
              [filter]="true"
              filterBy="name"
              [showClear]="true"
              placeholder="Select a certificate"
              name="certificate"
              class="w-full"
              styleClass="w-full"
            >
              <ng-template pTemplate="selectedItem" let-selectedOption>
                <div class="flex items-center gap-2 w-full">
                  <div>{{ selectedOption.name }}</div>
                </div>
              </ng-template>
              <ng-template let-certificate pTemplate="item">
                <div class="flex items-center gap-2 w-full">
                  <div>{{ certificate.name }}</div>
                </div>
              </ng-template>
            </p-dropdown>
            <label for="certificate">Select a certificate</label>
          </div>

          <p-button label="Submit"></p-button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './form-request.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRequestComponent implements OnInit {
  certificates!: Certificates[];

  selectedCertificates!: Certificates[];

  ngOnInit() {
    this.certificates = [
      {
        name: 'Amazon Web Services Certified Solutions Architect',
        code: 'AWS-CSA',
      },
      { name: 'Microsoft Certified: Azure Administrator', code: 'MCA-Azure' },
      { name: 'Google Cloud Professional Cloud Architect', code: 'GCP-PCA' },
      {
        name: 'IBM Certified Solution Advisor - Cloud Computing Architecture',
        code: 'IBM-CCSA',
      },
      {
        name: 'Oracle Cloud Infrastructure Certified Architect Associate',
        code: 'OCI-CAA',
      },
    ];
  }
}
