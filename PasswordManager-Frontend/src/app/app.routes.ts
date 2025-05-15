import { Routes } from '@angular/router';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: PasswordManagerComponent },
  { path: 'profile', component: ProfileComponent }
];
