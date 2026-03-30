import { Component, ElementRef, HostListener, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  private readonly SCROLL_ZONE = 650; // px de scroll para completar la animación

  videoScale = 1;
  videoBorderRadius = 0;
  scrollIndicatorOpacity = 1;
  heroBannerOpacity = 0;
  videoOpacity = 1;
  isPaused = false;

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollY = window.scrollY;
    const progress = Math.min(Math.max(scrollY / this.SCROLL_ZONE, 0), 1);

    // Escala de 1 → 0.38 (achica el video)
    this.videoScale = 1 - progress * 0.62;

    // Border-radius de 0 → 28px
    this.videoBorderRadius = progress * 28;

    // Indicador de scroll desaparece rápidamente
    this.scrollIndicatorOpacity = Math.max(0, 1 - progress * 5);

    // Hero crossfade aparece desde progress 0.25 → 1
    this.heroBannerOpacity = Math.min(Math.max((progress - 0.25) / 0.75, 0), 1);

    // Video se desvanece en el tramo final: progress 0.75 → 1
    this.videoOpacity = Math.max(0, 1 - Math.max((progress - 0.75) / 0.25, 0));
  }

  togglePlay(): void {
    if (!isPlatformBrowser(this.platformId) || !this.heroVideoRef) return;
    const video = this.heroVideoRef.nativeElement;
    if (video.paused) {
      video.play();
      this.isPaused = false;
    } else {
      video.pause();
      this.isPaused = true;
    }
  }
}

