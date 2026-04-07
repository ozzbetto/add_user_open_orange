import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RemissionService, Remission } from '../../core/remission.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-remissions-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TableModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, TagModule, TooltipModule
  ],
  templateUrl: './remissions-list.component.html'
})
export class RemissionsListComponent implements OnInit {
  private remissionService = inject(RemissionService);

  remissions = signal<Remission[]>([]);

  ngOnInit(): void {
    this.loadRemissions();
  }

  loadRemissions() {
    this.remissionService.getRemissions().subscribe({
      next: (data) => this.remissions.set(data),
      error: (err) => console.error('Error al cargar remisiones:', err)
    });
  }

  downloadPDF(id: string) {
    this.remissionService.downloadPDF(id);
  }

  deleteRemission(id: string) {
    if (confirm('¿Está seguro de eliminar esta remisión? Esta acción no se puede deshacer.')) {
      this.remissionService.deleteRemission(id).subscribe({
        next: () => {
          this.remissions.update(list => list.filter(r => r._id !== id));
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}