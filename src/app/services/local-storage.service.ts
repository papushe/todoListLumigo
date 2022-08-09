import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  static setItem(key: string, value: any): void {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  static getItem(key: string): any {
    const value = localStorage.getItem(key) || '';
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  static clear(): void {
    localStorage.clear();
  }
}
