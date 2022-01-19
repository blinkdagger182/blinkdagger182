import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './iv-dashboard-vars';
import { LOB, lobArr } from "./arrCons";
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
// import { Requestor, reqArr } from "./arrCons";
import { PagerService } from '../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-ivdashboard',
    templateUrl: './iv-dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./iv-dashboard.component.css']
})

export class ivdashboardComponent implements OnInit, AfterViewInit {

    // pager object
    pager: any = {};
    pageSize = 10;
    pagedItems: any[];
    pager2: any = {};
    pageSize2 = 10;
    pagedItems2: any[];

    selBatchVal: any;
    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService, 
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {        
    }

    downloading1 = false;
    downloading2 = false;
    downloading3 = false;
    submitted = false;
    loading2;loadingYear = true;
    filterForm : FormGroup;
    lobval = '';
    getLOBAPI = INVars.getLOBAPI;
    getDashboardAPI = INVars.getDashboardAPI;
    getYearAPI = INVars.getYearAPI;

    optLob: LOB = new LOB();
    //optLobList = Array<lobArr>();
    optLobList = []; 
    yearList = [];
    
    dashSummary; lobdata;
    totalJobIntvw = 0;
    cntTotal = 0; totalShortlisted = 0; totalInProgress = 0; totalSuccess = 0; totalUnsuccessful = 0; totalRejected = 0;
    cntShortlist_total = 0; 
    cntShortlistB1_lat = 0; cntShortlistB1_promo = 0;
    cntShortlistB2_lat = 0; cntShortlistB2_promo = 0;
    cntShortlistB3_lat = 0; cntShortlistB3_promo = 0;
    cntIntvwIProg_total = 0;
    cntIntvwIProgB1_lat = 0; cntIntvwIProgB1_promo = 0; 
    cntIntvwIProgB2_lat = 0; cntIntvwIProgB2_promo = 0; 
    cntIntvwIProgB3_lat = 0; cntIntvwIProgB3_promo = 0;
    cntRejected_total = 0;
    cntRejectedB1_lat = 0; cntRejectedB1_promo = 0;
    cntRejectedB2_lat = 0; cntRejectedB2_promo = 0;
    cntRejectedB3_lat = 0; cntRejectedB3_promo = 0;
    cntUnsuccessful_total = 0;
    cntUnsuccessfulB1_lat = 0; cntUnsuccessfulB1_promo = 0;
    cntUnsuccessfulB2_lat = 0; cntUnsuccessfulB2_promo = 0;
    cntUnsuccessfulB3_lat = 0; cntUnsuccessfulB3_promo = 0;
    cntSuccessful_total = 0;
    cntSuccessfulB1_lat = 0; cntSuccessfulB1_promo = 0;
    cntSuccessfulB2_lat = 0; cntSuccessfulB2_promo = 0;
    cntSuccessfulB3_lat = 0; cntSuccessfulB3_promo = 0;
    status_CreateSessionB1 = 0; status_CreateSessionB2 = 0;status_CreateSessionB3 = 0;
    status_InProgressB1 = 0; status_InProgressB2 = 0; status_InProgressB3 = 0;  
    status_SubmittedB1 = 0; status_SubmittedB2 = 0; status_SubmittedB3 = 0; 
    status_StartedB1 = 0; status_StartedB2 = 0; status_StartedB3 = 0; 
    status_CompletedB1 = 0; status_CompletedB2 = 0; status_CompletedB3 = 0;
    total_Status_lat_B1 = 0; total_Status_lat_B2 = 0; total_Status_lat_B3 = 0;
    total_Status_promo_B1 = 0; total_Status_promo_B2 = 0; total_Status_promo_B3 = 0;
    total_recStatus_B1 = 0; total_recStatus_B2 = 0; total_recStatus_B3 = 0;
    descEmptyData2 = "For better response, please customize your filter";
    ngOnInit() {       
        this.checkLevel();
        this.filterForm = new FormGroup({
            fltrMonth: new FormControl('', Validators.required),
            fltrYear: new FormControl('', Validators.required),
            fltrLOB: new FormControl('', Validators.required)
        });
               
        this.filterForm.setValue({    
            fltrMonth: "",
            fltrYear: "",   
            fltrLOB: ""
        });      
      
        this.loading2 = true;        
        this.getlob();  
        this.getYear();   
    }

    ngAfterViewInit() {
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/3/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
        
    }

    mylob = '';
    loadingLob = true;
    getlob() {
        this._GET_api_Service.GET_REC_DATA(this.getLOBAPI).subscribe(data => {
            //console.log(data)
            this.optLobList = data;
            this.loadingLob = false; 
            if (data.length === 1) {
                this.mylob = this.optLobList[0].lob;
                this.filterForm.patchValue({ fltrLOB: this.mylob });
            }    
        },
            error => {
                console.log('[ERROR - Get Lob List] ' + error);
                this.loadingLob = true;
            }
        );
    }

