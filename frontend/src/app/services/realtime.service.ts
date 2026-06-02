import { Injectable, OnDestroy } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { Order } from '../models/order.model';

export interface OrderEvent {
  type: 'CREATED' | 'UPDATED';
  order: Order;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private stomp = new RxStomp();
  private active = false;
  private disconnect$ = new Subject<void>();

  constructor(private auth: AuthService) {}

  connect(): void {
    if (this.active) return;
    const token = this.auth.getToken();
    if (!token) return;

    this.stomp.configure({
      webSocketFactory: () => new SockJS('/ws') as any,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000
    });
    this.stomp.activate();
    this.active = true;
  }

  disconnect(): void {
    if (!this.active) return;
    this.disconnect$.next();
    this.stomp.deactivate();
    this.active = false;
  }

  isConnected$(): Observable<boolean> {
    return this.stomp.connectionState$.pipe(map(s => s === RxStompState.OPEN));
  }

  storeOrders$(storeId: number): Observable<OrderEvent> {
    this.connect();
    return this.stomp.watch(`/topic/store/${storeId}/orders`).pipe(
      filter(msg => !!msg.body),
      map(msg => JSON.parse(msg.body) as OrderEvent)
    );
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
