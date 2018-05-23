import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {MatButtonModule, MatCheckboxModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SimulatorComponent } from './components/simulator/simulator.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import {AuthGuard} from "./security/auth.guard";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    SimulatorComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule.forRoot([

      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'simulator',
        component: SimulatorComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'portfolio',
        component: PortfolioComponent
      },
      {
        path: '',
        component: LoginComponent
      }
    ])
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