    getYear() {
        this._GET_api_Service.GET_REC_DATA(this.getYearAPI).subscribe(data => {
            //console.log(data)
            this.yearList = data;
            this.loadingYear = false;     
            this.filterForm.patchValue({ fltrYear: this.yearList[0].yr  });       
        },
            error => {
                console.log('[ERROR - Get year list] ' + error);
                this.loadingYear = true;
            }
        );
    }

    submitFilter(type) {
        this.loading2 = true;
        
        if (type === 1) {
            this.submitted = true;
            let dataPos;
            dataPos = { 
                month: this.filterForm.get('fltrMonth').value,
                year: this.filterForm.get('fltrYear').value,
                lob: this.filterForm.get('fltrLOB').value                
            }  
   
            this._POST_api_Service.POST_REC_data(this.getDashboardAPI, dataPos).subscribe(res => {
                console.log(dataPos)
                //console.log(res)
                this.loading2 = false;
                this.dashSummary = res.summary;
                this.lobdata = this.dashSummary.cntStatusByLOB;
                this.totalJobIntvw = this.dashSummary.totalJobIntvw[0].totalJobIntvw;
    
                this.totalShortlisted = this.dashSummary.cnt[0].totalShortlisted;
                this.totalInProgress = this.dashSummary.cnt[0].totalInProgress;
                this.totalSuccess = this.dashSummary.cnt[0].totalSuccess;
                this.totalUnsuccessful = this.dashSummary.cnt[0].totalUnsuccessful;
                this.totalRejected = this.dashSummary.cnt[0].totalRejected;     
    
                this.cntShortlistB1_lat = this.dashSummary.cntShortlistbyBand[0].cntShortlistB1_lat; 
                this.cntShortlistB1_promo = this.dashSummary.cntShortlistbyBand[0].cntShortlistB1_promo; 
                this.cntShortlistB2_lat = this.dashSummary.cntShortlistbyBand[0].cntShortlistB2_lat; 
                this.cntShortlistB2_promo = this.dashSummary.cntShortlistbyBand[0].cntShortlistB2_promo; 
                this.cntShortlistB3_lat = this.dashSummary.cntShortlistbyBand[0].cntShortlistB3_lat; 
                this.cntShortlistB3_promo = this.dashSummary.cntShortlistbyBand[0].cntShortlistB3_promo;   
                
                this.cntIntvwIProgB1_lat = this.dashSummary.cntIntvwIProgressbyBand[0].cntIntvwIProgB1_lat; 
                this.cntIntvwIProgB1_promo = this.dashSummary.cntIntvwIProgressbyBand[0].cntIntvwIProgB1_promo; 
                this.cntIntvwIProgB2_lat = this.dashSummary.cntIntvwIProgressbyBand[0].cntIntvwIProgB2_lat; 
                this.cntIntvwIProgB2_promo = this.dashSummary.cntIntvwIProgressbyBand[0].cntIntvwIProgB2_promo; 
                this.cntIntvwIProgB3_lat = this.dashSummary.cntIntvwIProgressbyBand[0].cntIntvwIProgB3_lat; 
                this.cntIntvwIProgB3_promo = this.dashSummary.cntIntvwIProgressbyBand[0].cntIntvwIProgB3_promo; 
                 
                this.cntRejectedB1_lat = this.dashSummary.cntRejectedbyBand[0].cntRejectedB1_lat;
                this.cntRejectedB1_promo = this.dashSummary.cntRejectedbyBand[0].cntRejectedB1_promo;
                this.cntRejectedB2_lat = this.dashSummary.cntRejectedbyBand[0].cntRejectedB2_lat;
                this.cntRejectedB2_promo = this.dashSummary.cntRejectedbyBand[0].cntRejectedB2_promo;
                this.cntRejectedB3_lat = this.dashSummary.cntRejectedbyBand[0].cntRejectedB3_lat;
                this.cntRejectedB3_promo = this.dashSummary.cntRejectedbyBand[0].cntRejectedB3_promo;
    
                this.cntUnsuccessfulB1_lat = this.dashSummary.cntUnsuccessfulbyBand[0].cntUnsuccessfulB1_lat;
                this.cntUnsuccessfulB1_promo = this.dashSummary.cntUnsuccessfulbyBand[0].cntUnsuccessfulB1_promo;
                this.cntUnsuccessfulB2_lat = this.dashSummary.cntUnsuccessfulbyBand[0].cntUnsuccessfulB2_lat;
                this.cntUnsuccessfulB2_promo = this.dashSummary.cntUnsuccessfulbyBand[0].cntUnsuccessfulB2_promo;
                this.cntUnsuccessfulB3_lat = this.dashSummary.cntUnsuccessfulbyBand[0].cntUnsuccessfulB3_lat;
                this.cntUnsuccessfulB3_promo = this.dashSummary.cntUnsuccessfulbyBand[0].cntUnsuccessfulB3_promo;
    
                this.cntSuccessfulB1_lat = this.dashSummary.cntSuccessfulbyBand[0].cntSuccessfulB1_lat;
                this.cntSuccessfulB1_promo = this.dashSummary.cntSuccessfulbyBand[0].cntSuccessfulB1_promo;
                this.cntSuccessfulB2_lat = this.dashSummary.cntSuccessfulbyBand[0].cntSuccessfulB2_lat;
                this.cntSuccessfulB2_promo = this.dashSummary.cntSuccessfulbyBand[0].cntSuccessfulB2_promo;
                this.cntSuccessfulB3_lat = this.dashSummary.cntSuccessfulbyBand[0].cntSuccessfulB3_lat;
                this.cntSuccessfulB3_promo = this.dashSummary.cntSuccessfulbyBand[0].cntSuccessfulB3_promo;
                
                this.status_CreateSessionB1 = this.dashSummary.cntStatusByBand[0].status_CreateSessionB1;
                this.status_CreateSessionB2 = this.dashSummary.cntStatusByBand[0].status_CreateSessionB2;
                this.status_CreateSessionB3 = this.dashSummary.cntStatusByBand[0].status_CreateSessionB3;
                this.status_InProgressB1 = this.dashSummary.cntStatusByBand[0].status_InProgressB1;
                this.status_InProgressB2 = this.dashSummary.cntStatusByBand[0].status_InProgressB2;
                this.status_InProgressB3 = this.dashSummary.cntStatusByBand[0].status_InProgressB3;
                this.status_SubmittedB1 = this.dashSummary.cntStatusByBand[0].status_SubmittedB1;
                this.status_SubmittedB2 = this.dashSummary.cntStatusByBand[0].status_SubmittedB2;
                this.status_SubmittedB3 = this.dashSummary.cntStatusByBand[0].status_SubmittedB3;
                this.status_StartedB1 = this.dashSummary.cntStatusByBand[0].status_StartedB1;
                this.status_StartedB2 = this.dashSummary.cntStatusByBand[0].status_StartedB2;
                this.status_StartedB3 = this.dashSummary.cntStatusByBand[0].status_StartedB3;
                this.status_CompletedB1 = this.dashSummary.cntStatusByBand[0].status_CompletedB1;
                this.status_CompletedB2 = this.dashSummary.cntStatusByBand[0].status_CompletedB2;
                this.status_CompletedB3 = this.dashSummary.cntStatusByBand[0].status_CompletedB3;

                this.total_Status_lat_B1 = this.cntShortlistB1_lat + 
                this.cntIntvwIProgB1_lat + 
                this.cntUnsuccessfulB1_lat +
                this.cntSuccessfulB1_lat + 
                this.cntRejectedB1_lat;

                this.total_Status_lat_B2 = this.cntShortlistB2_lat + 
                this.cntIntvwIProgB2_lat + 
                this.cntUnsuccessfulB2_lat +
                this.cntSuccessfulB2_lat + 
                this.cntRejectedB2_lat;

                this.total_Status_lat_B3 = this.cntShortlistB3_lat + 
                this.cntIntvwIProgB3_lat + 
                this.cntUnsuccessfulB3_lat +
                this.cntSuccessfulB3_lat + 
                this.cntRejectedB3_lat;

                this.total_Status_promo_B1 = this.cntShortlistB1_promo + 
                this.cntIntvwIProgB1_promo + 
                this.cntUnsuccessfulB1_promo +
                this.cntSuccessfulB1_promo + 
                this.cntRejectedB1_promo;

                this.total_Status_promo_B2 = this.cntShortlistB2_promo + 
                this.cntIntvwIProgB2_promo + 
                this.cntUnsuccessfulB2_promo +
                this.cntSuccessfulB2_promo + 
                this.cntRejectedB2_promo;

                this.total_Status_promo_B3 = this.cntShortlistB3_promo + 
                this.cntIntvwIProgB3_promo + 
                this.cntUnsuccessfulB3_promo +
                this.cntSuccessfulB3_promo + 
                this.cntRejectedB3_promo;
    
                this.total_recStatus_B1 = this.status_CreateSessionB1 +   
                this.status_InProgressB1 +  
                this.status_SubmittedB1 +
                this.status_StartedB1 +
                this.status_CompletedB1;

                this.total_recStatus_B2 = this.status_CreateSessionB2 +   
                this.status_InProgressB2 +  
                this.status_SubmittedB2 +
                this.status_StartedB2 +
                this.status_CompletedB2;

                this.total_recStatus_B3 = this.status_CreateSessionB3 +   
                this.status_InProgressB3 +  
                this.status_SubmittedB3 +
                this.status_StartedB3 +
                this.status_CompletedB3;
    
            }, error => {
                this.loading2 = true;
                console.log('[ERROR] Fail to submit filter ' + error);
            });

            
        }//end submit form

        //reset form
        else if (type === 2) {
            this.submitted = false;
            this.filterForm.setValue({    
                fltrMonth: "",
                fltrYear: this.yearList[0].yr,   
                fltrLOB: this.mylob
            });   
        }
    } 

