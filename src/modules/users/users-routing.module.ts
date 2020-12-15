import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserAddComponent } from './user-add/user-add.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersMenuComponent } from './users-menu/users-menu.component';

const routes: Routes = [
  { path: '', component: UsersMenuComponent, canActivate: [AuthGuard],
    children: [
      {path: 'list', component: UsersListComponent},
      {path: 'add', component: UserAddComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
