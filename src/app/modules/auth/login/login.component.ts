import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  cargando    = false;
  error       = '';
  mostrarPass = false;

  // Estado del modal "olvidé contraseña"
  mostrarModalOlvide  = false;
  correoRecuperacion  = '';
  enviandoCorreo      = false;
  mensajeRecuperacion = '';
  errorRecuperacion   = '';

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.estaAutenticado()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.form = this.fb.group({
      cedula:     ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
      //           ↑ "contrasena" igual que el backend
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.cargando) return;

    this.cargando = true;
    this.error    = '';

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.cargando = false;
        // El backend devuelve { error: '...' } no { message: '...' }
        this.error =
          err?.error?.error ||
          err?.error?.message ||
          'Credenciales inválidas. Intenta nuevamente.';
      }
    });
  }

  // ── Olvidé contraseña ──────────────────────────────────────────────
  abrirModalOlvide(): void {
    this.mostrarModalOlvide  = true;
    this.correoRecuperacion  = '';
    this.mensajeRecuperacion = '';
    this.errorRecuperacion   = '';
  }

  cerrarModalOlvide(): void {
    this.mostrarModalOlvide = false;
  }

  enviarRecuperacion(): void {
    if (!this.correoRecuperacion || !this.correoRecuperacion.includes('@')) {
      this.errorRecuperacion = 'Ingresa un correo electrónico válido.';
      return;
    }

    this.enviandoCorreo      = true;
    this.errorRecuperacion   = '';
    this.mensajeRecuperacion = '';

    this.auth.olvideMiContrasena(this.correoRecuperacion).subscribe({
      next: (res) => {
        this.enviandoCorreo      = false;
        this.mensajeRecuperacion = res.mensaje;
      },
      error: (err: any) => {
        this.enviandoCorreo      = false;
        // El backend devuelve 200 incluso con error por seguridad,
        // pero por si acaso manejamos el error HTTP
        this.mensajeRecuperacion =
          err?.error?.mensaje ||
          'Si el correo existe en el sistema, recibirás las instrucciones en breve.';
      }
    });
  }

  togglePass(): void { this.mostrarPass = !this.mostrarPass; }

  get cedulaCtrl()     { return this.form.get('cedula')!; }
  get contrasenaCtrl() { return this.form.get('contrasena')!; }
}