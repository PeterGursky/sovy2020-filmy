import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MaterialModule } from '../material.module';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  declarations: [
    UsersMenuComponent, 
    UsersListComponent, 
    GroupsToStringPipe,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
