import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../theme/layouts/layout.module';
//import { DefaultComponent } from '../default/default.component';
import { WelcomeComponent } from './welcome.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        'path': '',
        'component': WelcomeComponent,
        'children': [
            {
                'path': '',
                'component': WelcomeComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, LayoutModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        WelcomeComponent,
    ],
})
export class WelcomeModule {
}