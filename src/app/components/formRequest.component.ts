import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
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
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { validURL } from '@utils/validateUrl';

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
        <div class="grid grid-cols-1 gap-8 mt-4 md:grid-cols-2">
          <div class="flex flex-col  flex-1 ">
            <h3 class="text-2xl text-gray-500 font-medium m-0 text-center mb-8">
              Service information
            </h3>
            <div class="flex flex-col gap-8 ">
              <div class="flex flex-col gap-8">
                <p class="m-0">1. Product Information</p>

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

                <div class="w-full">
                  <span class="p-float-label w-full">
                    <input
                      class="w-full"
                      pInputText
                      id="id_PO"
                      formControlName="id_PO"
                      aria-errormessage="id_PO-error"
                    />
                    <label for="id_PO">Product ID *</label>
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

                <div class="grid md:grid-cols-2 grid-cols-1 gap-8">
                  <span class="p-float-label ">
                    <p-inputMask
                      formControlName="service_version"
                      styleClass="w-full"
                      id="service-version"
                      mask="9.9"
                      aria-errormessage="service_version-error"
                    ></p-inputMask>

                    <label for="service-version">Product Version *</label>
                  </span>
                  @if(form.get('service_version')?.touched &&
                  form.get('service_version')?.hasError('required')){

                  <small id="service_version-error" class="ml-2 p-error">
                    {{ errorMessages.required }}
                  </small>
                  }
                </div>
              </div>

              <div class="flex flex-col gap-8">
                <p class="m-0">2. Compliance Level Information</p>
                <div class="grid md:grid-cols-2 grid-cols-1 gap-8">
                  <div class="w-full">
                    <span class="p-float-label w-full">
                      <p-dropdown
                        id="requested-compliance-level"
                        formControlName="requested_compliance_level"
                        [options]="complianceLevelOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Requested Compliance Level *"
                        styleClass="w-full"
                      />
                      <label for="requested-compliance-level"
                        >Requested Compliance Level *</label
                      >
                    </span>
                    @if(form.get('requested_compliance_level')?.touched &&
                    form.get('requested_compliance_level')?.hasError('required')){
                    <small
                      id="requested_compliance_level-error"
                      class="ml-2 p-error"
                    >
                      {{ errorMessages.required }}
                    </small>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <h3
              class="text-2xl text-gray-500 font-medium m-0 text-center mb-8 "
            >
              Certificates upload *
            </h3>
            <p-fileUpload
              #fileUploadComponent
              name="certificates"
              mode="advanced"
              (onSelect)="onFileUpload($event)"
              [multiple]="true"
              accept=".pdf"
              [maxFileSize]="10000000"
              (onClear)="onFileUploadCancel($event)"
              uploadStyleClass="hidden"
              chooseStyleClass="md:min-w-72 md:mr-12 md:ml-2 "
              cancelStyleClass="md:min-w-72 "
              [ngClass]="{ 'invalid-upload': invalidFileUpload }"
              progressStyleClass="opacity-0"
            >
              <ng-template pTemplate="file" let-file>
                <div class="flex items-baseline gap-2 mb-4 mr-">
                  <i class="pi pi-file-pdf " style="font-size: 1.6rem"></i>
                  <p class="truncate w-9/12 text-base m-0">
                    {{ file.name }}
                  </p>
                  <p class="text-xs m-0 ">
                    ({{ file.size / 1048576 | number : '1.2-2' }} MB)
                  </p>
                </div>
              </ng-template>
              <ng-template pTemplate="content" let-files>
                @if(files.length <= 0){
                <div class="w-full  mt-4 mb-0">
                  <p class="text-center m-0">Drag and drop files here *</p>
                </div>

                }
              </ng-template>
            </p-fileUpload>
            @if(invalidFileUpload){

            <small id="email_organization-error" class="ml-2 mt-2 p-error">
              {{ errorMessages.required }}
            </small>
            }
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
    invalidURL: 'Invalid URL format.',
  };
  urlRegex =
    '^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,}(\\/.*)?$';

  form = this.fb.group({
    service_name: ['', [Validators.required, Validators.maxLength(55)]],
    service_version: [null, Validators.required],
    id_PO: ['', [Validators.required, Validators.maxLength(55)]],
    requested_compliance_level: ['Baseline', Validators.required],
  });
  uploadedFiles: any[] = [];
  countries: City[] = countries;
  filterValue!: string;
  //crear un signal para manejar el estado de carga
  loading = signal<boolean>(false);
  invalidFileUpload = false;

  complianceLevelOptions = [
    { label: 'Baseline', value: 'Baseline' },
    { label: 'Professional', value: 'Professional' },
    { label: 'Professional +', value: 'Professional +' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private apiService: ApiServices,
    private router: Router
  ) {}

  ngOnInit() {
    this.countries = this.countries;
  }
  onFileUpload(event: any) {
    this.invalidFileUpload = false;
    this.uploadedFiles = event.currentFiles;
    // Agregar cada archivo nuevo al array uploadedFiles
  }
  onFileUploadCancel(event: any) {
    this.uploadedFiles = [];
  }

  submitForm() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    // console.log(this.form.get("url_organization")?.invalid);
    // // Si el campo url_organization es inválido, no permitir   submit
    // const urlControl = this.form.get("url_organization");
    // urlControl?.markAsTouched();
    // urlControl?.updateValueAndValidity();
    // console.log(
    //   "url_organization invalid:",
    //   urlControl?.invalid,
    //   "value:",
    //   urlControl?.value
    // );
    // if (urlControl?.invalid) {
    //   this.messageService.add({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Please enter a valid website URL.",
    //   });
    //   return;
    // }

    if (this.form.valid && this.uploadedFiles.length > 0) {
      // Validación de tamaño total
      const maxSizeBytes = 10 * 1024 * 1024; // 10MB
      const totalSize = this.uploadedFiles.reduce(
        (sum, file) => sum + file.size,
        0
      );
      if (totalSize > maxSizeBytes) {
        this.invalidFileUpload = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Total file size exceeds 10MB limit. Please upload smaller files.',
        });
        return;
      }
      this.invalidFileUpload = false;
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
        formData.append('ISO_Country_Code', ISO_Country_Code.code);
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

      this.uploadedFiles.forEach((file) => {
        formData.append('files', file, file.name);
      });

      this.apiService
        .createPO(formData)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (createdPO: PO) => {
            this.form.reset();
            this.fileUploadComponent.clear();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Form sent successfully',
            });
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al enviar formulario:', error);
            let detail = 'Failed to send form';
            if (error?.status === 413) {
              detail =
                'The uploaded files are too large. Please reduce the file size and try again.';
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail,
            });
          },
        });
    } else {
      if (this.uploadedFiles.length === 0) {
        this.invalidFileUpload = true;
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Please fill in all the required fields and upload at least one file',
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
