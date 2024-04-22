import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import { countries } from './countries';
import { InputMaskModule } from 'primeng/inputmask';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-form-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    DropdownModule,
    InputMaskModule,
  ],
  template: `
    <div
      class="bg-white border border-gray-50 rounded-md px-6 py-6 w-screen max-w-screen-xl "
      style="border: 1px solid #e5e5e5;"
    >
      <form [formGroup]="form">
        <!-- <h3 class="text-2xl text-gray-500 font-medium m-0 text-center">
          New certification request
        </h3> -->
        <div class="flex gap-8 mt-4">
          <div class="flex flex-col justify-between  flex-1 ">
            <h3 class="text-2xl text-gray-500 font-medium m-0 text-center mb-8">
              Service information
            </h3>
            <div class="flex flex-col gap-8 ">
              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="organization-name"
                  formControlName="organizationName"
                />
                <label for="organization-name"
                  >Name of the Organization *</label
                >
              </span>

              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="service-name"
                  formControlName="serviceName"
                />
                <label for="service-name">Service Name *</label>
              </span>

              <div class="flex gap-8">
                <p-dropdown
                  [options]="countries"
                  formControlName="isoCountryCode"
                  optionLabel="name"
                  [filter]="true"
                  filterBy="name"
                  [showClear]="true"
                  placeholder="ISO Country Code"
                  styleClass="w-full min-w-[500px]"
                >
                  <ng-template pTemplate="filter" let-options="options">
                    <div class="flex gap-1 px-1 w-full ">
                      <div
                        class="p-inputgroup px-1"
                        (click)="$event.stopPropagation()"
                      >
                        <span class="p-inputgroup-addon p-2 px-1">
                          <i class="pi pi-search"></i>
                        </span>
                        <input
                          type="text"
                          pInputText
                          placeholder="Filter"
                          class="p-2"
                          (keyup)="customFilterFunction($event, options)"
                        />
                      </div>
                      <button
                        pButton
                        class="p-2"
                        icon="pi pi-times"
                        (click)="resetFunction(options)"
                        severity="secondary"
                      ></button>
                    </div>
                  </ng-template>
                  <ng-template pTemplate="selectedItem" let-selectedOption>
                    <div class="flex items-center gap-2 w-full">
                      <img
                        src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                        [class]="
                          'flag flag-' + selectedOption.code.toLowerCase()
                        "
                        style="width: 18px"
                      />
                      <div>{{ selectedOption.name }}</div>
                    </div>
                  </ng-template>
                  <ng-template let-country pTemplate="item">
                    <div class="flex items-center gap-2 w-full">
                      <img
                        src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                        [class]="'flag flag-' + country.code.toLowerCase()"
                        style="width: 18px"
                      />
                      <div>{{ country.name }} - {{ country.code }}</div>
                    </div>
                  </ng-template>
                </p-dropdown>

                <span class="p-float-label ">
                  <p-inputMask
                    formControlName="serviceVersion"
                    class="w-full"
                    id="service-version"
                    mask="9.9"
                  ></p-inputMask>

                  <label class="w-full" for="service-version"
                    >Service Version *</label
                  >
                </span>
              </div>

              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="address"
                  formControlName="address"
                />
                <label for="address">Address *</label>
              </span>

              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  type="url"
                  id="website"
                  formControlName="website"
                />
                <label for="website">Website of the Organization *</label>
              </span>

              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="contact-email"
                  formControlName="contactEmail"
                />
                <label for="contact-email">Organization Email Contact *</label>
              </span>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <h3
              class="text-2xl text-gray-500 font-medium m-0 text-center mb-8 "
            >
              Certificates upload
            </h3>
            <p-fileUpload
              name="certificates"
              mode="advanced"
              url="/upload"
              [multiple]="true"
              accept=".pdf"
              [maxFileSize]="1000000"
              uploadStyleClass="py-2 w-[150px]"
              chooseStyleClass="py-2 w-[150px]"
              cancelStyleClass="py-2 w-[146px]"
            >
              <ng-template pTemplate="toolbar"> </ng-template>
              <ng-template pTemplate="file" let-file>
                <div class="flex items-baseline gap-2 mb-4">
                  <i class="pi pi-file-pdf " style="font-size: 1.6rem"></i>
                  <p class="truncate w-9/12 text-base m-0">
                    {{ file.name }}
                  </p>
                  <p class="text-xs m-0 font-bold">
                    ({{ file.size / 1048576 | number : '1.2-2' }} MB)
                  </p>
                </div>
              </ng-template>
              <ng-template pTemplate="content" let-files>
                @if(files.length <= 0){
                <div class="w-full  mt-4 mb-0">
                  <p class="text-center m-0">Drag and drop files here</p>
                </div>

                }
              </ng-template>
            </p-fileUpload>
          </div>
        </div>
        <div class="mt-8">
          <p-button
            label="Submit"
            (onClick)="submitForm()"
            class="mt-4"
          ></p-button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './form-request.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRequestComponent implements OnInit {
  form = this.fb.group({
    serviceName: ['', Validators.required],
    serviceVersion: [null, Validators.required],
    organizationName: ['', Validators.required],
    address: ['', Validators.required],
    isoCountryCode: [null, Validators.required],
    website: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$'
        ),
      ],
    ],
    contactEmail: ['', [Validators.required, Validators.email]],
  });
  uploadedFiles: any[] = [];
  countries: City[] = countries;
  filterValue!: string;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.countries = this.countries;
  }

  submitForm() {
    if (this.form.valid) {
      // post data
      console.log(this.form.value);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all the mandatory fields correctly.',
      });
    }
  }

  customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
    options.filter(event);
  }

  resetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
  }
}
