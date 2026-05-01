import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type RolUsuario =
  | 'DIRECCION'
  | 'COORDINACION'
  | 'AUXILIAR_ADMINISTRATIVO'
  | 'ASESOR_COMERCIAL'
  | 'TELEMERCADERISTA';

export interface Usuario {
  cedula:            string;
  nombre:            string;
  correoElectronico: string;
  rol:               RolUsuario;
}

export interface LoginRequest {
  cedula:   string;
  password: string;
}

export interface LoginResponse {
  token:   string;
  usuario: Usuario;
}

const PERMISOS: Record<RolUsuario, string[]> = {
  DIRECCION:               ['dashboard','usuarios','inventario','telemercadeo','beneficios','auditoria'],
  COORDINACION:            ['dashboard','inventario','telemercadeo','beneficios'],
  AUXILIAR_ADMINISTRATIVO: ['dashboard','beneficios','telemercadeo'],
  ASESOR_COMERCIAL:        ['dashboard','telemercadeo','beneficios'],
  TELEMERCADERISTA:        ['dashboard','telemercadeo']
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY   = 'baldrium_token';
  private readonly USUARIO_KEY = 'baldrium_usuario';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(
    this.getUsuarioGuardado()
  );
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credenciales)
      .pipe(
        tap(res => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USUARIO_KEY, JSON.stringify(res.usuario));
          this.usuarioSubject.next(res.usuario);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getRolActual(): RolUsuario | null {
    return this.getUsuarioActual()?.rol ?? null;
  }

  tienePermiso(modulo: string): boolean {
    const rol = this.getRolActual();
    if (!rol) return false;
    return PERMISOS[rol].includes(modulo);
  }

  private getUsuarioGuardado(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.USUARIO_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}