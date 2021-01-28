import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  name: string = "";

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  connect() {
    this.chatService.connect().subscribe(frame => {
      this.chatService.sendName(this.name);
    });
  }
}
