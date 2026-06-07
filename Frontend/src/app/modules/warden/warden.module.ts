import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WardenRoutingModule } from './warden-routing.module';
import { WardenDashboardComponent } from './dashboard/warden-dashboard.component';
import { WardenComplaintDetailsComponent } from './complaint-details/warden-complaint-details.component';

@NgModule({
  declarations: [
    WardenDashboardComponent,
    WardenComplaintDetailsComponent,
  ],
  imports: [
    CommonModule,
    WardenRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class WardenModule { }
