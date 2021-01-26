import { animate, state, style, transition, trigger } from '@angular/animations';
import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { filter, map, mergeAll, startWith, switchMap, tap } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { AuthState } from 'src/shared/auth.state';
import { FilmsService } from '../films.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FilmsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'nazov', 'slovenskyNazov', 'rok', 'afi1998', 'afi2007'];
  dataSource: FilmsDataSource;
  expandedFilm: Film | null;
  filter$ = new EventEmitter<string>();
  loggedIn = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Select(AuthState.userName) userName$: Observable<string>;

  constructor(filmsService: FilmsService) { 
    this.dataSource = new FilmsDataSource(filmsService);
    this.userName$.subscribe(userName => {
      if(userName) {
        this.loggedIn = true;
        this.displayedColumns = ['id', 'nazov', 'slovenskyNazov', 'rok', 'afi1998', 'afi2007'];
      } else {
        this.loggedIn = false;
        this.displayedColumns = ['id', 'nazov', 'rok'];
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.addObservables(this.paginator, this.sort, this.filter$);
  }

   applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     const filter = filterValue.trim().toLowerCase();
     this.filter$.emit(filter);
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

  addObservables(paginator:MatPaginator, sort: MatSort, filter$: Observable<string>) {
    this.paginator = paginator;
    this.indexFrom = paginator.pageIndex * paginator.pageSize;
    this.indexTo = (paginator.pageIndex + 1) * paginator.pageSize;
    this.futureObservables.next(of({}));
    this.futureObservables.next(filter$.pipe(
      filter((filterEvent : string) => (this.search || "") != filterEvent),
      tap((filterEvent : string) => {
        this.indexFrom = 0;
        this.indexTo = this.paginator.pageSize;
        this.paginator.firstPage();
        this.search = filterEvent || undefined;
      })
    ));
    this.futureObservables.next(paginator.page.pipe(
      filter((pageEvent: PageEvent) => (this.indexFrom != pageEvent.pageIndex * pageEvent.pageSize) ||
                                       (this.indexTo != (pageEvent.pageIndex + 1) * pageEvent.pageSize)),
      tap((pageEvent: PageEvent) => {
        /*
          pageIndex: 0, pageSize: 10 -> indexFrom = 0, indexTo = 10
          pageIndex: 1, pageSize: 10 -> indexFrom = 10, indexTo = 20
          pageIndex: 2, pageSize: 10 -> indexFrom = 20, indexTo = 30

          pageIndex: 0, pageSize: 5 -> indexFrom = 0, indexTo = 5
          pageIndex: 1, pageSize: 5 -> indexFrom = 5, indexTo = 10
          pageIndex: 2, pageSize: 5 -> indexFrom = 10, indexTo = 15
        */
        this.indexFrom = pageEvent.pageIndex * pageEvent.pageSize;
        this.indexTo = (pageEvent.pageIndex + 1) * pageEvent.pageSize;
      })
    ));
    this.futureObservables.next(sort.sortChange.pipe(
      tap((sortEvent: Sort) => {
        this.indexFrom = 0;
        this.indexTo = this.paginator.pageSize;
        this.paginator.firstPage();
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
//      startWith({}),
      tap(event => console.log('event: ' + JSON.stringify(event))),
      switchMap(_event => {
        return this.filmsService.getFilms(
          this.indexFrom,
          this.indexTo,
          this.search,
          this.orderBy,
          this.descending
        ).pipe(
          tap(response => {
            console.log("received films: ", response),
            this.paginator.length = response.totalCount;
          }),
          map(response => response.items)
        );
      })
    );
  }

  disconnect(): void {
  }
  
}
