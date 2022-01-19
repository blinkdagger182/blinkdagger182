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
import { JPVars } from './adv-profile-vars';
// C:\Projects\ghcm_portal\src\app\auth\_directives\alert.component.ts
import { JobDetailComponent } from '../job-detail/job-detail.component';

import { PagerService } from '../shared/pager/pager.component';
import { Headers } from '@angular/http';
import { LOB, lobArr } from "./arrCons";
import { GET_Service } from '../../../../api/get.service';

@Component({
    selector: 'app-adv-profile',
    templateUrl: '../shared/adv-prof-list/job-adv-prof.component.html',//./job-profile.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})

export class AdvProfileComponent {//} implements OnInit {
    posId = GlobalVariable.POS_ID; posName = GlobalVariable.POS_NAME; staffId = GlobalVariable.STAFF_ID;
    title1 = JPVars.title1; title2 = JPVars.title2; pageSize = JPVars.pageSize;
    apiUrl = JPVars.jobProfileSearchAPI;
    totalRes = '0';
    displayTbl = false; errNoResult = JPVars.errNoResult; errSearch = JPVars.errSearch;
    searchResult: string; searchResultStyle: string; searchResultIcon: string;

    data: any = {};
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
    isAdv = true;

    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];

    getLOBAPI = JPVars.getLOBJobAdsAPI;
    optLob: LOB = new LOB();
    optLobList = Array<lobArr>();
    searchByLOB = JPVars.jobAdvSearchLOB;

    @ViewChild('alertError',
        { read: ViewContainerRef }) alertError: ViewContainerRef;
    constructor(
        private pagerService: PagerService, private route: ActivatedRoute,
        private _POST_api_Service: POST_Service,
        private _GET_api_Service: GET_Service,
        private http: Http, private routers: Router,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
        //this.getJobProfile();
        //this.getProfileData();       
        this.getlob();
    }

    loadingLob = true;
    getlob() {
        this._GET_api_Service.GET_data(this.getLOBAPI).subscribe(data => {
            this.optLobList = data; this.loadingLob = false;
        },
            error => {
                console.log('[ERROR - Get Lob List New Adv Page] ' + error);
                this.loadingLob = false;
            }
        );
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
        //console.log(event.target.value);
        // this.routers.navigate(['job/profile/search/', this.name]);
    }

    /*
    getJobAdvDetails(positionId) {
        this.routers.navigate(['job/detail', positionId]);
    }*/

    getProfile(srcParam, srcLOB) {
        // let data = { text: srcParam  }
        if (srcLOB.toLocaleUpperCase() === 'ALL') {
            srcLOB = '';
        }
        let data = { text: srcParam, lob: srcLOB }
        return this._POST_api_Service.POST_data(this.searchByLOB, data);
    }

    getProfileData2(term: string, lob: string) {
        //this.getProfileData(term);
        this.getProfileData(term, lob);
        this.routers.navigate([JPVars.rAdvSearch, term, lob]);
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
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase());
        let roleArr = usrRole.split(",");
        for (let i = 0; i < roleArr.length; i++) {
            roleArr[i] = roleArr[i].trim();
        }
        // if (usrRole == 'HCBD' || usrRole == 'ADMINHCBO,HCBD') {
        if ((roleArr.indexOf('3') >= 0) || (roleArr.indexOf('1') >= 0 && roleArr.indexOf('3') >= 0)) {
            this.isAdv = false; // not in advertisement and with HCBD role
            // {TODO} - check in LOB or not
        }
    }

    /*
    ** Deprecared 
    ** Previously search by all LOB (Get Method). After 1st UAT requirement changed to search By specific LOB using POST method    
    getProfileData(srcParam) {        
        this.loading = true;        
        this.getProfile(srcParam).subscribe(data => {
            //console.log("Adv - getProfileData");
            //this.title1 = JPVars.title1; this.title2 = JPVars.title2;
            this.data = data;
            this.totalRes = this.data.results.length;
            this.loading = false;             
            this.displayTbl=true;
            if (this.data.results.length>0){
                this.searchResult= "You have search for "+srcParam+". ";
                this.searchResult+= this.data.results.length+" result(s) found. ";
                this.searchResultStyle='primary'; this.searchResultIcon='la-info-circle';
            }else {
                //this.showAlert('alertError');            
                //this._alertService.error(this.errNoResult);
                this.searchResult= "You have search for "+srcParam+". " +this.errNoResult;  
                this.searchResultStyle='warning'; this.searchResultIcon='la-warning';
            }
            this.setPage(1);
        },
        error => {
            this.showAlert('alertError');
            // this._alertService.error(error);
            this._alertService.error(this.errSearch);
            console.log('[ERROR] Search Advertisement Profile: ' +error);
            this.loading = false;
        })
        
        //console.log(this.title1 );
    } */

    goToJobDetails(posId) {
        this.routers.navigate([JPVars.rJobDetail, posId]);
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
        // let srcParam = this.route.snapshot.paramMap.get('param');
        this.checkLevel();
        let srcParam = this.route.snapshot.paramMap.get('term');
        let srcLob = this.route.snapshot.paramMap.get('lob');
        if (srcParam) {
            this.getProfileData(srcParam.trim(), srcLob.trim()); this.mySearch = srcParam.trim(); this.myLob = srcLob.trim();
        } else { this.mySearch = ''; this.myLob = ''; }
    }
    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
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