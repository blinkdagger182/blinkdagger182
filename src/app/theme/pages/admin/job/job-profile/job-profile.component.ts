import {
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation, ComponentFactoryResolver, Component, OnInit
} from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { JPVars } from './job-profile-vars';
// C:\Projects\ghcm_portal\src\app\auth\_directives\alert.component.ts
import { JobDetailComponent } from '../job-detail/job-detail.component';

import { PagerService } from '../shared/pager/pager.component';
import { Headers } from '@angular/http';
import { LOB, lobArr } from "./arrCons";
import { GET_Service } from '../../../../api/get.service';

@Component({
    selector: 'app-job-profile',
    templateUrl: '../shared/adv-prof-list/job-adv-prof.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})

export class JobProfileComponent {//} implements OnInit {
    posId = GlobalVariable.POS_ID; posName = GlobalVariable.POS_NAME; staffId = GlobalVariable.STAFF_ID;
    title1 = JPVars.title1; title2 = JPVars.title2; pageSize = JPVars.pageSize;
    apiUrl = JPVars.jobProfileSearchAPI;
    totalRes = '0';
    displayTbl = false; errNoResult = JPVars.errNoResult; errSearch = JPVars.errSearch;
    searchResult: string; searchResultStyle: string; searchResultIcon: string;

    data: any = {}; lobList: any = {};
    param: string;
    name: string = '';
    found: boolean;
    public termPosId: string;
    public termName: string;
    public termStaffId: string;
    public termPos: string;
    public termStt: string;
    loading = false;
    mySearch: string; myLob: string; myType = JPVars.myType;
    isAdv = false;

    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];

    getLOBAPI = JPVars.getLOBAPI;
    optLob: LOB = new LOB();
    optLobList = Array<lobArr>();
    searchByLOB = JPVars.jobProfileSearchLOB;

    @ViewChild('alertError',
        { read: ViewContainerRef }) alertError: ViewContainerRef;
    constructor(
        private pagerService: PagerService,
        private route: ActivatedRoute,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private http: Http, private routers: Router,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
        //this.getJobProfile(); this.getProfileData();       
        this.getlob(); //this.listLOB.getlob(); 
    }

    loadingLob = true;
    getlob() {
        this._GET_api_Service.GET_data(this.getLOBAPI).subscribe(data => {
            this.optLobList = data;
            this.loadingLob = false;
        },
            error => {
                console.log('[ERROR - Get Lob List] ' + error);
                this.loadingLob = false;
            }
        );
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
    }

    getProfile(srcParam, srcLOB) {
        if (srcLOB.toLocaleUpperCase() === 'ALL') {
            srcLOB = '';
        }
        let data = { text: srcParam, lob: srcLOB }
        //return this._POST_api_Service.POST_data(this.apiUrl, data);
        // console.log(this.searchByLOB);console.log(data);
        return this._POST_api_Service.POST_data(this.searchByLOB, data);
    }

    getProfileData2(term: string, lob: string) {
        //this.getProfileData(term); this.routers.navigate(['job/profile/search', term]); 
        this.getProfileData(term, lob);
        this.routers.navigate([JPVars.rJobSearch, term, lob]);
    }

    getProfileData(srcParam, srcLOB) {
        this.loading = true;
        this.getProfile(srcParam, srcLOB).subscribe(data => {
            this.data = data;
            this.totalRes = this.data.results.length;
            this.loading = false;
            this.displayTbl = true;
            if (this.data.results.length > 0) {
                this.searchResult = "You have search for " + srcParam + " from " + srcLOB + ". ";
                this.searchResult += this.data.results.length + " result(s) found. ";
                this.searchResultStyle = 'primary'; this.searchResultIcon = 'la-info-circle';
            } else {
                this.searchResult = "You have search for " + srcParam + " from " + srcLOB + ". " + this.errNoResult; this.searchResultStyle = 'warning'; this.searchResultIcon = 'la-warning';
            }
            this.setPage(1);
        },
            error => {
                this.showAlert('alertError');
                this._alertService.error(this.errSearch);
                console.log('[ERROR] Search Job Profile: ' + error);
                this.loading = false;
            })

        // :: check user's job role
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        let roleArr = usrRole.split(",");
        for (let i = 0; i < roleArr.length; i++) {
            roleArr[i] = roleArr[i].trim();
        }
        if ((roleArr.indexOf('3') >= 0) || (roleArr.indexOf('1') >= 0 && roleArr.indexOf('3') >= 0)) {
            this.isAdv = false;
        }
        /*if (usrRole == 'HCBD' || usrRole == 'ADMINHCBO,HCBD') { 
            this.isAdv=false; // not in advertisement and with HCBD role 
        }*/
    }

    /*
    ** Deprecared 
    ** Previously search by all LOB (Get Method). After 1st UAT requirement changed to search By specific LOB using POST method    
    getProfileData(srcParam) {        
        this.loading = true;        
        this.getProfile(srcParam).subscribe(data => { 
            this.data = data;
            this.totalRes = this.data.results.length;
            this.loading = false;             
            this.displayTbl=true;
            if (this.data.results.length>0){
                this.searchResult= "You have search for "+srcParam+". ";
                this.searchResult+= this.data.results.length+" result(s) found. ";
                this.searchResultStyle='primary'; this.searchResultIcon='la-info-circle';
            }else { 
                this.searchResult= "You have search for "+srcParam+". " +this.errNoResult;  this.searchResultStyle='warning'; this.searchResultIcon='la-warning';
            }
            this.setPage(1);
        },
        error => {
            this.showAlert('alertError'); 
            this._alertService.error(this.errSearch);
            console.log('[ERROR] Search Job Profile: ' +error);
            this.loading = false;
        })
        
        // :: check user's job role
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase());
        if (usrRole == 'HCBD' || usrRole == 'ADMINHCBO,HCBD') { 
            this.isAdv=false; // not in advertisement and with HCBD role
            // {TODO} - check in LOB or not
        }
    } */

    goToJobDetails(posId) {
        this.routers.navigate([JPVars.rJobProf, posId]);
    }

    getStatusColor(status: string) {
        let ret: string;
        switch (status.toLocaleLowerCase()) {
            case 'occupied': ret = 'success'; break;
            case 'vacant': ret = 'warning'; break;
            default:
                ret = ''; break;
        }
        return ret;
    }
    ngOnInit() {
        //let srcParam = this.route.snapshot.paramMap.get('param');
        let srcParam = this.route.snapshot.paramMap.get('term');
        let srcLob = this.route.snapshot.paramMap.get('lob');
        if (srcParam) {
            this.getProfileData(srcParam.trim(), srcLob.trim()); this.mySearch = srcParam.trim(); this.myLob = srcLob.trim();
        } else { this.mySearch = ''; this.myLob = ''; }
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data.results.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.data.results.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }


}