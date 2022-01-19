import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { PTVars } from './total-ne-promotion-ads-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';

import { PagerService } from '../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

//declare let Dropzone: any; 
@Component({
    selector: 'app-total-ne-promotion-ads',
    templateUrl: './total-ne-promotion-ads.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../dashboard-css.css']
})

export class TotalNePromotionAdsComponent implements OnInit, AfterViewInit {
    rAdvTrack = PTVars.rAdvTrack;

    loading = true; errLoadData = PTVars.errLoadData; downloadAllXLS = PTVars.downloadAllXLS;
    ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
    title1 = PTVars.title1; title2 = PTVars.title2; pageSize = PTVars.pageSize;

    private baseUrl = GlobalVariable.BASE_API_URL;
    private baseApiKey = GlobalVariable.API_KEY;
    private token = '?api_key=' + this.baseApiKey;
    private jobDataAPIAll = PTVars.jobAdvListAllAPI;
    private jobDataAPIActive = PTVars.jobAdvListActiveAPI;
    private jobDataAPIAdvertised = PTVars.jobAdvListAdvertisedAPI;
    private jobDataAPIEvaluate = PTVars.jobAdvLisEvaluateAPI;
    private jobDataAPIInterview = PTVars.jobAdvListInterviewAPI;
    private jobDataAPIRevert = PTVars.jobAdvListRevertAPI;
    private jobDataAPIComplete = PTVars.jobAdvListCompleteAPI;
    // private apiUrl = this.baseUrl + this.jobDataAPIAll + this.token;
    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/

    showAdvId = true; showPosId = true; showPosName = true; showCreator = true; showLOB = true; showTtlApl = false;
    showStatus = true; showDtStart = true; showDtEnd = true; showAct = true;

    data: any = {};
    data2: any = {};
    public term: string;
    styleTypeViewAll: string; styleTypeViewAct: string;
    styleTypeViewEva: string; styleTypeViewIv: string;
    styleTypeViewCom: string; styleTypeViewRev: string;


