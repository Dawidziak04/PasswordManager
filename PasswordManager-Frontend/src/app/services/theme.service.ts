import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'astral' | 'violet';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = new BehaviorSubject<Theme>('astral');
  theme$ = this.theme.asObservable();

  constructor() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.theme.next(savedTheme);
    }
  }

  toggleTheme() {
    const newTheme = this.theme.value === 'astral' ? 'violet' : 'astral';
    this.theme.next(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  getCurrentTheme(): Theme {
    return this.theme.value;
  }
} 