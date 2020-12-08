import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { 
    path: 'groups',
    loadChildren:() => 
      import('../modules/groups/groups.module').then(mod => mod.GroupsModule),
    canLoad: [AuthGuard]
  },
  { 
    path: 'users',
    loadChildren:() => 
      import('../modules/users/users.module').then(mod => mod.UsersModule),
    canLoad: [AuthGuard]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
