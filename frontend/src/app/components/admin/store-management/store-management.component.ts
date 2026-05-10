import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store.model';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.scss']
})
export class StoreManagementComponent implements OnInit {
  stores: Store[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  form!: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private storeService: StoreService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:    ['', [Validators.required, Validators.maxLength(100)]],
      slug:    [''],
      address: [''],
      phone:   [''],
      active:  [true]
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.storeService.list(true).subscribe({
      next: list => { this.stores = list; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openNew(): void {
    this.editingId = null;
    this.form.reset({ active: true });
    this.showForm = true;
    this.error = '';
  }

  edit(s: Store): void {
    this.editingId = s.id;
    this.form.patchValue(s);
    this.showForm = true;
    this.error = '';
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.value;
    const obs = this.editingId
      ? this.storeService.update(this.editingId, payload)
      : this.storeService.create(payload);
    obs.subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: err => { this.error = err?.error?.error || 'Erro ao salvar.'; }
    });
  }

  toggle(s: Store): void {
    if (!s.active) return;
    if (!confirm(`Desativar loja "${s.name}"?`)) return;
    this.storeService.delete(s.id).subscribe(() => this.load());
  }

  trackById(_: number, s: Store): number { return s.id; }
}
