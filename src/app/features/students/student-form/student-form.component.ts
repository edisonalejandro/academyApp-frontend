import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserDTO } from '../../../core/models';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<StudentFormComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  studentForm!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!(this.data?.student);
    this.initForm();

    if (this.isEditMode && this.data.student) {
      this.studentForm.patchValue({
        firstName: this.data.student.firstName,
        lastName: this.data.student.lastName,
        email: this.data.student.email,
        phone: this.data.student.phone,
        isActive: this.data.student.isActive
      });
      
      // No mostramos el campo password en modo edición
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('password')?.updateValueAndValidity();
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      
      const studentData: Partial<UserDTO> & { roleName?: string } = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone || undefined,
        isActive: formValue.isActive,
        roleName: 'STUDENT' // Los alumnos siempre tienen rol STUDENT
      };

      // Solo incluir password si está presente y no es modo edición, o si fue modificado
      if (!this.isEditMode && formValue.password) {
        studentData.password = formValue.password;
      } else if (this.isEditMode && formValue.password) {
        // En modo edición solo incluir si fue modificado (no está vacío)
        studentData.password = formValue.password;
      }

      this.dialogRef.close(studentData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.studentForm.controls).forEach(key => {
        this.studentForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.studentForm.get(fieldName);
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
