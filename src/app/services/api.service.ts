import { PO } from '../models/ProductOffering';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiServices {
  private http = inject(HttpClient);

  constructor() {}

  getAllCloudServices() {
    return this.http.get<PO[]>(`${environment.API_URL}/services`);
  }

  getOne(id: number) {
    return this.http.get<PO>(`${environment.API_URL}/services/${id}`);
  }

  getOneVC(id: number) {
    return this.http.get(`${environment.API_URL}/vcs?id=${id}`);
  }
}
