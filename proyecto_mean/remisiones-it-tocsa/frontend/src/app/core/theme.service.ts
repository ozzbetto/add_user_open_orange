import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = signal<boolean>(false);
  darkMode = this._darkMode.asReadonly();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    }
  }

  toggleTheme() {
    if (this._darkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    this._darkMode.set(true);
    document.documentElement.classList.add('my-app-dark');
    localStorage.setItem('theme', 'dark');
  }

  private disableDarkMode() {
    this._darkMode.set(false);
    document.documentElement.classList.remove('my-app-dark');
    localStorage.setItem('theme', 'light');
  }
}
