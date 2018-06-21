import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatExpansionModule,
  MatListModule,
  MatTabsModule,
  MatTableModule,
  MatCardModule
} from '@angular/material';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule} from "@angular/forms";
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule} from "@angular/router";
import { HttpClientModule} from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SimulatorComponent } from './components/simulator/simulator.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { AuthGuard } from "./security/auth.guard";
import { StocksComponent } from './components/stocks/stocks.component';
import { SignupComponent } from './components/signup/signup.component';
import {ChartModule} from "angular2-highcharts";
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts/highstock';

export function highchartsFactory() {
  return highcharts;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    SimulatorComponent,
    PortfolioComponent,
    StocksComponent,
    SignupComponent
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
    MatSnackBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    ChartModule,
    RouterModule.forRoot([

      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'simulator',
        component: SimulatorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'stocks',
        component: StocksComponent
      },
      {
        path: '',
        component: LoginComponent
      }
    ])
  ],
  providers: [
    AuthGuard,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

