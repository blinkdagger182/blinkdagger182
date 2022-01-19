import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vars } from '../settings-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { CAVars } from './closed-ads-vars';
import { PagerService } from '../../job/shared/pager/pager.component';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-closed-ads-component',
    templateUrl: './closed-ads.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgClosedAdsComponent implements OnInit {
    title1 = Vars.title1;
    closed = Vars.closed; ads = GlobalVariable.ADS;
    loading = true;
    err = false;
    closeAdsAPI = CAVars.closeAdsAPI;
    postCloseAds = CAVars.postCloseAds;

    private readonly notifier: NotifierService;

    constructor(
        private route: ActivatedRoute,
        private pagerService: PagerService,
        private _script: ScriptLoaderService,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
    ) {
        this.notifier = notifierService;
    }

    ngOnInit() {
        this.loading = false;
        this.setPageClosedAds(1);
        this.getCloseAdsList();
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-closed-ads-component',
            [
                'assets/js/superadmin/close-ads-alert.js',
            ]);
    }

    ListClosedAds = [];

    getCloseAdsList() {
        this.loading = true;
        this._GET_api_Service.GET_data(this.closeAdsAPI).subscribe(data => {
            this.ListClosedAds = data;
            this.setPageClosedAds(1);
            this.loading = false;
        });
    }

    pagerClosedAds: any = {}; pagedItemsClosedAds: any[];
    setPageClosedAds(page: number) {
        this.pagerClosedAds = this.pagerService.getPager(this.ListClosedAds.length, page, Vars.clsMaxPerPage);
        this.pagedItemsClosedAds = this.ListClosedAds.slice(this.pagerClosedAds.startIndex, this.pagerClosedAds.endIndex + 1);
        window.scrollTo(0, 170);
    }

    selAds: any = {};
    selectedAds(adsData) {
        this.selAds = adsData;
    }

    closeAdsSubmit() {
        let data = {
            id: this.selAds.id
        }
        let closeAdsSend = this._POST_api_Service.POST_data(this.postCloseAds, data);
        let dataCloseAds: any = {};
        let ret = closeAdsSend.subscribe(dataRes => {
            dataCloseAds = dataRes;
            if (dataCloseAds.status === "OK") {
                this.notifier.notify('success', 'Successfully Close Ads !');
                this.getCloseAdsList();
            } else {
                this.notifier.notify('error', 'Error - Fail to close ads !');
            }
        },
            error => {
                console.log('[ERROR + Ads Not Found]', error);
            }
        )

    }
}
