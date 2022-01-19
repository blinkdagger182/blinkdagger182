import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { UserTalentComponent } from './talent.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TalentLoadingModule } from './talent-loading/talent-loading.module'

import { SubFilterPipe } from './subFilter';


const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': UserTalentComponent,
            },
           ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, NgbModule.forRoot(),
        FormsModule, ReactiveFormsModule,
        TalentLoadingModule
    ], exports: [
        RouterModule,
    ], declarations: [
        UserTalentComponent, SubFilterPipe
    ],
    providers: [POST_Service, GET_Service, AlertService]
})
export class TalentModule {
}