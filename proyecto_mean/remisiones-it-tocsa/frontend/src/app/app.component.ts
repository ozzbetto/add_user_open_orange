import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ButtonModule],
  template: `
    <p-menubar [model]="items">
      <ng-template #start>
        <div class="flex items-center gap-2 font-bold text-primary mr-4 ml-2 d-flex align-items-center">
          <i class="pi pi-file-edit text-2xl"></i>
          <span class="d-none d-sm-inline ms-2">TOCSA S.A. | Remisiones IT</span>
        </div>
      </ng-template>
      <ng-template #end>
        <div class="d-flex align-items-center gap-2">
          <p-button 
            [icon]="themeService.darkMode() ? 'pi pi-sun' : 'pi pi-moon'" 
            [rounded]="true" 
            [text]="true" 
            severity="secondary"
            (onClick)="themeService.toggleTheme()">
          </p-button>
        </div>
      </ng-template>
    </p-menubar>

    <main class="container py-4 mt-3">
      <router-outlet></router-outlet>
    </main>

    <footer class="border-top py-4 text-center text-secondary small mt-auto">
      <p class="mb-0">&copy; 2026 TOCSA S.A. - Departamento de Informática. Todos los derechos reservados.</p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  themeService = inject(ThemeService);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Remisiones',
        icon: 'pi pi-list',
        items: [
          {
            label: 'Ver Listado',
            icon: 'pi pi-table',
            routerLink: '/remisiones'
          },
          {
            label: 'Nueva Remisión',
            icon: 'pi pi-plus-circle',
            routerLink: '/remisiones/nuevo'
          }
        ]
      }
    ];
  }
}
