import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BYPASS_AUTH } from '../interceptors/token.interceptor';
import { environment } from '@env/environment';
import { IssuerCompliance } from '@models/compliances';
import { PO, ResPO } from '@models/ProductOffering';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class IssuerService {
  private http = inject(HttpClient);
  private issuerApi = environment.ISSUER_API;
  private marketPlaceURL = environment.DOME_MARKETPLACE;
  private baseUrl = environment.API_URL;

  createPayload(
    PO: ResPO,
    compliances: IssuerCompliance[],
    expirationDate: Date
  ) {
    const validFrom = moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    const validUntil = moment(expirationDate)
      .utc()
      .format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    return {
      schema: 'VerifiableCertification',
      operation_mode: 'S',
      format: 'jwt_vc_json',
      response_uri: `${this.marketPlaceURL}/admin/uploadcertificate/urn:ngsi-ld:product-specification:${PO.id_PO}`,
      payload: {
        type: ['ProductOfferingCredential'],
        credentialSubject: {
          company: {
            address: PO.address_organization,
            commonName: PO.name_organization,
            country: PO.ISO_Country_Code,
            email: PO.email_organization,
            id: `did:elsi:VAT${PO.ISO_Country_Code}-${PO.vat_ID}`,
            organization: PO.name_organization,
          },
          compliance: compliances,
          product: {
            productId: `urn:ngsi-ld:product-specification:${PO.id_PO}`,
            productName: PO.service_name,
            productVersion: PO.service_version,
          },
        },
        validFrom,
        validUntil,
      },
    };
  }

  issueCertificate(token: string, body: any, idToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-ID-TOKEN': idToken,
    });
    const url = `${this.issuerApi}/issuer-api/vci/v1/issuances/external`;
    // Ignorar el interceptor
    const context = new HttpContext().set(BYPASS_AUTH, true);

    return this.http.post(url, body, { headers, context });
  }

  issuanceCompliances(
    data: any,
    payload: Record<string, any>,
    idToken: string,
    poId: number
  ): Observable<any> {
    const url = `${this.baseUrl}/api/v1/product-offering/issuances`;

    const body = {
      poId,
      idToken,
      payload,
      data,
    };

    return this.http.post(url, body);
  }
}
