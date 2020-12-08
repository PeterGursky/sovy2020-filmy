import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Auth } from 'src/entities/auth';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private serverUrl = "http://localhost:8080/";

  constructor(private http: HttpClient, private snackbarServise: SnackbarService) { }

  login(auth:Auth): Observable<string> {
    return this.http.post(this.serverUrl + "login", auth, {responseType: 'text'}).pipe(
      tap(token => {
        this.snackbarServise.successMessage("User " + auth.name + " has logged in");
      }),
      catchError(error => this.processHttpError(error))
    );
  }

  logout(token:string):Observable<void> {
    return this.http.get(this.serverUrl + "logout/" + token).pipe(
      mapTo(undefined),
      catchError(error => this.processHttpError(error))
    )
  }

  checkToken(token: string): Observable<boolean> {
    if (token == null) {
      return of(false);
    }
    return this.http.get(this.serverUrl + "check-token/" + token).pipe(
      mapTo(true),
      catchError(_error => of(false))
    )
  }

  processHttpError(error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.snackbarServise.errorMessage("Server is unreachable");
      } else {
        if (error.status >= 400 && error.status < 500) {  
          const message = error.error.errorMessage ?? JSON.parse(error.error).errorMessage;
          this.snackbarServise.errorMessage(message);
        } else {
          this.snackbarServise.errorMessage("Server error: " + error.message);
        }
      }
    } else {
      this.snackbarServise.errorMessage("Programmer's error : " + JSON.stringify(error));
    }
    console.error("Server error: ", error);
    return EMPTY;
  }
}
