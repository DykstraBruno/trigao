import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { StoreService } from '../../../services/store.service';
import { Store, Manager } from '../../../models/store.model';

@Component({
  selector: 'app-manager-management',
  templateUrl: './manager-management.component.html',
  styleUrls: ['./manager-management.component.scss']
})
export class ManagerManagementComponent implements OnInit {
  managers: Manager[] = [];
  stores: Store[] = [];
  loading = true;
  showForm = false;
  form!: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private storeService: StoreService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:     ['', [Validators.required, Validators.maxLength(150)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone:    [''],
      storeId:  [null, Validators.required]
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      managers: this.storeService.listManagers(),
      stores:   this.storeService.list(true)
    }).subscribe({
      next: ({ managers, stores }) => {
        this.managers = managers;
        this.stores = stores;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openNew(): void {
    this.form.reset();
    this.showForm = true;
    this.error = '';
  }

  cancel(): void {
    this.showForm = false;
  }

  save(): void {
    if (this.form.invalid) return;
    this.storeService.createManager(this.form.value).subscribe({
      next: () => { this.showForm = false; this.load(); },
      error: err => { this.error = err?.error?.error || 'Erro ao salvar.'; }
    });
  }

  reassign(m: Manager, storeId: string): void {
    const id = Number(storeId);
    if (!id || id === m.storeId) return;
    this.storeService.reassignManager(m.id, id).subscribe(() => this.load());
  }

  remove(m: Manager): void {
    if (!confirm(`Remover gerente ${m.name}?`)) return;
    this.storeService.deleteManager(m.id).subscribe(() => this.load());
  }

  trackById(_: number, m: Manager): number { return m.id; }
}
