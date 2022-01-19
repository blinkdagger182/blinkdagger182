import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { EngageDefaultComponent } from '../default/default.component';
import { EngageUnauthorizedPageComponent } from './unauthorized.component';

const routes: Routes = [
    {
        'path': '',
        'component': EngageDefaultComponent,
        'children': [
            {
                'path': '',
                'component': EngageUnauthorizedPageComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        EngageUnauthorizedPageComponent,
    ],
})
export class EngageUnauthorizedPageModule {
}