    // FIlter params
    public termAdvId: string;
    public termPosId: string; public termJobTtl: string; public termPosName: string;
    public termLOB: string; public termTtlApp: string; public termStatus: string;
    public termDtStart: string; public termDtEnd: string;
    public termDtStart2: Date; public termDtEnd2: Date;
    public termTtlAppMin: string; public termTtlAppMax: string;
    public termCreator: string;

    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];

    reportFilter = PTVars.reportFilter;
    applyReportFilter = PTVars.applyReportFilter;

    filterForm : FormGroup;

    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        this.defDataTable();
        //routers.events.map(event => event instanceof NavigationStart)
        //    .subscribe(() => {
        //    let currTab=(this.activeRoute.snapshot.paramMap.get('type'));
        //    this.onChangeTab();
        //});       
    }

    JobAdvList(url3) {
        //return this.http.get(url3).map((res: Response) => res.json());
        return this._GET_api_Service.GET_data(url3);
    }

    JobAdvListData(url2) {
        // console.log(this.JobAdvList().subscribe());      
        //console.log(url2);  
        this.loading = true;
        type TrackingData = {
            ref: number, pro_name: string, st_date: string,
            end_date: string, lob: string, creator: string, contact: string, status: string, status_code: number,
            total_applicant: number, total_view: number, st_date2: Date, end_date2: Date
        };
        let myarray: TrackingData[] = [];
        let sDt: string;
        let eDt: string;
        this.JobAdvList(url2)
            // .map((response: Response) => response.json())
            .subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    // let sDt=new Date(this.datePipe.transform(data[i].start,"yyyy-MM-dd"));
                    sDt = this.datePipe.transform(data[i].start, "dd-MMM-yyyy");
                    eDt = this.datePipe.transform(data[i].close, "dd-MMM-yyyy");
                    myarray.push({
                        ref: data[i].ref, pro_name: data[i].name, st_date: sDt, end_date: eDt, lob: data[i].lob, creator: data[i].creator,
                        contact: data[i].contact, status: data[i].status, status_code: data[i].status_code, total_applicant: data[i].total_applicant, 
                        total_view: data[i].total_view, st_date2: data[i].start, end_date2: data[i].close
                    });
                }
                //this.data = data;
                this.data2 = myarray;
                // initialize to page 1
                this.setPage(1);
                this.loading = false;
            },
            /* error => console.log('[ERROR - JobAdvListData] ' + error),
             // () => console.log('Done')
         );*/
            error => {
                this.showAlert('alertError');
                // this._alertService.error(error);
                this._alertService.error(this.errLoadData);
                console.log('[ERROR - JobAdvListData] ' + error);
                this.loading = false;
            })
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    defDataTable() {
        /* switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
             case 'HCBD':
                 this.showLOB = false; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                 this.showTtlApl = true; this.showPeriod = false; break;
             case 'HEADHCBD':
                 this.showLOB = false; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                 this.showTtlApl = true; this.showPeriod = false; break;
             case 'ADMINHCBO': case 'ADMINHCBO,HCBD':
                 this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                 this.showTtlApl = true; this.showPeriod = false; break;
         } */
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    status = '';
    onChangeTab() {
        let url: string;
        let typeView = this.activeRoute.snapshot.paramMap.get('type');
        
        if (typeView == 'complete') {
            this.styleTypeViewCom = 'btn-warning';
            this.styleTypeViewAll = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '6';
            // url = this.jobDataAPIComplete;
        } else if (typeView == 'revert') {
            this.styleTypeViewRev = 'btn-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewAll = 'btn-outline-warning'; this.styleTypeViewAct = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning';
            this.status = '15';
            // url = this.jobDataAPIRevert;
        } else if (typeView == 'evaluate') {
            this.styleTypeViewEva = 'btn-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewAll = 'btn-outline-warning'; this.styleTypeViewAct = 'btn-outline-warning';
            this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '4';
            // url = this.jobDataAPIEvaluate;
        } else if (typeView == 'interview') {
            this.styleTypeViewIv = 'btn-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewAll = 'btn-outline-warning'; this.styleTypeViewAct = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '5';
            // url = this.jobDataAPIInterview;
        } else if (typeView == 'all') {
            this.styleTypeViewAll = 'btn-warning';
            this.styleTypeViewAct = 'btn-outline-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '';
            // url = this.jobDataAPIAll;
        }
        // this.JobAdvListData(this.baseUrl + url + this.token);     
        this.submitFilter(0);   
        // this.JobAdvListData(url);
    }

    /** :start DOWNLOAD CSV  */
    downloadCSV = true;
    ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = ''; var row = "";

        for (var index in objArray[0]) {
            if ((index !== 'st_date2') && (index !== 'end_date2')) {
                row += index + ',';//Now convert each value to string and comma-separated
            }
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                //line += '"' + array[i][index] + '"';
                if ((index !== 'st_date2') && (index !== 'end_date2')) {
                    line += '"' + array[i][index] + '"';
                }
            }
            str += line + '\r\n';
        }
        return str;
    }

    downloading = false;
    download() {
        this.downloading = true;
        let typeView = this.activeRoute.snapshot.paramMap.get('type');
        let dwApi: string;
        let dwData = [];
        if (typeView == 'complete') {
            dwApi = PTVars.dwApiComplete;
        } else if (typeView == 'revert') {
            dwApi = PTVars.dwApiRevert;
        } else if (typeView == 'evaluate') {
            dwApi = PTVars.dwApiEvaluate;
        } else if (typeView == 'interview') {
            dwApi = PTVars.dwApiIview;
        } else if (typeView == 'all') {
            dwApi = PTVars.dwApiAll;
        }
        this._GET_api_Service.GET_data(dwApi).subscribe(data => {
            dwData = data;
            this.download2(dwData);
            this.downloading = false;
        },
            error => {
                console.log('[ERROR - Populate data from Adv Tracking Download API] ' + error);
                dwData = this.data2;
                this.download2(dwData);
                this.downloading = false;

            });


    }
    download2(dwData) {
        var csvData = this.ConvertToCSV(dwData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Project_Tracking_' + dateToday + '.csv';
        a.click();
        return 'success';
    }
    /** :end DOWNLOAD CSV  */

    ngAfterViewInit() {
        this._script.loadScripts('app-total-ne-promotion-ads',
        [
           'assets/js/jobs/project-tracking.js',
        ]);
    }
    title: string;
    //getDeepestTitle:string;
    ngOnInit() {
        this.checkLevel(); 
        this.filterForm = new FormGroup({
            filterLob: new FormControl('', Validators.required),
            filterStatus: new FormControl('', Validators.required),
            filterStart: new FormControl('', Validators.required),
            filterEnd: new FormControl('', Validators.required),
        });
        this.filterForm.setValue({
            filterLob: "",
            filterStatus: "",
            filterStart: moment(moment().startOf('month')).subtract(2, 'months').format('DD-MM-YYYY'),
            filterEnd: moment().format('DD-MM-YYYY'),
        });

        this.onChangeTab();
        this.routers.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                //this.title = "ABC:";// this.getDeepestTitle(this.routers.routerState.snapshot.root);
                //console.log(this.title);
                this.onChangeTab();
            }
        });
        this.getReportFilter();
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }

    redirect(job_id: number) {
        this.routers.navigate(['admin/job/advertisement-tracking/detail', job_id]);
    }

    getStatusColor(status: number) {
        let ret: string;
        switch (status) {
            case 1: case 2: ret = 'info'; break;
            case 15: case 16: case 7: case 8: ret = 'danger'; break;
            case 17: ret = 'secondary'; break;
            case 3: ret = 'success'; break;
            case 6: ret = 'primary'; break;
            case 4: case 5: ret = 'warning'; break;
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

    filters = {};
    newStatus = [];
    getReportFilter() {
        this.filters= {};
        this.newStatus = [];
        this._GET_api_Service.GET_data(this.reportFilter).subscribe(data => {
            this.filters = data.filter;
            for(let i=0; i<data.filter.status.length; i++){
                this.newStatus.push({
                    id: data.filter.status[i].id,
                    text: data.filter.status[i].text,
                    select: this.status == data.filter.status[i].id ? true : false,
                });
            }
            let stat = this.newStatus.find(stat => { return stat.select === true})
            if(stat){
                this.filterForm.patchValue({filterStatus: stat.id});
            };
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }

    errorDate = false;
    submitFilter(type) {
        this.errorDate = false;
        let arrSt = this.filterForm.get('filterStart').value.split("-");
        let arrEd = this.filterForm.get('filterEnd').value.split("-");
        let mySt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]));
        let myEd = new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2]));

        let ONE_DAY = 1000 * 60 * 60 * 24;
        if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            this.errorDate = true;
        } else{
            this.errorDate = false;
            let dataPos = {};
            if(type === 0){
                dataPos = {
                    lob: '',
                    status: this.status,
                    from: moment(moment().startOf('month')).subtract(2, 'months').format(),
                    to: moment().format(),
                }
            }
            else if(type === 1){
                this.filterForm.patchValue({
                    filterStart: $("#startDtAdd").val(),
                    filterEnd: $("#endDtAdd").val(),
                });
                dataPos = {
                    lob: this.filterForm.get('filterLob').value === 'All' || this.filterForm.get('filterLob').value === null ? '' : this.filterForm.get('filterLob').value,
                    status: this.filterForm.get('filterStatus').value === 'All' || this.filterForm.get('filterStatus').value === null ? '' : this.filterForm.get('filterStatus').value,
                    from: this.filterForm.get('filterStart').value.length === 0 || this.filterForm.get('filterStart').value === null  ? '' : moment(this.filterForm.get('filterStart').value, 'DD-MM-YYYY').format(),
                    to: this.filterForm.get('filterEnd').value.length === 0 || this.filterForm.get('filterEnd').value === null  ? '' : moment(this.filterForm.get('filterEnd').value, 'DD-MM-YYYY').format(),
                };
            } else if(type === 2){
                dataPos = {
                    lob: '',
                    status: '',
                    from: '',
                    to: '',
                };
                this.filterForm.patchValue({
                    filterLob: '',
                    filterStatus: '',
                    filterStart: '',
                    filterEnd: '',
                });
            }
            this.loading = true;
            type TrackingData = {
                ref: number, pro_name: string, st_date: string, end_date: string, lob: string, creator: string, 
                contact: string, status: string, status_code: number, total_applicant: number, total_view: number, 
                st_date2: Date, end_date2: Date
            };
            let myarray: TrackingData[] = [];
            let sDt: string;
            let eDt: string;
            this._POST_api_Service.POST_data(this.applyReportFilter, dataPos).subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    sDt = this.datePipe.transform(data[i].start, "dd-MMM-yyyy");
                    eDt = this.datePipe.transform(data[i].close, "dd-MMM-yyyy");
                    myarray.push({
                        ref: data[i].ref, pro_name: data[i].name, st_date: sDt, end_date: eDt, lob: data[i].lob, creator: data[i].creator, 
                        contact: data[i].contact, status: data[i].status, status_code: data[i].status_code, total_applicant: data[i].total_applicant, 
                        total_view: data[i].total_view, st_date2: data[i].start, end_date2: data[i].close
                    });
                }
                this.data2 = myarray;
                this.setPage(1);
                this.loading = false;
            },error => {
                console.log('[ERROR] Fail to submit filter: ' + error);
            }); 
        }
        
    };
}