    download1() {
        this.downloading1 = true;
        let AUX = [
            {
                ApplStatus: 'Shortlisted',
                Band1_Lateral: this.cntShortlistB1_lat,
                Band1_Promotion: this.cntShortlistB1_promo,
                Band2_Lateral: this.cntShortlistB2_lat,
                Band2_Promotion: this.cntShortlistB2_promo,
                Band3_Lateral: this.cntShortlistB3_lat,
                Band3_Promotion: this.cntShortlistB3_promo
            },
            {
                ApplStatus: 'Interview In Progress',
                Band1_Lateral: this.cntIntvwIProgB1_lat,
                Band1_Promotion: this.cntIntvwIProgB1_promo,
                Band2_Lateral: this.cntIntvwIProgB2_lat,
                Band2_Promotion: this.cntIntvwIProgB2_promo,
                Band3_Lateral: this.cntIntvwIProgB3_lat,
                Band3_Promotion: this.cntIntvwIProgB3_promo
            },
            {
                ApplStatus: 'Unsuccessful',
                Band1_Lateral: this.cntUnsuccessfulB1_lat,
                Band1_Promotion: this.cntUnsuccessfulB1_promo,
                Band2_Lateral: this.cntUnsuccessfulB2_lat,
                Band2_Promotion: this.cntUnsuccessfulB2_promo,
                Band3_Lateral: this.cntUnsuccessfulB3_lat,
                Band3_Promotion: this.cntUnsuccessfulB3_promo
            },
            {
                ApplStatus: 'Successful',
                Band1_Lateral: this.cntSuccessfulB1_lat,
                Band1_Promotion: this.cntSuccessfulB1_promo,
                Band2_Lateral: this.cntSuccessfulB2_lat,
                Band2_Promotion: this.cntSuccessfulB2_promo,
                Band3_Lateral: this.cntSuccessfulB3_lat,
                Band3_Promotion: this.cntSuccessfulB3_promo
            },
            {
                ApplStatus: 'Supervisor Rejected',
                Band1_Lateral: this.cntRejectedB1_lat,
                Band1_Promotion: this.cntRejectedB1_promo,
                Band2_Lateral: this.cntRejectedB2_lat,
                Band2_Promotion: this.cntRejectedB2_promo,
                Band3_Lateral: this.cntRejectedB3_lat,
                Band3_Promotion: this.cntRejectedB3_promo
            },
            
          ];
        var csvData = this.ConvertToCSV(AUX);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type:  'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Recruitment_ApplStatusByBand_' + dateToday + '.csv';
        a.click();
        this.downloading1 = false;
        return 'success';
    }
    
