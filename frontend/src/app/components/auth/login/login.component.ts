import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) this.redirectByRole();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: () => this.redirectByRole(),
      error: (err: any) => {
        this.error = err?.error?.error || 'Email ou senha incorretos.';
        this.loading = false;
      }
    });
  }

  private redirectByRole(): void {
    if (this.auth.isAdmin())   { this.router.navigate(['/admin']); return; }
    if (this.auth.isManager()) { this.router.navigate(['/gerente/pedidos']); return; }
    this.router.navigate(['/']);
  }
}
