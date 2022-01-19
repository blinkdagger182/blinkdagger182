import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vars } from '../extraordinaire-vars';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { StaffId, StaffIdArr } from "./arrCons";
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { SummVars } from './summ-vars';
import { timestamp } from 'rxjs/operator/timestamp';
import { ExorTrackingComponent } from '../tracking/tracking.component';
import { SharingService } from '../extraordinaire-sharing-service';

@Component({
    selector: 'app-u-summary-component',
    templateUrl: './summary.component.html',
    styleUrls: ['../extraordinaire.component.css']
})
export class ExorSummaryComponent implements OnInit {
    hPendApproval = Vars.hPendApproval; hHistApproval = Vars.hHistApproval; hTracking = Vars.hTracking;
    hNew = Vars.hNew; hUpdate = Vars.hUpdate;

    iPPendApproval = Vars.iPPendApproval; iPHistApproval = Vars.iPHistApproval; iPTracking = Vars.iPTracking;
    iPNew = Vars.iPNew; iPUpdate = Vars.iPUpdate;

    loading = true; errLoading = false;
    toEditId = "0"; toEdit = false;
    constructor(
        private sharingService: SharingService,
        private formBuilder: FormBuilder, private _script: ScriptLoaderService, private _POST_api_Service: POST_Service,
        private _GET_api_Service: GET_Service, private route: ActivatedRoute
    ) {
        this.sharingService.dataString$.subscribe(
            data => {
                // console.log(data);
                this.toEditId = data;
                if (this.toEditId != '0') {
                    this.toEdit = true; this.collapseCreatePro = false;
                } else { this.toEdit = false; }
                //console.log(this.toEdit);
            });
        this.getSummData('all');

    }

    ngOnInit() {


    }

    summDataPendAppr: any; summDataApprHist: any; summDataTracking: any;
    summDataMyApproval: any; summDataMyImg: any; summDataMyLobsList: any;
    summDataMySumm: any; summDataTarget: any;
    displayPendAppr = true; displayHist = true; displayTracking = true; displayNew = true;

    loadingTracking = false;
    getSummData(type) {
        this.loading = true;
        let typeArr = type.toLocaleUpperCase().split(",");
        for (let i = 0; i < typeArr.length; i++) {
            typeArr[i] = typeArr[i].trim();
        }
        if (typeArr.indexOf('tracking') >= 0) {
            this.loadingTracking = true;
        }

        this._GET_api_Service.GET_data(SummVars.APISummDetails).subscribe(data => {
            this.summDataPendAppr = data.pending;
            if (!data.pending || data.pending.length < 1)
                this.displayPendAppr = false;
            this.summDataApprHist = data.approved;
            if (!data.approved || data.approved.length < 1)
                this.displayHist = false;
            this.summDataTracking = data.history;
            if (!data.history || data.history.length < 1)
                this.displayTracking = false;
            this.summDataMyApproval = data.approval[0];
            this.summDataMyImg = data.images; this.summDataMyLobsList = data.lobs;
            this.summDataMySumm = data.summary[0]; this.summDataTarget = data.target;
            //console.log(data);
            this.hideAllLoading();
        },
            error => {
                console.log('[ERROR] Fetching Summary Data: ' + error);
                this.errLoading = true;
                this.hideAllLoading();
            });
    }


    collapseTracking = true; collapseCreatePro = true; collapseHistory = true;

    hideAllLoading() {
        this.loading = false; this.loadingTracking = false;

        if (this.displayPendAppr == false && this.displayTracking == true) {
            this.collapseTracking = false;
        }
        if (this.displayPendAppr == false && this.displayTracking == false) {
            this.collapseCreatePro = false;
        }
    }

}
