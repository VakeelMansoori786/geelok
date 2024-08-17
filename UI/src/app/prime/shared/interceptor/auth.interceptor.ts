import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LocalStoreService } from '../../services/local-store.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private ls: LocalStoreService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this.ls.getItem('token');
    let currentUser = this.authService.isLoggedIn();

    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      
      // catchError((error: HttpErrorResponse) => {
        
      //   if (error.status === 401) {
      //     // Redirect to login page or handle unauthorized access here
      //     this.ls.setItem('token',null)
      //     this.router.navigate(['/auth/login']);
      //   }
      //   return throwError(error);
      // })
    );
  }
}
