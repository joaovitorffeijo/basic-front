import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, tap } from "rxjs";
import { APIResponse } from "../../types/response/api-response";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(login: string, password: string): Observable<APIResponse<string>> {
    return this.httpClient.post<APIResponse<string>>(`${environment.apiUrl}/api/auth/login`, { login, password }).pipe(
      tap(response => {
        if (response.status === 200) {
          sessionStorage.setItem('authToken', response.result as string); 
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
