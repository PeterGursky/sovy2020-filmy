import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Film } from 'src/entities/film';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-simple-films',
  templateUrl: './simple-films.component.html',
  styleUrls: ['./simple-films.component.css']
})
export class SimpleFilmsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'nazov', 'rok'];
  dataSource = new MatTableDataSource<Film>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private filmsService: FilmsService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filmsService.getSimpleFilms().subscribe(filmsResponse => {
      this.dataSource.data = filmsResponse.items;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
