import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RemissionService, Remission } from '../../core/remission.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-remissions-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    CardModule, ButtonModule, InputTextModule, TextareaModule, MessageModule
  ],
  templateUrl: './remissions-form.component.html'
})
export class RemissionsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private remissionService = inject(RemissionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  remissionForm!: FormGroup;
  isEditMode = false;
  isViewMode = false;
  remissionId: string | null = null;
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.remissionId = this.route.snapshot.paramMap.get('id');
    this.isViewMode = this.router.url.includes('/ver/');
    
    if (this.remissionId) {
      if (!this.isViewMode) {
        this.isEditMode = true;
      }
      this.loadRemissionData(this.remissionId);
    } else {
      this.addItem(); // Start with one item
    }
  }

  private initForm() {
    this.remissionForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      recipient: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        idNumber: ['', [Validators.required, Validators.pattern(/^[0-9.-]+$/)]],
        positionArea: ['', Validators.required],
        location: ['', Validators.required],
      }),
      transferReason: ['traslado interno', Validators.required],
      observations: [''],
      items: this.fb.array([], Validators.required),
      authorizedBy: ['', Validators.required],
      receivedBy: ['', Validators.required],
    });
  }

  get items() {
    return this.remissionForm.get('items') as FormArray;
  }

  addItem(force: boolean = false) {
    if (this.isViewMode && !force) return;
    const itemGroup = this.fb.group({
      description: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      serial: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      condition: ['usado', Validators.required],
      observation: [''],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    if (this.isViewMode) return;
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  loadRemissionData(id: string) {
    this.remissionService.getRemissionById(id).subscribe({
      next: (remission) => {
        const formattedDate = new Date(remission.date).toISOString().split('T')[0];
        
        while (this.items.length) {
          this.items.removeAt(0);
        }

        remission.items.forEach(() => this.addItem(true));
        
        this.remissionForm.patchValue({
          ...remission,
          date: formattedDate
        });

        if (this.isViewMode) {
          this.remissionForm.disable();
        }
      },
      error: (err) => console.error('Error al cargar datos:', err)
    });
  }

  isFieldInvalid(fieldPath: string): boolean {
    const field = this.remissionForm.get(fieldPath);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  isItemFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.items.at(index).get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.isViewMode || this.remissionForm.invalid) {
      this.remissionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.remissionForm.value;

    if (this.isEditMode && this.remissionId) {
      this.remissionService.updateRemission(this.remissionId, formData).subscribe({
        next: () => {
          this.router.navigate(['/remisiones']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.remissionService.createRemission(formData).subscribe({
        next: () => {
          this.router.navigate(['/remisiones']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.isSubmitting.set(false);
        }
      });
    }
  }
}