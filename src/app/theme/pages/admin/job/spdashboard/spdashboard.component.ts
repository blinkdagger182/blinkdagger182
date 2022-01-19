import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './spdashboard-vars';
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
    selector: 'app-spdashboard',
    templateUrl: './spdashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./spdashboard.component.css']
})

export class spdashboardComponent implements OnInit, AfterViewInit {

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

    loading2;
    filterForm : FormGroup;
    lobval = '';
    getLOBAPI = INVars.getLOBJobAdsAPI;
    getDashboardAPI = INVars.getDashboardAPI;

    optLob: LOB = new LOB();
    //optLobList = Array<lobArr>();
    optLobList = []; 
    
    dashSummary;total_band4 = 0;total_band5 = 0;total_bandNS = 0;
    total_critical = 0;total_postnosuccessor = 0;
    total_successor = 0;total_duplicate = 0;
    total_emergency = 0;total_readynow = 0;total_ready23 = 0;total_ready35 = 0;

    ngOnInit() {       
        this.checkLevel();
        this.filterForm = new FormGroup({
            fltrLOB: new FormControl('', Validators.required)

        });
               
        this.filterForm.setValue({         
            fltrLOB: ""
        });      
      
        this.loading2 = true;        
        this.getlob();   
       // this.submitfilter();   
    }

    ngAfterViewInit() {
    }

    myrole;
    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/1/i.test(usrRole)) && (!/6/i.test(usrRole)) && (!/7/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
        this.myrole=usrRole;
        console.log('myrole:'+this.myrole)
    }

    mylob='';
    alllob = '';
    admintype;
    loadingLob = true;
    getlob() {
        this._GET_api_Service.GET_SP_DATA(this.getLOBAPI).subscribe(data => {
            //console.log(data)
            this.optLobList = data;
            this.loadingLob = false; 
            if (data.length === 1) {
                this.admintype = this.optLobList[0].admin;
                this.mylob = this.optLobList[0].lob;
                this.alllob = this.optLobList[0].lob;
                this.filterForm.patchValue({ fltrLOB: this.alllob });
            }
            if (data.length > 1){
                let ids = this.optLobList.map(function(item) {
                    return item['lob'];
                });
                this.alllob = ids.join('|');
                this.admintype = this.optLobList[0].admin;
            }
            this.submitfilter(); 
            console.log('admintype:'+this.admintype)
        },
            error => {
                console.log('[ERROR - Get Lob List Talent HCBD] ' + error);
                this.loadingLob = true;
            }
        );
    }

    changeyr() {
        this.lobval = this.filterForm.get('fltrLOB').value;     
        this.submitfilter();              
    }

    submitfilter() {
        this.loading2 = true;
        let lobvalue;
        
        if (this.lobval == ''  && this.admintype == 'HCBD' ){
            lobvalue = this.alllob;           
        }
        else{
            lobvalue = this.lobval;
        }
           
            let dataPos;
            dataPos = { Lob_Desc: lobvalue }               

        this._POST_api_Service.POST_SP_data(this.getDashboardAPI, dataPos).subscribe(res => {
            console.log(dataPos)
            console.log(res)
            this.loading2 = false;
            this.dashSummary = res.summary;
            this.total_band4 = this.dashSummary.cntband[0].total_band4;
            this.total_band5 = this.dashSummary.cntband[0].total_band5;
            this.total_bandNS = this.dashSummary.cntband[0].total_bandNS;
            this.total_critical = this.dashSummary.cntCritical[0].total_critical;
            this.total_postnosuccessor = this.dashSummary.cntNosucc[0].total_postnosuccessor;
            this.total_successor = this.dashSummary.cntTotalsucc[0].total_successor;
            this.total_duplicate = this.dashSummary.cntDuplicate[0].total_duplicate;
            this.total_emergency = this.dashSummary.cntCategory[0].total_emergency;
            this.total_readynow = this.dashSummary.cntCategory[0].total_readynow;
            this.total_ready23 = this.dashSummary.cntCategory[0].total_ready23;
            this.total_ready35 = this.dashSummary.cntCategory[0].total_ready35;      
            
        }, error => {
            this.loading2 = true;
            console.log('[ERROR] Fail to submit filter ' + error);
        });
    }

    
    

    
    

    
}