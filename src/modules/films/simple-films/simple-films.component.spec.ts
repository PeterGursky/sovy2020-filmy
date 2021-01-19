import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFilmsComponent } from './simple-films.component';

describe('SimpleFilmsComponent', () => {
  let component: SimpleFilmsComponent;
  let fixture: ComponentFixture<SimpleFilmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleFilmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFilmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
