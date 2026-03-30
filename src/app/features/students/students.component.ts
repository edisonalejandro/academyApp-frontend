import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { switchMap, forkJoin } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';
import { AuthService } from '../../core/services/auth.service';
import { UserDTO } from '../../core/models';
import { StudentFormComponent } from './student-form/student-form.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  students = signal<UserDTO[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.userService.getAllUsers().subscribe({
      next: (page) => {
        // Filtrar solo usuarios con rol STUDENT
        const studentUsers = page.content.filter((u: UserDTO) => 
          u.roles?.includes('STUDENT') || u.roles?.includes('ROLE_STUDENT')
        );
        this.students.set(studentUsers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar alumnos:', err);
        this.error.set('Error al cargar los alumnos. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateStudentDialog(): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createStudent(result);
      }
    });
  }

  openEditStudentDialog(student: UserDTO): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: false,
      data: { student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateStudent(student.id, result);
      }
    });
  }

  createStudent(studentData: Partial<UserDTO> & { roleName?: string }): void {
    const roleName = studentData.roleName || 'STUDENT';
    
    // Primero crear el usuario
    this.userService.createUser(studentData).pipe(
      switchMap(newUser => {
        // Luego asignar el rol
        return this.roleService.assignRole(newUser.id, roleName);
      })
    ).subscribe({
      next: (userWithRole) => {
        this.snackBar.open('Alumno creado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loadStudents();
      },
      error: (err) => {
        console.error('Error al crear alumno:', err);
        this.snackBar.open('Error al crear el alumno', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  updateStudent(id: number, studentData: Partial<UserDTO> & { roleName?: string }): void {
    const roleName = studentData.roleName;
    
    // Actualizar el usuario
    this.userService.updateUser(id, studentData).pipe(
      switchMap(updatedUser => {
        // Si se especificó un rol, asignarlo (esto reemplaza los roles existentes)
        if (roleName) {
          return this.roleService.assignRole(id, roleName);
        }
        return [updatedUser];
      })
    ).subscribe({
      next: (updatedStudent) => {
        this.snackBar.open('Alumno actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loadStudents();
      },
      error: (err) => {
        console.error('Error al actualizar alumno:', err);
        this.snackBar.open('Error al actualizar el alumno', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteStudent(student: UserDTO): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al alumno "${student.firstName} ${student.lastName}"?`)) {
      this.userService.deleteUser(student.id).subscribe({
        next: () => {
          this.snackBar.open('Alumno eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadStudents();
        },
        error: (err) => {
          console.error('Error al eliminar alumno:', err);
          this.snackBar.open('Error al eliminar el alumno', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  toggleStudentStatus(student: UserDTO): void {
    const action = student.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${action} al alumno "${student.firstName} ${student.lastName}"?`)) {
      this.userService.toggleUserStatus(student.id).subscribe({
        next: () => {
          this.snackBar.open(`Alumno ${student.isActive ? 'desactivado' : 'activado'} exitosamente`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadStudents();
        },
        error: (err) => {
          console.error('Error al cambiar estado del alumno:', err);
          this.snackBar.open('Error al cambiar el estado del alumno', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }
}
