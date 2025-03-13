import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {PageNotFountComponent} from './components/page-not-fount/page-not-fount.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {AnalysisComponent} from './components/analysis/analysis.component';
import {StoreComponent} from './components/store/store.component';
import {ProfileComponent} from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'store', component: StoreComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: PageNotFountComponent }
];