    download2() {
        this.downloading2 = true;
        let AUX = [
            {
                Status: 'Create Session',
                Band1: this.status_CreateSessionB1,
                Band2: this.status_CreateSessionB2,
                Band3: this.status_CreateSessionB3,
            },
            {
                Status: 'In Progress',
                Band1: this.status_InProgressB1,
                Band2: this.status_InProgressB2,
                Band3: this.status_InProgressB3,
            },
            {
                Status: 'Submitted',
                Band1: this.status_SubmittedB1,
                Band2: this.status_SubmittedB2,
                Band3: this.status_SubmittedB3,
            },
            {
                Status: 'Started',
                Band1: this.status_StartedB1,
                Band2: this.status_StartedB2,
                Band3: this.status_StartedB3,
            },
            {
                Status: 'Completed (Report Submitted)',
                Band1: this.status_CompletedB1,
                Band2: this.status_CompletedB2,
                Band3: this.status_CompletedB3,
            }
          ];
        var csvData = this.ConvertToCSV(AUX);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type:  'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Recruitment_StatusByBand_' + dateToday + '.csv';
        a.click();
        this.downloading2 = false;
        return 'success';
    }
    
    download3() {
        this.downloading3 = true;
        var csvData = this.ConvertToCSV(this.lobdata);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type:  'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Recruitment_StatusByLOB_' + dateToday + '.csv';
        a.click();
        this.downloading3 = false;
        return 'success';
    }
  
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
}