import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
//import { LayoutModule } from '../../layouts/layout.module';
//import { DefaultComponent } from '../default/default.component';
import { Welcome2Component } from './welcome2.component';

const routes: Routes = [
    {
        'path': '',
        'component': Welcome2Component,
        'children': [
            {
                'path': '',
                'component': Welcome2Component,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), //LayoutModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        Welcome2Component,
    ],
})
export class Welcome2Module {
}