import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Auth } from 'src/entities/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private serverUrl = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  login(auth:Auth): Observable<string> {
    return this.http.post(this.serverUrl + "login", auth, {responseType: 'text'}).pipe(
      catchError(error => this.processHttpError(error))
    );
  }

  processHttpError(error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
//        this.messageService.sendMessage("Server je nedostupný");
      } else {
        if (error.status >= 400 && error.status < 500) {  
          const message = error.error.errorMessage ?? JSON.parse(error.error).errorMessage;
//          this.messageService.sendMessage(message);
        } else {
//          this.messageService.sendMessage("chyba servera: " + error.message);
        }
      }
    } else {
//      this.messageService.sendMessage("Chyba programátora : " + JSON.stringify(error));
    }
    console.error("Chyba zo servera: ", error);
    return EMPTY;
  }
}
