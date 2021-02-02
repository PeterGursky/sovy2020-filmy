import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  name: string = "";
  message: string = "";
  messages: Message[] = [];
  socketSubscription: Subscription;
  connected = false;

  @ViewChild('messageField') messageField: ElementRef;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.disconnect();
    }
  }

  connect() {
    this.socketSubscription = this.chatService.connect().subscribe(frame => {
      this.connected = true;
      this.chatService.listenGreetings().subscribe( greeting => {
        this.messages = [{sender: 'server', message: greeting}, ...this.messages];
      });
      this.chatService.listenMessages().subscribe( ({name, message}) => {
        this.messages = [{sender: name, message}, ...this.messages];
      });
      this.chatService.sendName(this.name);
      setTimeout(() => this.messageField.nativeElement.focus(), 0);
    });
  }

  sendMessage() {
    this.chatService.sendMessage({name: this.name, message: this.message});
    this.message = "";
    this.messageField.nativeElement.focus();
  }

  disconnect() {
    this.socketSubscription.unsubscribe();
    this.socketSubscription = undefined;
    this.connected = false;
  }
}

interface Message {
  sender: string;
  message: string;
}