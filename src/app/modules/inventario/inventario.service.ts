import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Producto {
  ID:        number;
  Nombre:    string;
  Tipo:      string;
  Valor:     number;
  Cantidad:  number;
  UpdatedAt?: string;
}

export interface CrearProductoDto {
  Nombre:    string;
  Tipo:      string;
  Valor:     number;
  Cantidad:  number;
}

export interface AuditoriaInventarioItem {
  ID:                  number;
  InventarioID:        number;
  NombreProducto:      string;
  CedulaResponsable:   string;
  NombreResponsable:   string;
  TipoMovimiento:      string;
  CantidadAnterior:    number;
  CantidadMovimiento:  number;
  CantidadPosterior:   number;
  ValorUnitario:       number;
  Motivo:              string;
  Observaciones:       string;
  FechaHora:           string;
}

export const TIPOS_INVENTARIO = [
  'Beneficio',
  'Inventario de cocina',
  'Alimentacion'
];

@Injectable({ providedIn: 'root' })
export class InventarioService {

  private base = `${environment.apiUrl}/Inventario`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  listarAuditoria(): Observable<AuditoriaInventarioItem[]> {
    return this.http.get<AuditoriaInventarioItem[]>(`${this.base}/auditoria`);
  }

  listarAuditoriaInfo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/auditoria/info`);
  }

  crear(datos: CrearProductoDto): Observable<any> {
    return this.http.post(this.base, datos);
  }

  actualizar(id: number, datos: CrearProductoDto): Observable<any> {
    return this.http.put(`${this.base}/${id}`, datos);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
