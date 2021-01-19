import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilmsComponent } from './films/films.component';
import { SimpleFilmsComponent } from './simple-films/simple-films.component';

const routes: Routes = [
  { path: '', component: SimpleFilmsComponent},
  { path: 'list', component: FilmsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
