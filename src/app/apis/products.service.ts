import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../types/product/product';
import { APIResponse } from '../types/response/api-response';
import { PageResponse } from '../types/response/page-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProductsPage(supplierId?: number, page: number = 0, size: number = 10): Observable<PageResponse<Product[]>> {
    let params = new HttpParams()
    .set('page', page)
    .set('size', size);
    if (supplierId) {
      params = params.set('supplierId', supplierId);
    }
    return this.httpClient.get<PageResponse<Product[]>>(this.apiUrl + '/page', { headers: this.getHeaders(), params });
  }

  getProduct(id: number): Observable<APIResponse<Product>> {
    return this.httpClient.get<APIResponse<Product>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  saveProduct(product: Product): Observable<APIResponse<Product>> {
    return this.httpClient.post<APIResponse<Product>>(this.apiUrl, product, { headers: this.getHeaders() });
  }

  editProduct(id: number, product: Product): Observable<APIResponse<Product>> {
    console.log(product);
    

    return this.httpClient.put<APIResponse<Product>>(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<APIResponse<void>> {
    return this.httpClient.delete<APIResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  deleteMultipleProducts(idList: number[]): Observable<APIResponse<void>> {
    return this.httpClient.delete<APIResponse<void>>(`${this.apiUrl}/multiple/${idList.join(',')}`, { headers: this.getHeaders() });
  }
}
