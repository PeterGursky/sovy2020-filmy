import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit {

  users: User[];
  columns = ['id','name', 'email', 'active', 'lastLogin','groups'];

  constructor(private usersService: UsersService) { }
  
  ngAfterViewInit(): void {
    this.usersService.getExtendedUsers().subscribe(users => this.users = users);
  }

}
