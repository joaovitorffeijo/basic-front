import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Supplier } from '../types/supplier/supplier';
import { APIResponse } from '../types/response/api-response';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = `${environment.apiUrl}/api/suppliers`;

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getSuppliers(): Observable<APIResponse<Supplier[]>> {
    return this.httpClient.get<APIResponse<Supplier[]>>(this.apiUrl + '/list', { headers: this.getHeaders() });
  }

  getSupplier(id: number): Observable<APIResponse<Supplier>> {
    return this.httpClient.get<APIResponse<Supplier>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  saveSupplier(supplier: Supplier): Observable<APIResponse<Supplier>> {
    return this.httpClient.post<APIResponse<Supplier>>(this.apiUrl, supplier, { headers: this.getHeaders() });
  }

  editSupplier(id: number, supplier: Supplier): Observable<APIResponse<Supplier>> {
    return this.httpClient.put<APIResponse<Supplier>>(`${this.apiUrl}/${id}`, supplier, { headers: this.getHeaders() });
  }

  deleteSupplier(id: number): Observable<APIResponse<void>> {
    return this.httpClient.delete<APIResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteMultipleSuppliers(idList: number[]): Observable<APIResponse<void>> {
    return this.httpClient.request<APIResponse<void>>('DELETE', `${this.apiUrl}`, {
      headers: this.getHeaders(),
      body: idList
    });
  }
}
