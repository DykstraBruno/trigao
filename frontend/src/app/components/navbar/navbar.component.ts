import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  currentUser: User | null = null;
  menuOpen = false;
  scrolled = false;

  currentPath = '/';
  currentFragment: string | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => this.cartCount = cart.itemCount);
    this.authService.currentUser$.subscribe(user => this.currentUser = user);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const tree = this.router.parseUrl(e.urlAfterRedirects);
        this.currentPath = '/' + (tree.root.children['primary']?.segments.map(s => s.path).join('/') ?? '');
        this.currentFragment = tree.fragment;
      });
  }

  isActive(path: string, fragment: string | null = null): boolean {
    if (fragment) return this.currentPath === '/' && this.currentFragment === fragment;
    if (path === '/') return this.currentPath === '/' && !this.currentFragment;
    return this.currentPath.startsWith(path);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
    this.detectSectionInView();
  }

  private detectSectionInView(): void {
    if (this.currentPath !== '/') return;
    const sections = ['sobre', 'contato'];
    const offset = 120;
    let active: string | null = null;
    let bestTop = -Infinity;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= offset && top > bestTop) {
        bestTop = top;
        active = id;
      }
    }

    // Última seção: ativar se rolagem encostou no fim da página
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (atBottom) {
      const last = sections[sections.length - 1];
      if (document.getElementById(last)) active = last;
    }

    if (active !== this.currentFragment) {
      this.currentFragment = active;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
