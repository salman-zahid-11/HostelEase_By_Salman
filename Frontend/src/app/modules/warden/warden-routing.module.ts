import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardenDashboardComponent } from './dashboard/warden-dashboard.component';
import { WardenComplaintDetailsComponent } from './complaint-details/warden-complaint-details.component';

const routes: Routes = [
  { path: 'dashboard', component: WardenDashboardComponent },
  { path: 'complaint/:id', component: WardenComplaintDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WardenRoutingModule { }
