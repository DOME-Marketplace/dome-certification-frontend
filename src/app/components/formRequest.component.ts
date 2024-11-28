import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import { countries } from '@utils/countries';
import { InputMaskModule } from 'primeng/inputmask';
import { PO } from '@models/ProductOffering';
import { ApiServices } from '@services/api.service';

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
  styles: `
  .p-dropdown-items-wrapper {
  min-height: 220px;
}
  `,
  template: `
    <div
      class="bg-white border border-gray-50 rounded-md px-6 py-6 w-screen max-w-screen-xl "
      style="border: 1px solid #e5e5e5;"
    >
      <form [formGroup]="form">
        <div class="flex flex-col gap-8 mt-4 md:flex-row">
          <div class="flex flex-col justify-between  flex-1 ">
            <h3 class="text-2xl text-gray-500 font-medium m-0 text-center mb-8">
              Service information
            </h3>
            <div class="flex flex-col gap-8 ">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full">
                  <span class="p-float-label w-full">
                    <input
                      class="w-full"
                      pInputText
                      id="service-name"
                      formControlName="service_name"
                      aria-errormessage="service_name-error"
                    />
                    <label for="service-name">Product Name *</label>
                  </span>
                  @if(form.get('service_name')?.touched &&
                  form.get('service_name')?.hasError('required')){

                  <small id="service_name-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  } @if( form.get('service_name')?.hasError('maxlength')){

                  <small id="service_name-error" class="ml-2 p-error">
                    {{ errorMessages.maxlength }}
                  </small>
                  }
                </div>
                <div class="md:max-w-40 w-full">
                  <span class="p-float-label ">
                    <p-inputMask
                      formControlName="service_version"
                      styleClass="w-full"
                      id="service-version"
                      mask="9.9"
                      aria-errormessage="service_version-error"
                    ></p-inputMask>

                    <label  for="service-version"
                      >Product Version *</label
                    >
                  </span>
                  @if(form.get('service_version')?.touched &&
                  form.get('service_version')?.hasError('required')){

                  <small id="service_version-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  }
                </div>
              </div>
              <div class="w-full">
                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    id="id_PO"
                    formControlName="id_PO"
                    aria-errormessage="id_PO-error"
                  />
                  <label for="id_PO">ID *</label>
                </span>
                @if(form.get('id_PO')?.touched &&
                form.get('id_PO')?.hasError('required')){

                <small id="id_PO-error" class="ml-2 p-error">
                  {{ errorMessages.required }}
                </small>
                } @if( form.get('id_PO')?.hasError('maxlength')){

                <small id="id_PO-error" class="ml-2 p-error">
                  {{ errorMessages.maxlength }}
                </small>
                }
              </div>
              <div class="w-full">
                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    id="organization-name"
                    formControlName="name_organization"
                    aria-errormessage="organization-name-error"
                  />
                  <label for="organization-name"
                    >Name of the Organization *</label
                  >
                </span>

                @if(form.get('name_organization')?.touched &&
                form.get('name_organization')?.hasError('required')){

                <small id="name_organization-error" class="ml-2 p-error">
                  {{ errorMessages.required }}
                </small>
                } @if( form.get('name_organization')?.hasError('maxlength')){

                <small id="name_organization-error" class="ml-2 p-error">
                  {{ errorMessages.maxlength }}
                </small>
                }
              </div>
              <div class="w-full">
                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    id="address"
                    formControlName="address_organization"
                  />
                  <label for="address">Address *</label>
                </span>
                @if(form.get('address_organization')?.touched &&
                form.get('address_organization')?.hasError('required')){

                <small id="address_organization-error" class="ml-2 p-error">
                  {{ errorMessages.required }}
                </small>
                } @if( form.get('address_organization')?.hasError('maxlength')){

                <small id="address_organization-error" class="ml-2 p-error">
                  {{ errorMessages.maxlengthxl }}
                </small>
                }
              </div>

              <div class="flex flex-col md:flex-row gap-8 ">
                <div class="w-full">
                  <p-dropdown
                    [options]="countries"
                    formControlName="ISO_Country_Code"
                    optionLabel="name"
                    [filter]="true"
                    filterBy="name"
                    [panelStyle]="{ 'min-height': '220px' }"
                    [showClear]="true"
                    placeholder="ISO Country Code"
                    styleClass="w-full"
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
                            aria-errormessage="ISO_Country_Code-error"
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
                      <div class="flex items-center gap-2 w-full ">
                        <img
                          src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                          [class]="'flag flag-' + country.code.toLowerCase()"
                          style="width: 18px"
                        />
                        <div>{{ country.name }} - {{ country.code }}</div>
                      </div>
                    </ng-template>
                  </p-dropdown>
                  @if(form.get('ISO_Country_Code')?.touched &&
                  form.get('ISO_Country_Code')?.hasError('required')){

                  <small id="ISO_Country_Code-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  }
                </div>
                <div class="w-full">
                  <span class="p-float-label w-full">
                    <input
                      class="w-full"
                      pInputText
                      type="text"
                      id="VAT_ID"
                      formControlName="VAT_ID"
                      aria-errormessage="VAT_ID-error"
                    />
                    <label for="VAT_ID">VAT ID *</label>
                  </span>
                  @if(form.get('VAT_ID')?.touched &&
                  form.get('VAT_ID')?.hasError('required')){

                  <small id="VAT_ID-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  } @if( form.get('VAT_ID')?.hasError('maxlength')){

                  <small id="VAT_ID-error" class="ml-2 p-error">
                    {{ errorMessages.maxlengthxs }}
                  </small>
                  }
                </div>
              </div>

              <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full">
                  <span class="p-float-label w-full">
                    <input
                      class="w-full"
                      pInputText
                      type="url"
                      id="website"
                      formControlName="url_organization"
                      aria-errormessage="url_organization-error"
                    />
                    <label for="website">Website of the Organization *</label>
                  </span>
                  @if(form.get('url_organization')?.touched &&
                  form.get('url_organization')?.hasError('required')){

                  <small id="url_organization-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  } @if( form.get('url_organization')?.hasError('maxlength')){

                  <small id="url_organization-error" class="ml-2 p-error">
                    {{ errorMessages.maxlength }}
                  </small>
                  } @if(form.get('url_organization')?.touched &&
                  form.get('url_organization')?.hasError('pattern')){

                  <small id="url_organization-error" class="ml-2 p-error">
                    {{ errorMessages.pattern }}
                  </small>
                  }
                </div>
                <div class="w-full">
                  <span class="p-float-label w-full">
                    <input
                      class="w-full"
                      pInputText
                      id="contact-email"
                      formControlName="email_organization"
                      aria-errormessage="email_organization-error"
                    />
                    <label for="contact-email"
                      >Organization Email Contact *</label
                    >
                  </span>
                  @if(form.get('email_organization')?.touched &&
                  form.get('email_organization')?.hasError('required')){

                  <small id="email_organization-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  } @if( form.get('email_organization')?.hasError('maxlength')){

                  <small id="email_organization-error" class="ml-2 p-error">
                    {{ errorMessages.maxlength }}
                  </small>
                  } @if(form.get('email_organization')?.touched &&
                  form.get('email_organization')?.hasError('pattern')){

                  <small id="email_organization-error" class="ml-2 p-error">
                    {{ errorMessages.pattern }}
                  </small>
                  }
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <h3
              class="text-2xl text-gray-500 font-medium m-0 text-center mb-8 "
            >
              Certificates upload
            </h3>
            <p-fileUpload
              #fileUploadComponent
              name="certificates"
              mode="advanced"
              (onSelect)="onFileUpload($event)"
              [multiple]="true"
              accept=".pdf"
              [maxFileSize]="10000000"
              uploadStyleClass="hidden"
              chooseStyleClass="md:min-w-72 md:mr-12 md:ml-2 "
              cancelStyleClass="md:min-w-72 "
            >
              <ng-template pTemplate="file" let-file>
                <div class="flex items-baseline gap-2 mb-4 mr-">
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
            [loading]="loading()"
            [disabled]="loading()"
            class="mt-4"
          ></p-button>
        </div>
      </form>
    </div>
  `,
})
export class FormRequestComponent implements OnInit {
  @ViewChild('fileUploadComponent')
  fileUploadComponent!: FileUpload;

