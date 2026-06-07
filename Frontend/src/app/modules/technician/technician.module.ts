import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianRoutingModule } from './technician-routing.module';
import { TechnicianDashboardComponent } from './technician-dashboard/technician-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// add DatePipe to providers: [DatePipe]

@NgModule({
  declarations: [
    TechnicianDashboardComponent
  ],
  imports: [
    CommonModule,
    TechnicianRoutingModule,
    HttpClientModule,
    DatePipe
  ]
})
export class TechnicianModule { }