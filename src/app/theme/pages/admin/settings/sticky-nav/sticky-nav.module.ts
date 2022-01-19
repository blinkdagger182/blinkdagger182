
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { StgStickyNavComponent } from './sticky-nav.component';

import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';

import { StgJobUserComponent } from '../job-user/job-user.component';
import { StgClosedAdsComponent } from '../closed-ads/closed-ads.component';
import { StgBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';
import { StgFeedbacksComponent } from '../feedbacks/feedbacks.component';
import { StgVerifySkillsetsComponent } from '../verify-skillsets/verify-skillsets.component';
import { StgEraAppVersioningComponent } from '../era-app-versioning/era-app-versioning.component';
import { StgUnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { CountdownPipe } from '../broadcast-message/pipes';
import { CountdownPipe2 } from '../broadcast-message-career/pipes';

const heroesRoutes: Routes = [
    {
        'path': 'broadcast-message',
        'component': DefaultComponent,
    },
    {
        'path': 'feedbacks',
        'component': StgFeedbacksComponent,
    },
];
/*const heroesRoutes: Routes = [ 
  {
    'path': '',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgJobUserComponent,
      },
    ],
  },
  {
    'path': 'job-user',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgJobUserComponent,
      },
    ],
  },
  {
    'path': 'closed-ads',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgClosedAdsComponent,
      },
    ],
  },
  {
    'path': 'broadcast-message',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgBroadcastMessageComponent,
      },
    ],
  },
  {
    'path': 'feedbacks',
    'component': StgFeedbacksComponent,
    'children': [
      {
        'path': '',
        'component': StgFeedbacksComponent,
      },
    ],
  },
  {
    'path': 'verify-skillsets',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgVerifySkillsetsComponent,
      },
    ],
  },
  {
    'path': 'era-app-versioning',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgEraAppVersioningComponent,
      },
    ],
  },
  {
    'path': 'unauthorized',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': StgUnauthorizedComponent,
      },
    ],
  },
];*/

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(heroesRoutes)
        , LayoutModule
    ],
    declarations: [
        StgStickyNavComponent
    ],
    exports: [StgStickyNavComponent, RouterModule],
    providers: [CountdownPipe, CountdownPipe2]
})
export class StickyNavModule { }
