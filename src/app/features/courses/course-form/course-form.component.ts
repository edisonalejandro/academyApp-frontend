import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { DanceType, DanceLevel, UserDTO, CreateCourseDTO, UpdateCourseDTO } from '../../../core/models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public dialogRef = inject(MatDialogRef<CourseFormComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  courseForm!: FormGroup;
  isEditMode = false;
  teachers = signal<UserDTO[]>([]);

  // Opciones para los select
  danceTypes: { value: DanceType; label: string }[] = [
    { value: 'SALSA' as DanceType, label: 'Salsa' },
    { value: 'BACHATA' as DanceType, label: 'Bachata' },
    { value: 'MERENGUE' as DanceType, label: 'Merengue' },
    { value: 'REGGAETON' as DanceType, label: 'Reggaetón' },
    { value: 'CUMBIA' as DanceType, label: 'Cumbia' },
    { value: 'TANGO' as DanceType, label: 'Tango' },
    { value: 'KIZOMBA' as DanceType, label: 'Kizomba' },
    { value: 'ZOUK' as DanceType, label: 'Zouk' },
    { value: 'MAMBO' as DanceType, label: 'Mambo' },
    { value: 'CHA_CHA_CHA' as DanceType, label: 'Cha Cha Chá' }
  ];

  danceLevels: { value: DanceLevel; label: string }[] = [
    { value: 'BEGINNER' as DanceLevel, label: 'Principiante' },
    { value: 'INTERMEDIATE' as DanceLevel, label: 'Intermedio' },
    { value: 'ADVANCED' as DanceLevel, label: 'Avanzado' },
    { value: 'MASTER' as DanceLevel, label: 'Maestro' },
    { value: 'OPEN' as DanceLevel, label: 'Abierto' }
  ];

  ngOnInit(): void {
    this.isEditMode = !!(this.data?.course);
    this.initForm();
    this.loadTeachers();

    if (this.isEditMode && this.data.course) {
      this.courseForm.patchValue(this.data.course);
    }
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      danceType: ['', Validators.required],
      level: ['', Validators.required],
      pricePerHour: [0, [Validators.required, Validators.min(0)]],
      durationHours: [1, [Validators.required, Validators.min(0.5), Validators.max(8)]],
      maxCapacity: [20, [Validators.required, Validators.min(1), Validators.max(100)]],
      teacherId: ['', Validators.required],
      imageUrl: [''],
      prerequisites: [''],
      objectives: ['']
    });
  }

  loadTeachers(): void {
    this.userService.getAllUsers().subscribe({
      next: (page: any) => {
        // Filtrar solo usuarios con rol TEACHER o ADMIN
        const teacherUsers = page.content.filter((u: UserDTO) => 
          u.roles?.includes('TEACHER') || u.roles?.includes('ROLE_TEACHER') ||
          u.roles?.includes('ADMIN') || u.roles?.includes('ROLE_ADMIN')
        );
        this.teachers.set(teacherUsers);
      },
      error: (err: any) => {
        console.error('Error al cargar profesores:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      
      // Convertir a números si es necesario
      const courseData = {
        ...formValue,
        pricePerHour: Number(formValue.pricePerHour),
        durationHours: Number(formValue.durationHours),
        maxCapacity: Number(formValue.maxCapacity),
        teacherId: Number(formValue.teacherId)
      };

      if (this.isEditMode) {
        this.dialogRef.close(courseData as UpdateCourseDTO);
      } else {
        this.dialogRef.close(courseData as CreateCourseDTO);
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.courseForm.controls).forEach(key => {
        this.courseForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.courseForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (control.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `El valor mínimo es ${min}`;
    }
    if (control.hasError('max')) {
      const max = control.errors?.['max'].max;
      return `El valor máximo es ${max}`;
    }
    
    return '';
  }
}
