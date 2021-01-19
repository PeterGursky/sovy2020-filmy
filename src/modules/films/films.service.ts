import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FilmsResponse } from 'src/entities/films-response';
import { SnackbarService } from 'src/services/snackbar.service';

@Injectable()
export class FilmsService {
  private serverUrl = "http://localhost:8080/films";

  constructor(private http: HttpClient, private snackbarServise: SnackbarService,
              private store: Store) { }
  
  get token() {
    return this.store.selectSnapshot(state => state.auth.token);
  }

  get tokenHeader(): {
    headers?: { [header:string]: string};
    params?: HttpParams
  } {
    return this.token ? { headers: {'X-Auth-Token': this.token}}: undefined;
  }

  getSimpleFilms(): Observable<FilmsResponse> {
    return this.http.get<FilmsResponse>(this.serverUrl).pipe(
      catchError(error => this.processHttpError(error))
    );
  }

  getFilms(indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let httpOptions = this.tokenHeader;
    if (indexFrom || indexTo || search) {
      httpOptions = { ... (httpOptions || {}), params: new HttpParams()};
      if (indexFrom) {
        httpOptions.params = httpOptions.params.set('indexFrom', indexFrom.toString());
      }
      if (indexTo) {
        httpOptions.params = httpOptions.params.set('indexTo', indexTo.toString());
      }
      if (search) {
        httpOptions.params = httpOptions.params.set('search', search);
      }
    }
    return this.http.get<FilmsResponse>(this.serverUrl, httpOptions).pipe(
      catchError(error => this.processHttpError(error))
    );
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
