import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleFilmsComponent } from './simple-films/simple-films.component';
import { FilmsRoutingModule } from './films-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { FilmsService } from './films.service';

@NgModule({
  declarations: [SimpleFilmsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FilmsRoutingModule
  ],
  providers: [FilmsService]
})
export class FilmsModule { }
