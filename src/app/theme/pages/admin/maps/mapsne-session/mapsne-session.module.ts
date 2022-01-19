import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { MapsneSessionComponent } from './mapsne-session.component';
//import { DefaultMapsComponent } from '../../default-maps/default-maps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../../../shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { SuiModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';
import { SuiSelectModule } from 'ng2-semantic-ui';
import { MatInputModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { mapsDefaultComponent } from '../default/default.component';

const routes: Routes = [
  {
      'path': '',
      'component': mapsDefaultComponent,
      'children': [
          {
              'path': '',
              'component': MapsneSessionComponent,
          },
      ],
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, SuiModule,
    SuiSelectModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    //NgxChartsModule,
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
    })
], exports: [
    RouterModule,
], declarations: [MapsneSessionComponent], bootstrap: [MapsneSessionComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService,
      {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
})
export class mapsnesessionModule { }
