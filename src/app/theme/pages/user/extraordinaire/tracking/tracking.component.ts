import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vars } from '../extraordinaire-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { ExorSummaryComponent } from '../summary/summary.component';
import { NotifierService } from 'angular-notifier';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { TrckVars } from './tracking-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { SummVars } from '../summary/summ-vars';
import { UserPagerService } from '../../pager/pager.component';
import { DetailsVars } from '../details/details-vars';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
// import { SharingService } from '../extraordinaire-sharing-service'; DataService
import { SharingService } from '../extraordinaire-sharing-service';
@Component({
    selector: 'app-u-exor-tracking-component',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.css']
})
export class ExorTrackingComponent implements OnInit {
    // links
    rBCast = Vars.rBCast;

    ads = GlobalVariable.ADS; broadcastMsg = Vars.broadcastMsg;

    msgAdvPeriod = TrckVars.msgAdvPeriod;
    loading = true;


    summDataTracking: any;
    showDetailsBtn = true;
    private readonly notifier: NotifierService;
    myStartDt = new Date();
    myEndDt = new Date(this.myStartDt.getTime() + (13 * 24 * 60 * 60 * 1000));
    start = this.myStartDt;
    message: string;
    arrDetailNewPage = [2, 3, 4, 5, 6, 7, 8, 10];
    arrEdit = [1, 9];

    constructor(
        private pagerService: UserPagerService,
        private route: ActivatedRoute,
        private routers: Router,
        private summData: ExorSummaryComponent,
        notifierService: NotifierService,
        private _script: ScriptLoaderService,
        private _POST_api_Service: POST_Service, private _GET_api_Service: GET_Service,
        private sharingService: SharingService
    ) {
        this.notifier = notifierService;
        // this.sharingService.currentMessage.subscribe(message => this.message = message);
    }

