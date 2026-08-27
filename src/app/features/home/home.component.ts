import { Component, ElementRef, HostListener, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TeacherProfileDTO } from '../../core/models';

interface InstagramPost {
  url: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private viewportScroller = inject(ViewportScroller);

  contactForm!: FormGroup;
  contactSent = false;
  contactSubmitting = false;

  // Hardcodeado: landing sin backend (ver CLAUDE.md / deploy sin costo).
  // Cuando se conecte el backend, volver a cargar desde TeacherService.getPublicTeachers().
  readonly teachers: TeacherProfileDTO[] = [
    {
      id: 1,
      firstName: 'Adrian',
      lastName: 'Maturana',
      photoUrl: 'assets/images/profesor_AdrianMaturana.png',
      cardPhotoUrl: 'assets/images/profesor_AdrianMaturana.png',
      bio: 'Profesor formado en base a la experiencia de todos los años bailando, encontrando distintas formas de enseñar mediante la capacitación en clases de distintos excelentes profesores y profesoras que ayudaron a encontrar el propio Estilo D´ MuA'
    }
  ];
  teachersLoading = false;

  readonly instagramPosts: InstagramPost[] = [
    {
      url: 'https://www.instagram.com/estilodmua/reel/DcGv6rQxtt9/',
      image: 'assets/images/instagram/back-to-90s-purple.png',
      alt: '2° Aniversario Back to 90\'s — Estilo D\' MuA'
    },
    {
      url: 'https://www.instagram.com/estilodmua/reel/DcCpko3SlWd/',
      image: 'assets/images/instagram/back-to-90s-team.png',
      alt: 'Equipo Estilo D\' MuA en el 2° Aniversario Back to 90\'s'
    },
    {
      url: 'https://www.instagram.com/estilodmua/reel/Db3FwNzN_zd/',
      image: 'assets/images/instagram/javi-adrian-lady-style.jpg',
      alt: 'Javi & Adrian — Lady Style, Salsa Cubana'
    },
    {
      url: 'https://www.instagram.com/estilodmua/p/DbUoFDRsppq/',
      image: 'assets/images/instagram/javi-adrian-lady-style.jpg',
      alt: 'Javi & Adrian — Lady Style, Salsa Cubana'
    },
    {
      url: 'https://www.instagram.com/estilodmua/reel/DbyfZijSUTa/',
      image: 'assets/images/instagram/cofradia-red.jpg',
      alt: 'Cofradía Estudio de Baile en el 2° Aniversario'
    },
    {
      url: 'https://www.instagram.com/estilodmua/reel/DaLn7SgSr14/',
      image: 'assets/images/instagram/pista-baile.png',
      alt: 'Alumnos bailando en pista — Estilo D\' MuA'
    }
  ];

  readonly youtubeChannelUrl: string | null = 'https://www.youtube.com/@EstiloDMuA';
  readonly youtubeVideoIds: string[] = [
    '8xkWaIV5dx0',
    'WCnEhBGCLoE',
    'yV0xKkKBUNw',
    'cUMa14lVOng'
  ];

  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  private readonly SCROLL_ZONE = 650; // px de scroll para completar la animación

  videoScale = 1;
  videoBorderRadius = 0;
  scrollIndicatorOpacity = 1;
  heroBannerOpacity = 0;
  videoOpacity = 1;
  isPaused = false;
  isMuted = true;
  readonly DEFAULT_VOLUME = 20; // % — si el video llega a sonar, nunca a todo volumen
  volumePercent = this.DEFAULT_VOLUME;

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

  ngOnInit(): void {
    // Garantiza que el video arranque siempre silenciado al entrar al home
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.heroVideoRef?.nativeElement) {
          this.heroVideoRef.nativeElement.muted = true;
          this.isMuted = true;
          // Si por cualquier vía llega a activarse el audio, que nunca sea a todo volumen
          this.heroVideoRef.nativeElement.volume = this.DEFAULT_VOLUME / 100;
        }
      }, 0);

      // Navegación con ancla desde otra página (p.ej. header → "Nosotros"/"Contacto")
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          setTimeout(() => this.viewportScroller.scrollToAnchor(fragment), 100);
        }
      });
    }

    this.contactForm = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      phone:   [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  youtubeEmbedUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.contactForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.contactSubmitting = true;
    setTimeout(() => {
      this.contactSubmitting = false;
      this.contactSent = true;
    }, 1500);
  }

  resetContact(): void {
    this.contactSent = false;
    this.contactForm.reset();
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

  toggleMute(): void {
    if (!isPlatformBrowser(this.platformId) || !this.heroVideoRef) return;
    const video = this.heroVideoRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
    if (!this.isMuted) {
      if (this.volumePercent === 0) {
        this.volumePercent = this.DEFAULT_VOLUME;
      }
      video.volume = this.volumePercent / 100;
    }
  }

  onVolumeChange(event: Event): void {
    if (!isPlatformBrowser(this.platformId) || !this.heroVideoRef) return;
    const video = this.heroVideoRef.nativeElement;
    const value = Number((event.target as HTMLInputElement).value);
    this.volumePercent = value;
    video.volume = value / 100;
    video.muted = value === 0;
    this.isMuted = video.muted;
  }
}

