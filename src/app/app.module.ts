import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/modules/material.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthState } from 'src/shared/auth.state';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { RegisterComponent } from './register/register.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    RegisterComponent,
    ConfirmDialogComponent
  ],
  imports: [
    NgxsModule.forRoot([AuthState], {
      developmentMode: ! environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false
      }
    }),
    NgxsStoragePluginModule.forRoot({
      key: ['auth.token', 'auth.username']
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