    newMessage(abc) {
        // this.sharingService.changeMessage("Hello from Sibling "+abc);
        //console.log(this.message);
    }


    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }

    actionForm: FormGroup;
    idx: number;
    ngOnInit() {
        this.summDataTracking = this.summData.summDataTracking;
        this.setPage(1);

        this.actionForm = new FormGroup({
            projId: new FormControl(this.idx, Validators.required),
            projActTaken: new FormControl(null, Validators.required),
            projRemark: new FormControl(),
        });


    }

    getStatusColor(status: number) {
        let ret: string;
        switch (status) {
            case 15: case 16: case 7: case 8: ret = 'secondary'; break;
            case 6: ret = 'success'; break;
            case 4: ret = 'info'; break;
            case 2: case 5: case 1: case 3: case 9: ret = 'warning'; break;
        }
        return ret;

        // switch (status) {
        //     case 1: case 2: ret = 'info'; break;
        //     case 15: case 16: case 7: case 8: ret = 'danger'; break;
        //     case 17: ret = 'secondary'; break;
        //     case 3: ret = 'success'; break;
        //     case 6: ret = 'primary'; break;
        //     case 4: case 5: ret = 'warning'; break;
        // }

    }

    exorShowDetails(idx) {
        this.routers.navigate(['../extraordinaire/details', idx]);
    }

    /*
    myBtn(status,idx){
        let myBtns=[];
        switch(status){
            case 1:
                myBtns.push({"type":1, "title":"Edit", "action":" (click)=exorShowDetails(idx)", "icon": "fa-info-circle"});
                break;
        }
        return myBtns;
    } */

    cancelExor() {
        /*
        console.log(this.selProj);
        let data = {
            id: this.selUser.id
        }
        let deleteUserSend = this._POST_api_Service.POST_data(this.jobAdvUserDel, data);
        let dataJUDel: any = {};
        let ret = deleteUserSend.subscribe(dataRes => {
            dataJUDel = dataRes;
            if(dataJUDel.status === "OK"){
                this.notifier.notify( 'success', 'Successfully Delete User !' );
                this.getUserList();
            } else {
                this.notifier.notify( 'error', 'Error - Fail to delete user !' );
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )
        */
        this.notifier.notify('success', 'Successfully Delete User !');
    }
    selProj = 0;
    selectedProj(idx) {
        this.selProj = idx;
    }

    loadingData = this.summData.loadingTracking; loadingDataError = false; noData = false;
    /*actExor(act) {
        let actToTitle = act[0].toUpperCase() + act.substr(1).toLowerCase();
        let succMsg: string; let errMsg: string;
        let data = {}; let postAPI: string;
        switch (act) {
            case 'cancel':
                succMsg = actToTitle + 'ed.'; errMsg = actToTitle + ' Project.';
                break;
            case 'close':
                succMsg = actToTitle + 'd.'; errMsg = actToTitle + ' Project.';
                break;
            case 'approval':
                succMsg = ' Sent for Approval Request.'; errMsg = ' Send for Approval Request.';
                break;
            case 'resubmit':
                succMsg = ' Resubmited for Approval Request.'; errMsg = ' Resubmit for Approval Request.';
                break;
            case 'advertise':
                succMsg = actToTitle + 'd'; errMsg = actToTitle + ' Project.';
                break;
            case 'delete':
                succMsg = actToTitle + 'd'; errMsg = actToTitle + ' Project.';
                data = { id: this.selProj };  postAPI = DetailsVars.APIDelete;
                break;
        }
        */

    // ::button action click
    clickAct: string; showFormErr = true; projActTaken: string; apprRemark = false; apprDate = false; showActButton = true;
    // dataSharing:any = {editIdx: 0}; 
    btnActClick(action, id) {
        this.showActButton = true;
        this.idx = id;
        this.clickAct = action; this.projActTaken = action;
        this.apprRemark = false; this.apprDate = false;
        // this.sharingService.setData({editIdx: 0}); // reset
        switch (action) {
            case 'approve':
                this.apprRemark = true; this.apprDate = false;
                break;
            case 'revert':
                this.apprRemark = true; this.apprDate = false;
                break;
            case 'advertise':
                this.apprRemark = false; this.apprDate = true;
                break;
            case 'close':
                this.apprRemark = true; this.apprDate = false;
                break;
            case 'cancel':
                this.apprRemark = true; this.apprDate = false;
                break;
            case 'delete':
                this.apprRemark = false; this.apprDate = false;
                break;
            case 'get-approval':
                break;
            case 'extraordinaire':
                this.routers.navigate(['/extraordinaire']);
                break;
            case 'edit':
                // this.sharingService.setData({editIdx: id}); 
                this.newMessage(id);
                this.idx = id;
                //-----   console.log(id);
                this.sharingService.saveData(id);
                // this.router.navigate(['results']);
                break;
        }
    }

    processingReq = false; formMsg = false; showFormMsg = false; closeReload = false;
    formMsgColor: string; formMsgIcon: string; advErrMsg: string;
    actionFormSubmit() {
        this.formMsg = true; this.processingReq = true; this.showFormMsg = false; this.showActButton = false;
        let projId = this.idx;//this.actionForm.get('projId').value;
        let projRemark = this.actionForm.get('projRemark').value;
        let projActTaken = this.projActTaken; // this.actionForm.get('projActTaken').value;
        let advStartDt = ((document.getElementById("startDate2") as HTMLInputElement).value); //this.pendApprForm.get('dtStart').value;
        let advEndDt = ((document.getElementById("endDate2") as HTMLInputElement).value); //this.pendApprForm.get('dtEnd').value;

        let API: string;
        let act: number;
        let actData: any;
        let apprPosMsg: string;
        switch (projActTaken) {
            case 'approve':
                API = DetailsVars.APIApproveRevert;
                actData = { "id": projId, "approve": 1, "remark": projRemark };
                break;
            case 'revert':
                API = DetailsVars.APIApproveRevert;
                actData = { "id": projId, "approve": 3, "remark": projRemark };
                break;
            case 'advertise':
                API = DetailsVars.APIAdvertise;
                actData = { "id": projId, "start": advStartDt, "close": advEndDt };
                apprPosMsg = 'Advertisement has been advertised.';
                break;
            case 'close':
                API = DetailsVars.APIClose;
                actData = { "id": projId, "remark": projRemark };
                apprPosMsg = 'Advertisement has been closed.';
                break;
            case 'cancel':
                API = DetailsVars.APICancel;
                actData = { "id": projId, "remark": projRemark };
                apprPosMsg = 'Advertisement has been cancelled.';
                break;
            case 'delete':
                API = DetailsVars.APIDelete;
                actData = { "id": projId };
                apprPosMsg = 'Advertisement has been deleted.';
                break;

        }
        console.log(actData); console.log(API);
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


    /* this._POST_api_Service.POST_data(postAPI, data).subscribe(dataRes => {
         if (dataRes.status === "OK") {
             this.notifier.notify('success', 'Project Successfully ' + succMsg);
             // this.summDataTracking = this.reloadTrackingData();
             setTimeout(function () {
                 //this.bcShowMsg = false;
                 this.summData.getSummData('tracking');
             }.bind(this), 3000); //wait 3 Seconds and hide
             
         } else {
             this.notifier.notify('error', 'Error - Fail to ' + errMsg + ' !');
         }
     },
         error => {
             console.log('[ERROR] Extraordinaire Tracking - ' + act + ' ', error);
             this.notifier.notify('error', 'Error - Fail to ' + errMsg + ' !');
         }
     ) 
     this.selProj = 0;
 }*/

    compareTwoDates() { //this.advPosForm.get('advPosIdx2').value;
        let mySt = new Date((document.getElementById("startDate2") as HTMLInputElement).value);
        let myEd = new Date((document.getElementById("endDate2") as HTMLInputElement).value);
        this.advDateError = this.dateComparison(mySt, myEd, true);
    }

    compareTwoDatesResubmit() { //this.advPosForm.get('advPosIdx2').value;
        let mySt = new Date((document.getElementById("startDate2Resubmit") as HTMLInputElement).value);
        let myEd = new Date((document.getElementById("endDate2Resubmit") as HTMLInputElement).value);
        this.advDateError = this.dateComparison(mySt, myEd, true);
    }

    advDateError: any = { isError: false, errorMessage: '' };
    dateComparison(mySt, myEd, chckStartDt) {
        let isErr = false; let errMsg = '';
        //let retErr : any = { isError: isErr, errorMessage: errMsg };
        var ONE_DAY = 1000 * 60 * 60 * 24;
        let days = Math.round((Math.abs(myEd.getTime() - mySt.getTime()) / ONE_DAY));
        //if (Math.round(((myEd.getTime() - mySt.getTime()) / ONE_DAY)) < 0) {
        if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            isErr = true; errMsg += 'Invalid advertisement period. End date should not be less than start date. ';
            //} else if (days > 14) {
        } else if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY > (14 - 1)) {
            isErr = true; errMsg += 'Advertisement period should not be more than 14 days. ';
        }
        if (chckStartDt) {
            let today = new Date(); // new Date();
            //if  (Math.round(((mySt.getTime() - today.getTime()) / ONE_DAY)) < 0)  {
            if ((mySt.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
                isErr = true; errMsg += 'Advertisement start date has expired. ';
            }
        }
        let retErr = { isError: isErr, errorMessage: errMsg };
        return retErr;
    }
    /*
    reloadTrackingData() {
        //this.loadingData = true;
        //this.summDataTracking =[];
        //this.noData=true;
        this._GET_api_Service.GET_data(SummVars.APISummDetails).subscribe(data => {
            this.summDataTracking = data.history; 
            //if (this.summDataTracking.length>0) this.noData=false;
            this.loadingData = false;
        },
            error => {
                console.log('[ERROR] Extraordinaire Tracking - Reload ', error);
                this.loadingDataError = true;
            });

    }

    editExorProj(idx) {
        console.log(idx);
    }*/

    showBtn(status, btn) {
        let ret = false;
        switch (status) {
            case 1:
                if (btn.match('edit')) ret = true; if (btn.match('approval')) ret = true;
                if (btn.match('delete')) ret = true;
                break;
            case 2:
                if (btn.match('detail')) ret = true;
                break;
            case 3:
                if (btn.match('detail')) ret = true; if (btn.match('advertise')) ret = true;
                if (btn.match('close')) ret = true;
                break;
            case 4:
                if (btn.match('detail')) ret = true;
                break;
            case 5:
                if (btn.match('detail')) ret = true; if (btn.match('close')) ret = true; if (btn.match('evaluate')) ret = true;
                break;
            case 6:
                if (btn.match('detail')) ret = true;
                break;
            case 7:
                if (btn.match('detail')) ret = true;
                break;
            case 8:
                if (btn.match('detail')) ret = true;
                break;
            case 9:
                if (btn.match('resubmit')) ret = true; if (btn.match('cancel')) ret = true;
                break;
            case 10:
                if (btn.match('detail')) ret = true;
                break;
            default: ret = false; break;
        }
        return ret;
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-u-exor-tracking-component',
            [
                'assets/js/user/extraordinaire/action-alert.js',
            ]);
    }
    private allItems: any[];// array of all items to be paged    
    pager: any = {};// pager object    
    pagedItems: any[];// paged items
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.summDataTracking.length, page, TrckVars.maxPerPage);
        this.pagedItems = this.summDataTracking.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }

}
