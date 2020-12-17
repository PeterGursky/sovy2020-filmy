import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { MaterialModule } from '../material.module';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';

@NgModule({
  declarations: [
    UsersMenuComponent, 
    UsersListComponent, 
    UserAddComponent,
    GroupsToStringPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
