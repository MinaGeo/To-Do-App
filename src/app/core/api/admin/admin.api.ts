import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../auth/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = `${environment.apiUrl}/admin`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  promote(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/users/${id}/promote`, {});
  }

  demote(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/users/${id}/demote`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
