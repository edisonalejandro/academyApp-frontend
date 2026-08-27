import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);
  public authService = inject(AuthService);
  public cartService = inject(CartService);

  @ViewChild('logoVideo') logoVideoRef?: ElementRef<HTMLVideoElement>;

  isMenuOpen = false;

  onLogoHoverStart() {
    const video = this.logoVideoRef?.nativeElement;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  onLogoHoverEnd() {
    const video = this.logoVideoRef?.nativeElement;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Prevenir scroll cuando el menú está abierto
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  goToSection(event: Event, sectionId: string) {
    this.closeMenu();
    // Si ya estamos en Home, dejamos que el navegador haga el scroll nativo al ancla.
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      return;
    }
    // Desde otra ruta, navegamos por el Router para que Home se recree desde cero
    // (video siempre silenciado) y luego hacemos scroll a la sección.
    event.preventDefault();
    this.router.navigate(['/'], { fragment: sectionId });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.closeMenu();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Limpiar de todas formas
        this.closeMenu();
        this.router.navigate(['/']);
      }
    });
  }
}
