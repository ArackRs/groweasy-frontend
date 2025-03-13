import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {PageNotFountComponent} from './pages/page-not-fount/page-not-fount.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {AnalysisComponent} from './components/analysis/analysis.component';
import {StoreComponent} from './components/store/store.component';
import {ProfileComponent} from './pages/profile/profile.component';

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
