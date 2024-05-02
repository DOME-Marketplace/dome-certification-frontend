import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getLocalStorageItem(module: string): any {
    return JSON.parse(localStorage.getItem(module)!);
  }

  public setLocalStorageItem(module: string, value: any) {
    localStorage.setItem(module, JSON.stringify(value));
  }
  public removeLocalStorageItem(module: string) {
    localStorage.removeItem(module);
  }
}
