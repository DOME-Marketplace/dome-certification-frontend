import { PO, ResPO } from '../models/ProductOffering';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
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

  getOneVC(id: number): Observable<Blob> {
    // Para descargar un archivo, esperamos una respuesta de Blob (archivo binario)
    return this.http.get(
      `${environment.API_URL}/api/v1/product-offering/download/${id}`,
      {
        responseType: 'blob',
      }
    );
  }
}
