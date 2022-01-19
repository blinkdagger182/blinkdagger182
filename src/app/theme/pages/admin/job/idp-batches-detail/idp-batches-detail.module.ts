import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { IdpBatchesDetailComponent } from './idp-batches-detail.component';
const routes: Routes = [
  {
      'path': '',
      'component': DefaultComponent,
      'children': [
          {
              'path': '',
              'component': IdpBatchesDetailComponent,
          },
      ],
  },
];

@NgModule({
  imports: [
    FormsModule, HttpModule,
    CommonModule, RouterModule.forChild(routes), LayoutModule, ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule,],
  declarations: [IdpBatchesDetailComponent], bootstrap: [IdpBatchesDetailComponent],
})
export class IdpBatchesDetailModule { }
