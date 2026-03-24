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
import { TeacherFormComponent } from './teacher-form/teacher-form.component';

@Component({
  selector: 'app-teachers',
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
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css'
})
export class TeachersComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  teachers = signal<UserDTO[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filtrar solo usuarios con rol TEACHER o ADMIN
        const teacherUsers = users.filter((u: UserDTO) => 
          u.roles?.includes('TEACHER') || u.roles?.includes('ROLE_TEACHER') ||
          u.roles?.includes('ADMIN') || u.roles?.includes('ROLE_ADMIN')
        );
        this.teachers.set(teacherUsers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar profesores:', err);
        this.error.set('Error al cargar los profesores. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateTeacherDialog(): void {
    const dialogRef = this.dialog.open(TeacherFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTeacher(result);
      }
    });
  }

  openEditTeacherDialog(teacher: UserDTO): void {
    const dialogRef = this.dialog.open(TeacherFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: false,
      data: { teacher }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTeacher(teacher.id, result);
      }
    });
  }

  createTeacher(teacherData: Partial<UserDTO> & { roleName?: string }): void {
    const roleName = teacherData.roleName || 'TEACHER';
    
    // Primero crear el usuario
    this.userService.createUser(teacherData).pipe(
      switchMap(newUser => {
        // Luego asignar el rol
        return this.roleService.assignRole(newUser.id, roleName);
      })
    ).subscribe({
      next: (userWithRole) => {
        this.snackBar.open('Profesor creado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loadTeachers();
      },
      error: (err) => {
        console.error('Error al crear profesor:', err);
        this.snackBar.open('Error al crear el profesor', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  updateTeacher(id: number, teacherData: Partial<UserDTO> & { roleName?: string }): void {
    const roleName = teacherData.roleName;
    
    // Actualizar el usuario
    this.userService.updateUser(id, teacherData).pipe(
      switchMap(updatedUser => {
        // Si se especificó un rol, asignarlo (esto reemplaza los roles existentes)
        if (roleName) {
          return this.roleService.assignRole(id, roleName);
        }
        return [updatedUser];
      })
    ).subscribe({
      next: (updatedTeacher) => {
        this.snackBar.open('Profesor actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loadTeachers();
      },
      error: (err) => {
        console.error('Error al actualizar profesor:', err);
        this.snackBar.open('Error al actualizar el profesor', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteTeacher(teacher: UserDTO): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al profesor "${teacher.firstName} ${teacher.lastName}"?`)) {
      this.userService.deleteUser(teacher.id).subscribe({
        next: () => {
          this.snackBar.open('Profesor eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadTeachers();
        },
        error: (err) => {
          console.error('Error al eliminar profesor:', err);
          this.snackBar.open('Error al eliminar el profesor', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  toggleTeacherStatus(teacher: UserDTO): void {
    const action = teacher.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${action} al profesor "${teacher.firstName} ${teacher.lastName}"?`)) {
      this.userService.toggleUserStatus(teacher.id).subscribe({
        next: () => {
          this.snackBar.open(`Profesor ${teacher.isActive ? 'desactivado' : 'activado'} exitosamente`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadTeachers();
        },
        error: (err) => {
          console.error('Error al cambiar estado del profesor:', err);
          this.snackBar.open('Error al cambiar el estado del profesor', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  getRoleLabel(teacher: UserDTO): string {
    if (teacher.roles?.includes('ADMIN') || teacher.roles?.includes('ROLE_ADMIN')) {
      return 'Administrador';
    }
    if (teacher.roles?.includes('TEACHER') || teacher.roles?.includes('ROLE_TEACHER')) {
      return 'Profesor';
    }
    return 'Usuario';
  }

  getRoleColor(teacher: UserDTO): string {
    if (teacher.roles?.includes('ADMIN') || teacher.roles?.includes('ROLE_ADMIN')) {
      return 'warn';
    }
    if (teacher.roles?.includes('TEACHER') || teacher.roles?.includes('ROLE_TEACHER')) {
      return 'primary';
    }
    return 'accent';
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
