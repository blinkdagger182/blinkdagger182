import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { surveyComponent } from './survey.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { UserLoadingModule } from '../loading/loading.module';
import { SharedModule } from '../../../../shared/shared.module'



const routes: Routes = [
    {
        'path': '',
        'component': surveyComponent,
        'children': [
            {
                'path': '',
                'component': surveyComponent,
            },
           

        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, LayoutModule
    ], exports: [
        RouterModule,
    ], declarations: [
        surveyComponent,
    ],
})
export class SurveyModule {
}