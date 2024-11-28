import { PO, ResPO } from '@models/ProductOffering';
import { HttpClient, } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiServices {
  private http = inject(HttpClient);

  getAllCloudServices(): Observable<ResPO[]> {
    return this.http.get<ResPO[]>(
      `${environment.API_URL}/api/v1/product-offering/`
    );
  }
  getAllCloudServicesByUserId(): Observable<ResPO[]> {
    return this.http.get<ResPO[]>(
      `${environment.API_URL}/api/v1/product-offering/get-by-user-id`
    );
  }

  getOne(id: number): Observable<ResPO> {
    return this.http.get<ResPO>(
      `${environment.API_URL}/api/v1/product-offering/${id}`
    );
  }

  createPO(formData: FormData): Observable<PO> {
    // URL para enviar el nuevo ProductOffering
    const url = `${environment.API_URL}/api/v1/product-offering/create`;

    // Configurar cabeceras para indicar que se envía un formulario
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data',
    // });

    // Enviar la solicitud POST para crear un nuevo PO
    return this.http.post<PO>(url, formData);
  }

  updateStatus(data: any, id: number): Observable<PO> {
    const url = `${environment.API_URL}/api/v1/product-offering/status-PO/${id}`;

    return this.http.post<PO>(url, data);
  }

  getOneVC(id: number): Observable<Blob> {
    // Para descargar un archivo, esperamos una respuesta de Blob (archivo binario)
    return this.http.get(
      `${environment.API_URL}/api/v1/product-offering/download/${id}`,
      {
        responseType: 'blob',
      }
    );
  }
  resendEmail(id: number): Observable<string> {
    const url = `${environment.API_URL}/api/v1/product-offering/resend-email/${id}`;
    return this.http.post(url, {}, { responseType: 'text' });
  }
}
