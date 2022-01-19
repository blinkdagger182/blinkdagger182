import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { UserDefaultComponent } from '../../default/default.component';
import { MeterComponent } from './meter.component';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { UserLoadingModule } from '../../loading/loading.module';

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': MeterComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, UserLoadingModule
    ], exports: [
        RouterModule,
    ], declarations: [
        MeterComponent,
    ],
    providers: [GET_Service, AlertService]
})
export class MeterModule {
}