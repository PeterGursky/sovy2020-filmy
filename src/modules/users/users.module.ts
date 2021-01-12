import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MaterialModule } from '../material.module';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
