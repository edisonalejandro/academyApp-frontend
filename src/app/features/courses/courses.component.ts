import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { CourseDTO, DanceType, DanceLevel, CreateCourseDTO, UpdateCourseDTO } from '../../core/models';
import { CourseFormComponent } from './course-form/course-form.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  courses = signal<CourseDTO[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Debug: Verificar roles del usuario
    console.log('=== DEBUG COURSES COMPONENT ===');
    console.log('Usuario actual:', this.authService.currentUser());
    console.log('Roles:', this.authService.userRoles());
    console.log('Es admin?:', this.authService.isAdmin());
    console.log('Es autenticado?:', this.authService.isAuthenticated());
    console.log('===============================');
    
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    // Si es admin, cargar todos los cursos; sino, solo los activos
    const observable = this.authService.isAdmin()
      ? this.courseService.getAllCourses()
      : this.courseService.getCourses();
    
    observable.subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        this.error.set('Error al cargar los cursos. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateCourseDialog(): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCourse(result);
      }
    });
  }

  openEditCourseDialog(course: CourseDTO): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false,
      data: { course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCourse(course.id, result);
      }
    });
  }

  createCourse(courseData: CreateCourseDTO): void {
    this.courseService.createCourse(courseData).subscribe({
      next: (newCourse) => {
        this.snackBar.open('Curso creado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error al crear curso:', err);
        this.snackBar.open('Error al crear el curso', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  updateCourse(id: number, courseData: UpdateCourseDTO): void {
    this.courseService.updateCourse(id, courseData).subscribe({
      next: (updatedCourse) => {
        this.snackBar.open('Curso actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error al actualizar curso:', err);
        this.snackBar.open('Error al actualizar el curso', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteCourse(course: CourseDTO): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el curso "${course.title}"?`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.snackBar.open('Curso eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error al eliminar curso:', err);
          this.snackBar.open('Error al eliminar el curso', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  toggleCourseStatus(course: CourseDTO): void {
    const action = course.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${action} el curso "${course.title}"?`)) {
      this.courseService.toggleCourseStatus(course.id).subscribe({
        next: () => {
          this.snackBar.open(`Curso ${course.isActive ? 'desactivado' : 'activado'} exitosamente`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error al cambiar estado del curso:', err);
          this.snackBar.open('Error al cambiar el estado del curso', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  getDanceTypeLabel(danceType: DanceType): string {
    const labels: Record<DanceType, string> = {
      SALSA: 'Salsa',
      BACHATA: 'Bachata',
      MERENGUE: 'Merengue',
      REGGAETON: 'Reggaetón',
      CUMBIA: 'Cumbia',
      TANGO: 'Tango',
      KIZOMBA: 'Kizomba',
      ZOUK: 'Zouk',
      MAMBO: 'Mambo',
      CHA_CHA_CHA: 'Cha Cha Chá'
    };
    return labels[danceType] || danceType;
  }

  getDanceLevelLabel(level: DanceLevel): string {
    const labels: Record<DanceLevel, string> = {
      BEGINNER: 'Principiante',
      INTERMEDIATE: 'Intermedio',
      ADVANCED: 'Avanzado',
      MASTER: 'Maestro',
      OPEN: 'Abierto'
    };
    return labels[level] || level;
  }

  getDanceLevelColor(level: DanceLevel): string {
    const colors: Record<DanceLevel, string> = {
      BEGINNER: 'primary',
      INTERMEDIATE: 'accent',
      ADVANCED: 'warn',
      MASTER: 'warn',
      OPEN: 'primary'
    };
    return colors[level] || 'primary';
  }

  formatDuration(hours: number): string {
    if (hours === 1) return '1 hora';
    if (hours < 1) return `${hours * 60} min`;
    return `${hours} horas`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
