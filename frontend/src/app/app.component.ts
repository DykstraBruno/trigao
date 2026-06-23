import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>

    <div class="pwa-banner update" *ngIf="updateAvailable$ | async" role="status">
      <span class="material-icons">system_update_alt</span>
      <span>Nova versão disponível.</span>
      <button (click)="reload()">Atualizar</button>
    </div>

    <div class="pwa-banner install"
         *ngIf="(installable$ | async) && !dismissedInstall"
         role="dialog" aria-label="Instalar app">
      <span class="material-icons">install_mobile</span>
      <span>Instalar Trigão na tela inicial?</span>
      <button class="primary" (click)="install()">Instalar</button>
      <button class="ghost" (click)="dismissInstall()">Agora não</button>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    main { min-height: calc(100vh - 140px); }

    .pwa-banner {
      position: fixed;
      left: 50%;
      bottom: 1rem;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #2c1810;
      color: #fff;
      padding: 0.7rem 1rem;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      z-index: 9999;
      max-width: calc(100vw - 2rem);
      font-size: 0.9rem;
    }
    .pwa-banner.update { background: #1565C0; }
    .pwa-banner .material-icons { font-size: 1.2rem; }
    .pwa-banner button {
      border: none;
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .pwa-banner button.primary { background: #C7392F; color: #fff; }
    .pwa-banner button.ghost   { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.4); }
    .pwa-banner button:not(.primary):not(.ghost) { background: #fff; color: #1565C0; }
  `]
})
export class AppComponent implements OnInit {
  installable$!: Observable<boolean>;
  updateAvailable$!: Observable<boolean>;
  dismissedInstall = false;

  constructor(private pwa: PwaService) {}

  ngOnInit(): void {
    this.installable$ = this.pwa.installable$;
    this.updateAvailable$ = this.pwa.updateAvailable$;
    this.dismissedInstall = localStorage.getItem('pwa_install_dismissed') === '1';
  }

  async install(): Promise<void> {
    await this.pwa.promptInstall();
  }

  dismissInstall(): void {
    this.dismissedInstall = true;
    localStorage.setItem('pwa_install_dismissed', '1');
  }

  reload(): void {
    this.pwa.applyUpdate();
  }
}
