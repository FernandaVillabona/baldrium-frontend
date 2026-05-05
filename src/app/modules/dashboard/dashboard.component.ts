import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 style="font-family:'Raleway',sans-serif;font-size:28px;
                 font-weight:700;margin-bottom:8px;">Dashboard</h1>
      <p style="color:#888;font-size:14px;">
        Bienvenido, <strong>{{ usuario?.nombre }}</strong>
      </p>
    </div>
  `
})
export class DashboardComponent implements OnInit {

  usuario: any = null;

  // ← constructor primero, luego la propiedad se asigna en ngOnInit
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuarioActual();
  }
}