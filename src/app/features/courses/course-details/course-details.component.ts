import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseDTO, DanceType, DanceLevel } from '../../../core/models';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
  private dialogRef = inject(MatDialogRef<CourseDetailsComponent>);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { course: CourseDTO }) {}

  close(): void {
    this.dialogRef.close();
  }

  enroll(): void {
    this.dialogRef.close({ action: 'enroll', course: this.data.course });
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
      CHA_CHA_CHA: 'Cha Cha Cha'
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

  getDanceLevelColor(level: DanceLevel): 'primary' | 'accent' | 'warn' {
    const colors: Record<DanceLevel, 'primary' | 'accent' | 'warn'> = {
      BEGINNER: 'primary',
      INTERMEDIATE: 'accent',
      ADVANCED: 'warn',
      MASTER: 'warn',
      OPEN: 'primary'
    };
    return colors[level] || 'primary';
  }

  formatDuration(hours: number): string {
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
