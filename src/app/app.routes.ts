import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, adminGuard, teacherGuard, studentGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    pathMatch: 'full'
    // Sin canActivate para acceso público
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/courses.component').then(c => c.CoursesComponent)
    // Público - todos pueden ver el catálogo de cursos
  },
  {
    path: 'usuarios',
    canActivate: [adminGuard],
    children: [
      {
        path: 'profesores',
        loadComponent: () => import('./features/teachers/teachers.component').then(c => c.TeachersComponent)
      },
      {
        path: 'alumnos',
        loadComponent: () => import('./features/students/students.component').then(c => c.StudentsComponent)
      },
      {
        path: '',
        redirectTo: 'profesores',
        pathMatch: 'full'
      }
    ]
  },
  // Rutas para Admin
  //{
  //  path: 'users',
  //  canActivate: [adminGuard],
  //  loadChildren: () => import('./features/users/users.routes').then(r => r.usersRoutes)
  //},
  //{
  //  path: 'payments',
  //  canActivate: [adminGuard],
  //  loadChildren: () => import('./features/payments/payments.routes').then(r => r.paymentsRoutes)
  //},
  //{
  //  path: 'pricing',
  //  canActivate: [authGuard], // Todos pueden acceder al calculator, admin a rules
  //  loadChildren: () => import('./features/pricing/pricing.routes').then(r => r.pricingRoutes)
  //},
  //// Rutas para Teacher
  //{
  //  path: 'classes',
  //  canActivate: [teacherGuard],
  //  loadChildren: () => import('./features/classes/classes.routes').then(r => r.classesRoutes)
  //},
  //{
  //  path: 'students',
  //  canActivate: [teacherGuard],
  //  loadChildren: () => import('./features/students/students.routes').then(r => r.studentsRoutes)
  //},
  //// Rutas para Student
  //{
  //  path: 'my-classes',
  //  canActivate: [studentGuard],
  //  loadChildren: () => import('./features/student/student.routes').then(r => r.studentRoutes)
  //},
  //{
  //  path: 'my-payments',
  //  canActivate: [studentGuard],
  //  loadChildren: () => import('./features/student/student.routes').then(r => r.studentRoutes)
  //},
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];