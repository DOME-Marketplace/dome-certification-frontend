import { PO, ResPO } from '@models/ProductOffering';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CompliancesStandards } from '@models/compliances';

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

  getAllCompliancesStandards(): Observable<CompliancesStandards[]> {
    return this.http.get<CompliancesStandards[]>(
      `${environment.API_URL}/api/v1/compliance-standards/`
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
    const url = `${environment.API_URL}/api/v1/product-offering/create`;
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
