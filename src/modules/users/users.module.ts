import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [UsersMenuComponent, UsersListComponent, UserAddComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
