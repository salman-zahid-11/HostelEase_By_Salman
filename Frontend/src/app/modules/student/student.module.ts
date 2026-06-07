import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentRoutingModule } from './student-routing.module';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { ComplaintDetailsComponent } from './complaint-details/complaint-details.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    ReportIssueComponent,
    ComplaintDetailsComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class StudentModule { }
