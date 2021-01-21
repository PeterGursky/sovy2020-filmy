import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilmsComponent } from './films/films.component';
import { SimpleFilmsComponent } from './simple-films/simple-films.component';

const routes: Routes = [
  { path: '', component: FilmsComponent},
  { path: 'list', component: SimpleFilmsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
