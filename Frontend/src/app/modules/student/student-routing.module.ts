import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { ComplaintDetailsComponent } from './complaint-details/complaint-details.component';

const routes: Routes = [
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'report-issue', component: ReportIssueComponent },
  { path: 'complaint/:id', component: ComplaintDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
