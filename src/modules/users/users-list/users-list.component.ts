import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog.component';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit {

  users: User[];
  columns = ['id','name', 'email', 'active', 'lastLogin', 'groups', 'permissions', 'actions'];

  constructor(private usersService: UsersService, private dialog: MatDialog) { }
  
  ngAfterViewInit(): void {
    this.usersService.getExtendedUsers().subscribe(users => this.users = users);
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogData("Deleting user", "Do you really want to delete user " + user.name + "?")
    });

    dialogRef.afterClosed().subscribe(userWantsToDelete => {
      if (userWantsToDelete) {
        this.usersService.deleteUser(user).subscribe(ok => {
          if (ok) {
            this.users = this.users.filter(u => u.id != user.id)
          }
        })    
      }
    });
  }
}
