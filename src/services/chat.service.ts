import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Stomp from 'stompjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket: WebSocket;
  stompClient: Stomp.Client;
  url = 'ws://localhost:8080/ws';

  constructor() { }

  connect(): Observable<string | Stomp.Frame> {
    return new Observable(subscriber => {
      this.socket = new WebSocket(this.url);
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect({},
        (frame:Stomp.Frame) => {
          subscriber.next(frame);
        },
        (error:string | Stomp.Frame)=>{
          subscriber.error(error);
        }
      );
      return {
        unsubscribe: () => {
          this.socket.close();
        }
      }  
    });
  }

  listenGreetings(): Observable<string> {
    return new Observable(subscriber => {
      this.stompClient.subscribe('/topic/greetings', message => {
        subscriber.next(JSON.parse(message.body).content);
      });
    });
  }

  sendName(name:string) {
    this.stompClient.send("/app/hello", {}, JSON.stringify({name}));
  }

  disconnect() {
    this.socket.close();
  }
}
