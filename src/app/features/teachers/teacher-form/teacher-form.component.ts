import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserDTO } from '../../../core/models';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './teacher-form.component.html',
  styleUrl: './teacher-form.component.css'
})
export class TeacherFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<TeacherFormComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  teacherForm!: FormGroup;
  isEditMode = false;

  // Opciones de roles
  roles: { value: string; label: string }[] = [
    { value: 'TEACHER', label: 'Profesor' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'STUDENT', label: 'Estudiante' }
  ];

  ngOnInit(): void {
    this.isEditMode = !!(this.data?.teacher);
    this.initForm();

    if (this.isEditMode && this.data.teacher) {
      this.teacherForm.patchValue({
        firstName: this.data.teacher.firstName,
        lastName: this.data.teacher.lastName,
        email: this.data.teacher.email,
        phone: this.data.teacher.phone,
        isActive: this.data.teacher.isActive
      });
      
      // No mostramos el campo password en modo edición
      this.teacherForm.get('password')?.clearValidators();
      this.teacherForm.get('password')?.updateValueAndValidity();
    }
  }

  initForm(): void {
    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formValue = this.teacherForm.value;
      
      const teacherData: Partial<UserDTO> = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone || undefined,
        isActive: formValue.isActive
      };

      // Solo incluir password si está presente y no es modo edición, o si fue modificado
      if (!this.isEditMode && formValue.password) {
        teacherData.password = formValue.password;
      } else if (this.isEditMode && formValue.password) {
        // En modo edición solo incluir si fue modificado (no está vacío)
        teacherData.password = formValue.password;
      }

      this.dialogRef.close(teacherData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.teacherForm.controls).forEach(key => {
        this.teacherForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.teacherForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control.hasError('email')) {
      return 'Ingresa un email válido';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (control.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'Número de teléfono inválido';
      }
      return 'Formato inválido';
    }
    
    return '';
  }
}
