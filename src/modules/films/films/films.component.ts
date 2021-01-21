import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, mergeAll, startWith, switchMap, tap } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { AuthState } from 'src/shared/auth.state';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'nazov', 'slovenskyNazov', 'rok', 'afi1998', 'afi2007'];
  dataSource: FilmsDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Select(AuthState.userName) userName$: Observable<string>;

  constructor(filmsService: FilmsService) { 
    this.dataSource = new FilmsDataSource(filmsService);
    this.userName$.subscribe(userName => {
      if(userName) {
        this.displayedColumns = ['id', 'nazov', 'slovenskyNazov', 'rok', 'afi1998', 'afi2007'];
      } else {
        this.displayedColumns = ['id', 'nazov', 'rok'];
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.addObservables(this.paginator, this.sort);
  }

   applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
   }
}

class FilmsDataSource implements DataSource<Film> {
  futureObservables = new EventEmitter<Observable<any>>();
  paginator: MatPaginator;
  indexFrom: number;
  indexTo: number;
  search: string;
  orderBy: string;
  descending: boolean;

  constructor(private filmsService: FilmsService) { }

  addObservables(paginator:MatPaginator, sort: MatSort) {
    this.paginator = paginator;
//    this.futureObservables.next(of({}));
    this.futureObservables.next(paginator.page);
    this.futureObservables.next(sort.sortChange.pipe(
      tap((sortEvent: Sort) => {
        if (sortEvent.direction === '') {
          this.descending = undefined;
          this.orderBy = undefined;
          return;
        }
        this.descending = sortEvent.direction === 'desc';
        switch (sortEvent.active) {
          case 'afi1998':
            this.orderBy = 'poradieVRebricku.AFI 1998'
            break;
          case 'afi2007':
            this.orderBy = 'poradieVRebricku.AFI 2007'
            break;
          default:
            this.orderBy = sortEvent.active;
        }
      })
    ));
  }

  connect(): Observable<Film[]> {
    return this.futureObservables.pipe(
      mergeAll(),
      startWith({}),
      tap(event => console.log('event: ' + JSON.stringify(event))),
      switchMap(_event => {
        return this.filmsService.getFilms(
          this.indexFrom,
          this.indexTo,
          this.search,
          this.orderBy,
          this.descending
        ).pipe(
          tap(response => console.log("received films: ", response)),
          map(response => response.items)
        );
      })
    );
  }

  disconnect(): void {
  }
  
}
