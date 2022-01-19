import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { JApprListVars } from './job-pending-approval-vars';
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';

import { PagerService } from '../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

//declare let Dropzone: any; 
@Component({
    selector: 'app-pending-approval',
    templateUrl: './job-pending-approval.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})

export class JobPendingApprovalComponent implements OnInit, AfterViewInit {
    title1 = JApprListVars.title1; title2 = JApprListVars.title2; pageSize = JApprListVars.pageSize;
    loading = true;
    //private baseUrl = GlobalVariable.BASE_API_URL;
    //private baseApiKey = GlobalVariable.API_KEY;
    //private token = '?api_key=' + this.baseApiKey;
    apiHCBD = JApprListVars.jobAppPndgListHCBDAPI;
    apiHCBO = JApprListVars.jobAppPndgListHCBOAPI;
    apiUrl = JApprListVars.jobAppPndgListAPI;;

    showAdvId = true; showAction = true; showLOB = false; showPosName = false; showPosId = false; showJobTitle = false; showStatus = false;
    showTtlApl = false; showPeriod = false; showAct = true;
    data: any = {};
    public term: string;
    styleTypeViewAll: string;
    styleTypeViewAct: string;
    filterForm: FormGroup;

    // FIlter params
    public termPosId: string; public termJobTtl: string; public termPosName: string;
    public termLOB: string; public termTtlApp: string; public termStatus: string;
    public termDtStart: string; public termDtEnd: string;
    public termDtStart2: Date; public termDtEnd2: Date;

    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];

    constructor(private pagerService: PagerService, private _GET_api_Service: GET_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router, private datePipe: DatePipe, private _script: ScriptLoaderService) {
        // this.defDataTable();
    }

    JobAdvList(url3) {
        return this._GET_api_Service.GET_data(url3);
    }
    JobAdvListData(url2) {
        this.JobAdvList(url2).subscribe(data => {
            this.loading = false;
            this.data = data;
            if (this.data.length > 0)
                this.setPage(1);
            //console.log(this.data);
        },
            error => console.log('[ERROR - Pending Approval List] ' + error),
            // () => console.log('Done')
        );

    }

    defDataTable() {
        // let roleArr = JSON.parse(localStorage.getItem('currentUser')).job_role.split(",");
        // for (let i = 0; i < roleArr.length; i++) {
        //     roleArr[i] = roleArr[i].trim();
        // }
        // if ((roleArr.indexOf('1') >= 0) || (roleArr.indexOf('1') >= 0 && roleArr.indexOf('3') >= 0)) {
        this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
        this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = true;
        //     this.apiUrl = this.apiHCBO;
        // } else if (roleArr.indexOf('2') >= 0) {
        //     this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
        //     this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = true;
        //     this.apiUrl = this.apiHCBD;
        // }
        /*switch (JSON.parse(localStorage.getItem('currentUser')).job_role) {
            case 'HEADHCBD':
                this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = true;
                this.apiUrl = this.apiHCBD;
                break;
            case 'ADMINHCBO':
            case 'ADMINHCBO,HCBD':
                this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                this.showTtlApl = true; this.showJobTitle = true; this.showPeriod = true;
                this.apiUrl = this.apiHCBO;
                break;
        }*/
        this.JobAdvListData(this.apiUrl);
    }

    ngAfterViewInit() {
        //this._script.loadScripts('app--tracking',
        //[
        //    'assets/js/jobs/bootstrap-datepicker.js'
        //]);
        //Dropzone._autoDiscoverFunction();
    }

    ngOnInit() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        } else {
            this.defDataTable();
            this.JobAdvListData(this.apiUrl);
        }

        this.getAdvType();

        this.filterForm = new FormGroup({
            filterAdvType: new FormControl('', Validators.required),
        });
        this.filterForm.setValue({
            filterAdvType: "",
        });
    }

    advTypeList = [];
    getAdvType() {
        this.advTypeList = [];
        this.advTypeList.push({id: 0, text: 'External (Career@TM)', select: false});
        this.advTypeList.push({id: 1, text: 'Internal (ERA)', select: false});
        // this._GET_api_Service.GET_data(this.bandListAPI).subscribe(data => {
        //     for (let i = 0; i < data.length; i++) {
        //         this.bandList.push({id: data[i].id, text: data[i].name, select: false});
        //     }
        // },
        //     error => console.log('[ERROR - Get Band List] ' + error),
        // );
    }

    enableExtInt: string = null;
    typeChange(){
        this.enableExtInt = this.filterForm.get('filterAdvType').value === '' ? null : (this.filterForm.get('filterAdvType').value == 0 ? 'career' : 'era');
    }

    redirect(job_id: number) {
        // this.routers.navigate(['job/advertisement-tracking/detail',job_id]);
        this.routers.navigate(['admin/job/pending-approval/detail', job_id]);
    }

    getStatusColor(status: string) {
        let ret: string;
        switch (status.toLocaleLowerCase()) {
            case 'advertised': ret = 'success'; break;
            case 'pending approval': ret = 'warning'; break;
        }
        return ret;
    }
    getStatusName(status: string) {
        let ret = status;
        switch (status.toLocaleLowerCase()) {
            //case 'advertised': ret='Advertised' ; break;
            case 'pending approval': ret = 'Pend. Approval'; break;
        }
        return ret;
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data.length, page, this.pageSize);

        // get current page of items
        this.pagedItems = this.data.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}