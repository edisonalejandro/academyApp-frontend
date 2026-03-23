import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { CourseService } from '../../core/services/course.service';
import { CourseDTO, DanceType, DanceLevel } from '../../core/models';

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
    MatBadgeModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  
  courses = signal<CourseDTO[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.courseService.getCourses().subscribe({
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
