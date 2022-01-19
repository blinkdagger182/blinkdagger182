
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { ExorSummaryComponent } from './summary.component';

import { ExOrApprPendingModule } from '../pending/pending.module';
import { ExOrHistoryModule } from '../history/history.module';
import { ExOrTrackingModule } from '../tracking/tracking.module';
import { ExOrNewModule } from '../new/new.module';


import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { UserLoadingModule } from '../../../user/loading/loading.module';
import { UserLoadingErrorModule } from '../../../user/loading-error/loading-error.module';
@NgModule({
    imports: [
        CommonModule, ExOrApprPendingModule, ExOrHistoryModule, ExOrTrackingModule, ExOrNewModule,
        FormsModule, UserLoadingModule, UserLoadingErrorModule,
    ],
    declarations: [
        ExorSummaryComponent,
    ],
    exports: [ExorSummaryComponent, RouterModule],
    providers: [
        POST_Service, GET_Service
    ]
    // providers:[CountdownPipe]
})
export class ExOrSummaryModule { }
