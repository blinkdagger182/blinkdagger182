import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { NotificationsComponent } from './notifications.component';
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
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': NotificationsComponent,
            },
           

        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, UserLoadingModule,
        FormsModule, ReactiveFormsModule, SuiModule, SharedModule
    ], exports: [
        RouterModule,
    ], declarations: [
        NotificationsComponent
    ], providers: [GET_Service, AlertService, POST_Service],
})
export class NotificationsModule {
}