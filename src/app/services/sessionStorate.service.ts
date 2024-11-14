import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  public getSessionStorageItem(module: string): any {
    return JSON.parse(sessionStorage.getItem(module)!);
  }

  public setSessionStorageItem(module: string, value: any) {
    sessionStorage.setItem(module, JSON.stringify(value));
  }
  public removeSessionStorageItem(module: string) {
    sessionStorage.removeItem(module);
  }
}
