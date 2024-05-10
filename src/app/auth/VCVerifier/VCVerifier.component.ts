import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-vcverifier',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="text-center">
      <p-button
        pRipple
        [outlined]="true"
        severity="contrast"
        styleClass=" w-full text-black border-black"
        label="Continue with DOME"
        (click)="initiateAuthentication()"
      >
        <img
          src="../../../assets/img/logo-dome-color.png"
          width="20px"
          height="20px"
          class="mr-2"
      /></p-button>
    </div>
  `,
})
export class VCVerifierComponent {
  private http = inject(HttpClient);

  initiateAuthentication() {
    // Generar un UUID único para usar como valor de state
    const state = uuidv4();

    // URL y parámetros para abrir la ventana emergente de VCVerifier
    const vcVerifierUrl =
      'https://verifier.dome-marketplace.org/api/v1/loginQR';
    const clientCallback = 'https://dome-marketplace.org/auth/vc/callback';
    const clientId = 'marketplace-client';

    const loginUrl = `${vcVerifierUrl}?state=${state}&client_callback=${clientCallback}&client_id=${clientId}`;

    const width = 640;
    const height = 460;

    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 4;
    const windowFeatures = `width=${width},height=${height},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=${left},top=${top}`;

    // Abrir una nueva ventana emergente para iniciar la autenticación

    const authWindow = window.open(loginUrl, '_blank', windowFeatures);

    // Manejar la respuesta de VCVerifier después de la autenticación
    window.addEventListener('message', (event) => {
      if (event.origin === 'https://dome-marketplace.org') {
        // Recibir el código de autorización de VCVerifier
        const code = event.data.code;

        // Intercambiar el código de autorización por un token de acceso
        this.requestAccessToken(code);
      }
    });
  }

  requestAccessToken(code: string) {
    const tokenEndpoint = 'https://verifier.dome-marketplace.org/token';
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    });

    const body = `grant_type=authorization_code&code=${code}`;

    // Enviar una solicitud POST para obtener el token de acceso
    this.http.post(tokenEndpoint, body, { headers }).subscribe(
      (response: any) => {
        // Manejar la respuesta del token de acceso
        const accessToken = response.access_token;

        // Decodificar el token de acceso para obtener la LEARCredential
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const learCredential = payload.LEARCredential;

        // Utilizar la LEARCredential en tu lógica de aplicación
        console.log('User capabilities:', learCredential.power);
        console.log('Mandatee:', learCredential.mandatee);
        console.log('Mandator:', learCredential.mandator);
      },
      (error) => {
        console.error('Error al obtener el token de acceso:', error);
      }
    );
  }
}
