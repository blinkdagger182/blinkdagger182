import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { IdpBatchesComponent } from './idp-batches.component';
import { DefaultComponent } from '../../default/default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';
const routes: Routes = [
  {
      'path': '',
      'component': DefaultComponent,
      'children': [
          {
              'path': '',
              'component': IdpBatchesComponent,
          },
      ],
  },
];

@NgModule({
  imports: [
    FormsModule, HttpModule,
    CommonModule, RouterModule.forChild(routes), LayoutModule, ReactiveFormsModule,
  ],
  declarations: [IdpBatchesComponent], bootstrap: [IdpBatchesComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService]
})
export class IdpBatchesModule { }
