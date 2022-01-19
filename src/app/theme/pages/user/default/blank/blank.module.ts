import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { UserDefaultComponent } from '../default.component';
import { UserBlankComponent } from './blank.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { HrefPreventDefaultDirective } from '../../../../../_directives/href-prevent-default.directive';
import { UnwrapTagDirective } from '../../../../../_directives/unwrap-tag.directive';
import { NotifierModule } from 'angular-notifier';
import { MatButtonModule } from '@angular/material';
import { AngularDraggableModule } from 'angular2-draggable';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { animation } from '@angular/core/src/animation/dsl';
import {EmojiPickerModule} from 'ng-emoji-picker';


const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': UserBlankComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, AngularDraggableModule,
        MatButtonModule,EmojiPickerModule,
        NotifierModule.withConfig({
            position: {
                horizontal: {
                    /**
                     * Defines the horizontal position on the screen
                     * @type {'left' | 'middle' | 'right'}
                     */
                    position: 'right',
                    /**
                     * Defines the horizontal distance to the screen edge (in px)
                     * @type {number} 
                     */
                    distance: 12
                },
            }
        }),
        NgCircleProgressModule.forRoot({
            radius: 50,
            outerStrokeWidth: 10,
            innerStrokeWidth: 10,
            space: -10,
            outerStrokeColor: "#05BACE",
            innerStrokeColor: "#ffffff",
            animationDuration: 300,
            titleColor: "#66538C",
            showTitle: false,
            showUnits: false,
            showSubtitle: false
          })
    ], exports: [
        RouterModule,
        HrefPreventDefaultDirective,
    ], declarations: [
        UserBlankComponent,

        HrefPreventDefaultDirective,
        UnwrapTagDirective,
    ],
    providers: [GET_Service, POST_Service]
})
export class UserBlankModule {
}