  errorMessages = {
    required: 'Required.',
    maxlength: 'Maximum length of 55 characters exceeded.',
    maxlengthxs: 'Maximum length of 40 characters exceeded.',
    maxlengthxl: 'Maximum length of 100 characters exceeded.',
    pattern: 'Invalid format.',
  };

  form = this.fb.group({
    service_name: ['', [Validators.required, Validators.maxLength(55)]],
    service_version: [null, Validators.required],
    name_organization: ['', [Validators.required, Validators.maxLength(55)]],
    address_organization: [
      '',
      [Validators.required, Validators.maxLength(100)],
    ],
    ISO_Country_Code: [null, Validators.required],
    id_PO: ['', [Validators.required, Validators.maxLength(55)]],
    VAT_ID: ['', [Validators.required, Validators.maxLength(40)]],
    url_organization: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$'
        ),
        Validators.maxLength(55),
      ],
    ],
    email_organization: [
      '',
      [
        Validators.required,
        Validators.maxLength(55),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
  });
  uploadedFiles: any[] = [];
  countries: City[] = countries;
  filterValue!: string;
  //crear un signal para manejar el estado de carga
  loading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private apiService: ApiServices
  ) { }

  ngOnInit() {
    this.countries = this.countries;
  }
  onFileUpload(event: any) {
    this.uploadedFiles = event.currentFiles;
    // Agregar cada archivo nuevo al array uploadedFiles
  }
  submitForm() {
    if (this.form.valid && this.uploadedFiles.length > 0) {
      this.loading.set(true);

      const formData = new FormData();
      formData.append('service_name', this.form.get('service_name')?.value);
      formData.append(
        'service_version',
        this.form.get('service_version')?.value
      );
      formData.append(
        'name_organization',
        this.form.get('name_organization')?.value
      );
      formData.append(
        'address_organization',
        this.form.get('address_organization')?.value
      );
      const ISO_Country_Code: any = this.form.get('ISO_Country_Code')?.value;
      if (ISO_Country_Code) {
        formData.append('ISO_Country_Code', ISO_Country_Code?.code);
      }

      formData.append('id_PO', this.form.get('id_PO')?.value);
      formData.append(
        'url_organization',
        this.form.get('url_organization')?.value
      );
      formData.append(
        'email_organization',
        this.form.get('email_organization')?.value
      );
      formData.append('VAT_ID', this.form.get('VAT_ID')?.value);
      // Append uploaded files to FormData under 'files' key
      if (this.uploadedFiles && this.uploadedFiles.length > 0) {
        this.uploadedFiles.forEach((file, index) => {
          formData.append(`files`, file, file.name);
        });
      }

      // Enviar el formData al servicio para crear una nueva PO
      this.apiService.createPO(formData).subscribe({
        next: (createdPO: PO) => {
          this.form.reset();
          this.fileUploadComponent.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Form sent successfully',
          });
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send form',
          });
          this.loading.set(false);
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Please fill in all the required fields and upload at least one file',
      });
      this.loading.set(false);
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
