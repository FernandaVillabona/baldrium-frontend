import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  cargando    = false;
  error       = '';
  mostrarPass = false;

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya hay sesión activa, redirigir directo al dashboard
    if (this.auth.estaAutenticado()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.form = this.fb.group({
      cedula:   ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.cargando) return;

    this.cargando = true;
    this.error    = '';

    // ── Aquí se conectará al backend ──────────────────────────────────
    // El AuthService ya tiene el método login() listo.
    // Cuando el backend esté disponible, solo descomenta este bloque
    // y elimina el setTimeout de prueba de abajo.
    //
    // this.auth.login(this.form.value).subscribe({
    //   next: () => {
    //     this.cargando = false;
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (err: any) => {
    //     this.cargando = false;
    //     this.error = err?.error?.message ?? 'Credenciales inválidas.';
    //   }
    // });

    // ── Simulación temporal (sin backend) ─────────────────────────────
    // Eliminar este bloque cuando conectes al backend real
    setTimeout(() => {
      this.cargando = false;
      // Simula credenciales correctas: cedula=12345, password=123456
      if (
        this.form.value.cedula   === '12345' &&
        this.form.value.password === '123456'
      ) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Credenciales inválidas. Intenta nuevamente.';
      }
    }, 1200);
  }

  togglePass(): void {
    this.mostrarPass = !this.mostrarPass;
  }

  get cedulaCtrl()   { return this.form.get('cedula')!; }
  get passwordCtrl() { return this.form.get('password')!; }
}
