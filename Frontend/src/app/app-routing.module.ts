import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'student',
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule),
    canActivate: [AuthGuard],
    data: { roles: ['student'] }
  },
  {
    path: 'warden',
    loadChildren: () => import('./modules/warden/warden.module').then(m => m.WardenModule),
    canActivate: [AuthGuard],
    data: { roles: ['warden', 'admin'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'technician',
    loadChildren: () => import('./modules/technician/technician.module').then(m => m.TechnicianModule),
    canActivate: [AuthGuard],
    data: { roles: ['technician'] }
  },
  
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
