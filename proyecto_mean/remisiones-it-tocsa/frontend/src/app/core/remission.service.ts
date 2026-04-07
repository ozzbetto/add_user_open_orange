import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  description: string;
  brand: string;
  model: string;
  serial: string;
  quantity: number;
  condition: 'nuevo' | 'usado' | 'reparado' | 'dañado';
  observation?: string;
}

export interface Remission {
  _id?: string;
  remissionNumber?: string;
  date: Date;
  sender?: {
    name: string;
    ruc: string;
    address: string;
  };
  recipient: {
    name: string;
    idNumber: string;
    positionArea: string;
    location: string;
  };
  items: Item[];
  transferReason: 'traslado interno' | 'reparación' | 'transformación' | 'exhibición' | 'otros';
  observations?: string;
  authorizedBy: string;
  receivedBy: string;
  createdAt?: string;
  pdfGenerated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RemissionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/remissions';

  getRemissions(): Observable<Remission[]> {
    return this.http.get<Remission[]>(this.apiUrl);
  }

  getRemissionById(id: string): Observable<Remission> {
    return this.http.get<Remission>(`${this.apiUrl}/${id}`);
  }

  createRemission(remission: Remission): Observable<Remission> {
    return this.http.post<Remission>(this.apiUrl, remission);
  }

  updateRemission(id: string, remission: Partial<Remission>): Observable<Remission> {
    return this.http.put<Remission>(`${this.apiUrl}/${id}`, remission);
  }

  deleteRemission(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  downloadPDF(id: string) {
    window.open(`${this.apiUrl}/${id}/pdf`, '_blank');
  }
}
