import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserLoadingModule } from '../../user/loading/loading.module';
import { UserDefaultComponent } from '../default/default.component';
import { OtherProfileComponent } from './other.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': OtherProfileComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, UserLoadingModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        OtherProfileComponent,
    ],
    providers: [POST_Service, GET_Service, AlertService]
})
export class OtherProfileModule {
}