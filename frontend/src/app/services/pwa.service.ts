import { Injectable, OnDestroy, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { filter } from 'rxjs/operators';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService implements OnDestroy {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installableSubject = new BehaviorSubject<boolean>(false);
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  installable$ = this.installableSubject.asObservable();
  updateAvailable$ = this.updateAvailableSubject.asObservable();

  private subs: Subscription[] = [];

  constructor(
    private swUpdate: SwUpdate,
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.listenInstallPrompt();
    this.listenUpdates();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  isStandalone(): boolean {
    const win = this.doc.defaultView as any;
    return (this.doc.defaultView?.matchMedia('(display-mode: standalone)').matches)
      || (win && win.navigator && win.navigator.standalone === true);
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    await this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.installableSubject.next(false);
    return choice.outcome === 'accepted';
  }

  applyUpdate(): void {
    if (!this.swUpdate.isEnabled) return;
    this.swUpdate.activateUpdate().then(() => this.doc.defaultView?.location.reload());
  }

  private listenInstallPrompt(): void {
    const win = this.doc.defaultView;
    if (!win) return;
    win.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.zone.run(() => {
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.installableSubject.next(true);
      });
    });
    win.addEventListener('appinstalled', () => {
      this.zone.run(() => {
        this.deferredPrompt = null;
        this.installableSubject.next(false);
      });
    });
  }

  private listenUpdates(): void {
    if (!this.swUpdate.isEnabled) return;
    this.subs.push(
      this.swUpdate.available.subscribe(() => this.zone.run(() => this.updateAvailableSubject.next(true)))
    );
    // checa atualizações a cada 6h
    this.subs.push(
      interval(6 * 60 * 60 * 1000)
        .pipe(filter(() => this.swUpdate.isEnabled))
        .subscribe(() => this.swUpdate.checkForUpdate().catch(() => null))
    );
  }
}
