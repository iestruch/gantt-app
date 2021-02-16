import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  static setLocalStorageItem(name, value):void {
    localStorage.setItem(`gantt:${name}`, JSON.stringify(value));
  }
  static getLocalStorageItem(name): any {
    const value =  localStorage.getItem(`gantt:${name}`);
    if (!value) { return null;}
    return JSON.parse(value);
  }
  static clearLocalStorage(): void {
    for (const key in localStorage) {
      const isKeyProject = (/gantt\:/).test(key);
      if (isKeyProject) {
        localStorage.removeItem(key);
      }
    }
  }
}
