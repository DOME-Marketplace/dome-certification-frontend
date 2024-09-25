import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
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
import { countries } from '../utils/countries';
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
              <div class="flex gap-8">
                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    id="service-name"
                    formControlName="service_name"
                  />
                  <label for="service-name">Product Name *</label>
                </span>

                <span class="p-float-label ">
                  <p-inputMask
                    formControlName="service_version"
                    class="w-full"
                    id="service-version"
                    mask="9.9"
                  ></p-inputMask>

                  <label class="w-full" for="service-version"
                    >Product Version *</label
                  >
                </span>
              </div>

              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="id_PO"
                  formControlName="id_PO"
                />
                <label for="id_PO">ID *</label>
              </span>

              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="organization-name"
                  formControlName="name_organization"
                />
                <label for="organization-name"
                  >Name of the Organization *</label
                >
              </span>
              <span class="p-float-label w-full">
                <input
                  class="w-full"
                  pInputText
                  id="address"
                  formControlName="address_organization"
                />
                <label for="address">Address *</label>
              </span>

              <div class="flex gap-8">
                <p-dropdown
                  [options]="countries"
                  formControlName="ISO_Country_Code"
                  optionLabel="name"
                  [filter]="true"
                  filterBy="name"
                  [showClear]="true"
                  placeholder="ISO Country Code"
                  styleClass="w-full min-w-[200px]"
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
                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    type="text"
                    id="VAT_ID"
                    formControlName="VAT_ID"
                  />
                  <label for="VAT_ID">VAT ID *</label>
                </span>
              </div>

              <div class="flex gap-8">
                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    type="url"
                    id="website"
                    formControlName="url_organization"
                  />
                  <label for="website">Website of the Organization *</label>
                </span>

                <span class="p-float-label w-full">
                  <input
                    class="w-full"
                    pInputText
                    id="contact-email"
                    formControlName="email_organization"
                  />
                  <label for="contact-email"
                    >Organization Email Contact *</label
                  >
                </span>
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
              uploadStyleClass="py-2 w-[150px]"
              chooseStyleClass="py-2 w-[150px]"
              cancelStyleClass="py-2 w-[146px]"
            >
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

  form = this.fb.group({
    service_name: ['', Validators.required],
    service_version: [null, Validators.required],
    name_organization: ['', Validators.required],
    address_organization: ['', Validators.required],
    ISO_Country_Code: [null, Validators.required],
    id_PO: ['', Validators.required],
    VAT_ID: ['', Validators.required],
    url_organization: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$'
        ),
      ],
    ],
    email_organization: ['', [Validators.required, Validators.email]],
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
  ) {}

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
            summary: 'Éxito',
            detail: 'Formulario enviado exitosamente',
          });
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al enviar formulario',
          });
          this.loading.set(false);
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Por favor complete todos los campos obligatorios correctamente',
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
