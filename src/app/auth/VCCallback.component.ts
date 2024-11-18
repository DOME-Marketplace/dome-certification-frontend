import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-vc-verifier-callback',
  template: `<p>Procesando autenticación...</p>`,
})
export class VCVerifierCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Obtener el código de autorización de los parámetros
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');

    // Valida el estado (opcional)
    const storedState = sessionStorage.getItem('oauthState');
    if (state !== storedState) {
      console.error('Estado inválido, posible ataque CSRF');
      return;
    }

    if (code) {
      this.requestAccessToken(code);
    } else {
      console.error('No se recibió un código de autorización.');
    }
  }

  requestAccessToken(code: string) {
    const tokenEndpoint = `https://dome-certification.dome-marketplace-sbx.org/token`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    });
    const body = `grant_type=authorization_code&code=${code}`;

    this.http.post(tokenEndpoint, body, { headers }).subscribe({
      next: (response: any) => {
        const accessToken = response.access_token;
        console.log('Token de acceso:', accessToken);
        // Decodificar el token y manejar lógica adicional
      },
      error: (error) => {
        console.error('Error al obtener el token:', error);
      },
      complete: () => {
        console.log('Proceso de autenticación completado.');
        // Opcional: redirigir al usuario
        this.router.navigate(['/']);
      },
    });
  }
}
