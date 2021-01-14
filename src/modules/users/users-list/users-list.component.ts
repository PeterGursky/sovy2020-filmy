import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog.component';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit {

  usersDataSource = new MatTableDataSource<User>();
  columns = ['id','name', 'email', 'active', 'lastLogin', 'groups', 'permissions', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private usersService: UsersService, private dialog: MatDialog) { }
  
  ngAfterViewInit(): void {
    this.usersDataSource.paginator = this.paginator;
    this.usersDataSource.sort = this.sort;
    this.usersDataSource.sortingDataAccessor = (user:User, headerName:string) => {
      switch (headerName) {
        case 'groups':
          return user.groups[0] ? user.groups[0].name : 'zzz';
        case 'permissions':
          return user.groups
                  .flatMap(group => group.permissions)
                  .reduce((acc, perm) => acc.includes(perm) ? acc : [...acc, perm], [])
                  .length;
        default:
          return user[headerName];
      }
    }
    this.usersDataSource.filterPredicate = (user: User, filter: string) => {
      [user.id, user.name, user.email, user.active].forEach( value => {
        if (("" + value).includes(filter)) {
          return true;
        }
      });
      return user.groups.some(group => group.name.includes(filter));
    }
    this.usersService.getExtendedUsers().subscribe(users => {
      this.usersDataSource.data = users;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogData("Deleting user", "Do you really want to delete user " + user.name + "?")
    });

    dialogRef.afterClosed().subscribe(userWantsToDelete => {
      if (userWantsToDelete) {
        this.usersService.deleteUser(user).subscribe(ok => {
          if (ok) {
            this.usersDataSource.data = this.usersDataSource.data.filter(u => u.id != user.id);
          }
        })    
      }
    });
  }
}
