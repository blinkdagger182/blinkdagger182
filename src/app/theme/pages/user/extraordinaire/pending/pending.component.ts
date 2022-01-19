import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vars } from '../extraordinaire-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { UserPagerService } from '../../pager/pager.component';
import { ExorSummaryComponent } from '../summary/summary.component';
import { PendingVars } from './pending-vars';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-u-exor-appr-pending-component',
    templateUrl: './pending.component.html',
    //styleUrls: ['../approver.component.css']
})
export class ExorApprPendingComponent implements OnInit {
    // links
    rBCast = Vars.rBCast;
    ads = GlobalVariable.ADS; broadcastMsg = Vars.broadcastMsg;

    // new params
    summDataPendAppr: any;
    btnClrRevert = Vars.btnClrRevert;
    btnClrApprove = Vars.btnClrApprove;
    actionForm: FormGroup;
    idx: number;
    loading = true;

    btnShowApprove = true; btnShowRevert = true; showActButton = true;
    private readonly notifier: NotifierService;
    constructor(
        private _script: ScriptLoaderService,
        private _POST_api_Service: POST_Service,
        private pagerService: UserPagerService,
        private route: ActivatedRoute,
        private routers: Router,
        private summData: ExorSummaryComponent, notifierService: NotifierService,
    ) { this.notifier = notifierService; }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }

    ngOnInit() {
        this.summDataPendAppr = this.summData.summDataPendAppr;
        this.setPage(1);
        this.actionForm = new FormGroup({
            projId: new FormControl(this.idx, Validators.required),
            projActTaken: new FormControl(null, Validators.required),
            projRemark: new FormControl(),
        });
    }

    exorShowDetails(idx) {
        this.routers.navigate(['/extraordinaire/details', idx]);
    }

    // ::button action click
    sureRevertTitle: boolean;
    clickAct: string; showFormErr = true; projActTaken: string; apprRemark = false; apprDate = false;
    btnActClick(action, id) {
        this.sureRevertTitle = false;
        this.showActButton = true;
        this.idx = id;
        this.clickAct = action; this.projActTaken = action;
        this.apprRemark = false; this.apprDate = false;
        switch (action) {
            case 'approve':
                this.apprRemark = true; this.apprDate = false;
                break;
            case 'revert':
                this.apprRemark = true; this.apprDate = false; this.sureRevertTitle = true;
                break;
        }
        console.log(this.apprRemark);
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-u-exor-appr-pending-component',
            [
                'assets/js/user/extraordinaire/pending-approval-form.js',
            ]);
    }


    processingReq = false; formMsg = false; showFormMsg = false; closeReload = false;
    formMsgColor: string; formMsgIcon: string; advErrMsg: string;
    actionFormSubmit() {
        this.formMsg = true; this.processingReq = true; this.showFormMsg = false; this.showActButton = false;
        let projId = this.idx;
        let projRemark = this.actionForm.get('projRemark').value;
        let projActTaken = this.projActTaken;

        let API: string;
        let act: number;
        let actData: any;
        let apprPosMsg: string;
        switch (projActTaken) {
            case 'approve':
                API = PendingVars.APIApproveRevert;
                actData = { "id": projId, "approve": 1, "remark": projRemark };
                apprPosMsg = 'Advertisement has been approved.';
                break;
            case 'revert':
                API = PendingVars.APIApproveRevert;
                actData = { "id": projId, "approve": 3, "remark": projRemark };
                apprPosMsg = 'Advertisement has been reverted to the Project Owner.';
                break;
        }

        // console.log(actData); console.log(API); //this.getDetailsData();

        let err = 'Fail to perform request. Please contact your administrator.';
        this._POST_api_Service.POST_data(API, actData).subscribe(dataQuaRes => {
            if (dataQuaRes.status == "OK") {
                this.advErrMsg = apprPosMsg;
                this.formMsgColor = "success"; this.formMsgIcon = "la-thumbs-o-up";
                // this.summData.getSummData('all');
                this.showFormMsg = true;
                this.closeReload = true;
                this.notifier.notify('success', apprPosMsg);
                // need to reload tracking and pending approval
                //this.showBtnAct();
                // setTimeout(function () {
                // this.apprReq = false;
                // this.routers.navigate(['job/pending-approval']);
                // }.bind(this), 3000); //wait 3 Seconds and hide 
            } else {
                this.advErrMsg = err; this.showFormMsg = true;
                this.formMsgColor = "danger"; this.formMsgIcon = "la-warning";
                this.notifier.notify('error', err);
                this.closeReload = false; this.showActButton = true;
            }
            this.processingReq = false; this.formMsg = true; this.showFormMsg = true;
            console.log(this.advErrMsg);
        },
            error => {
                this.advErrMsg = err; this.showFormMsg = true;
                this.formMsgColor = "danger"; this.formMsgIcon = "la-warning";
                console.log('[ERROR] Submit Extraordinaire Form Details ' + error);
                this.processingReq = false; this.formMsg = true; this.showFormMsg = true;
                this.notifier.notify('error', err); this.showActButton = true;
            }
        );
        this.idx = 0;
    }

    btnMyCloseReload() {
        this.summData.getSummData('all');
    }

    private allItems: any[];// array of all items to be paged    
    pager: any = {};// pager object    
    pagedItems: any[];// paged items
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.summDataPendAppr.length, page, PendingVars.maxPerPage);
        this.pagedItems = this.summDataPendAppr.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}
