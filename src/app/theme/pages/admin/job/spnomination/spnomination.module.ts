// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
// This Module's Components
import { SpnominationComponent } from './spnomination.component';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuccessorFilterPipe } from '../../../user/nomination/SPTypeFilterPipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';
import { SharedModule } from '../../../../../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { AdminLoadingModule } from '../../loading/loading.module';
import { ImageService } from '../../../user/nomination/ImageService';
import { DefaultComponent } from '../../default/default.component';
const routes: Routes = [
  {
    'path': '',
    'component': DefaultComponent,
    'children': [
          {
              'path': '',
              'component': SpnominationComponent,
          },
      ],
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, SharedModule, QuillModule,
    ReactiveFormsModule, NgbModule.forRoot(), SuiModule, AdminLoadingModule,  NotifierModule.withConfig({
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
    })
], exports: [
    SpnominationComponent, RouterModule, 
], declarations: [
  SpnominationComponent,
],
providers: [POST_Service, GET_Service, AlertService, ImageService]
})
export class SpnominationModule { }



