import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default/default.component';
import { TotalDownloadsComponent } from './total-downloads/total-downloads.component';
import { CurrentMonthDownloadsComponent } from './current-month-downloads/current-month-downloads.component';
import { UserDeviceComponent } from './user-device/user-device.component';
import { AdoptionRateComponent } from './adoption-rate/adoption-rate.component';
import { TotalJobAdvertisedComponent } from './total-job-advertised/total-job-advertised.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { SuccessfulApplicantComponent } from './successful-applicant/successful-applicant.component';
import { CurrentMonthJobAdvertisedComponent } from './current-month-job-advertised/current-month-job-advertised.component';
import { TotalNePromotionAdsComponent } from './total-ne-promotion-ads/total-ne-promotion-ads.component';
import { CurrentMonthNePromotionAdsComponent } from './current-month-ne-promotion-ads/current-month-ne-promotion-ads.component';
import { NeJobApplicationComponent } from './ne-job-application/ne-job-application.component';
import { NeSuccessfulApplicantComponent } from './ne-successful-applicant/ne-successful-applicant.component';
import { TotalExtraordinaireAdsComponent } from './total-extraordinaire-ads/total-extraordinaire-ads.component';
import { CurrentMonthExtraordinaireAdsComponent } from './current-month-extraordinaire-ads/current-month-extraordinaire-ads.component';
import { ExtraordinaireApplicationComponent } from './extraordinaire-application/extraordinaire-application.component';
import { ExtraordinaireSuccessfulApplicantComponent } from './extraordinaire-successful-applicant/extraordinaire-successful-applicant.component';

const dashboardRoutes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': TotalDownloadsComponent, //StgJobUserComponent,
            },
            {
                'path': 'total-downloads',
                'component': TotalDownloadsComponent, //StgJobUserComponent,
            },
            {
                'path': 'current-month-downloads',
                'component': CurrentMonthDownloadsComponent, //StgJobUserComponent,
            },
            {
                'path': 'user-device',
                'component': UserDeviceComponent, //StgJobUserComponent,
            },
            {
                'path': 'adoption-rate',
                'component': AdoptionRateComponent, //StgJobUserComponent,
            },
            {
                'path': 'total-job-advertised',
                'component': TotalJobAdvertisedComponent, //StgJobUserComponent,
            },
            {
                'path': 'job-application',
                'component': JobApplicationComponent, //StgJobUserComponent,
            },
            {
                'path': 'successful-applicant',
                'component': SuccessfulApplicantComponent, //StgJobUserComponent,
            },
            {
                'path': 'current-month-job-advertised',
                'component': CurrentMonthJobAdvertisedComponent, //StgJobUserComponent,
            },
            {
                'path': 'total-ne-promotion-ads',
                'component': TotalNePromotionAdsComponent, //StgJobUserComponent,
            },
            {
                'path': 'current-month-ne-promotion-ads',
                'component': CurrentMonthNePromotionAdsComponent, //StgJobUserComponent,
            },
            {
                'path': 'ne-job-application',
                'component': NeJobApplicationComponent, //StgJobUserComponent,
            },
            {
                'path': 'ne-successful-applicant',
                'component': NeSuccessfulApplicantComponent, //StgJobUserComponent,
            },
            {
                'path': 'total-extraordinaire-ads',
                'component': TotalExtraordinaireAdsComponent, //StgJobUserComponent,
            },
            {
                'path': 'current-month-extraordinaire-ads',
                'component': CurrentMonthExtraordinaireAdsComponent, //StgJobUserComponent,
            },
            {
                'path': 'extraordinaire-application',
                'component': ExtraordinaireApplicationComponent, //StgJobUserComponent,
            },
            {
                'path': 'extraordinaire-successful-applicant',
                'component': ExtraordinaireSuccessfulApplicantComponent, //StgJobUserComponent,
            },
        ],
    },


];

@NgModule({
    imports: [
        RouterModule.forChild(dashboardRoutes), LayoutModule
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardsRoutingModule { }

