import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './spreporting-vars';
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

export interface IOptionD {
    orgUnitDept: string
}
export interface IOptionU {
    orgUnit: string
}

@Component({
    selector: 'app-spreporting',
    templateUrl: './spreporting.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./spreporting.component.css']
})

export class spreportingComponent implements OnInit, AfterViewInit {

    // pager object  
    pager2: any = {};
    pageSize2 = 20;
    pagedItems2: any[];

    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
    }
    
    loading2 = true;    
    downloading2 = true;  
    filterForm : FormGroup;

    nameDept: string = '';
    foundDept: boolean;
    optionsD: IOptionD[];
    selectedD: IOptionD[];

    nameUnit: string = '';
    foundUnit: boolean;
    optionsU: IOptionU[];
    selectedU: IOptionU[];

    idpData2; applList45Data;
    getLOBAPI = INVars.getLOBJobAdsAPI;
    optLob: LOB = new LOB();
    //optLobList = Array<lobArr>();
    optLobList = [];  
    descEmptyData2 = 'For better response, please customize your filter';
    selectDeptMult;selectUnitMult;

    ngOnInit() {       
        this.checkLevel();
        this.filterForm = new FormGroup({
            fltrState: new FormControl('', Validators.required),
            fltrLOB: new FormControl('', Validators.required),
            fltrStaffID: new FormControl('', Validators.required),
            fltrBand: new FormControl('', Validators.required),          
            fltrPostID: new FormControl('', Validators.required),
            fltrBatch: new FormControl('', Validators.required),
            fltrDept: new FormControl('', Validators.required),
            fltrUnit: new FormControl('', Validators.required),
        });
               
        this.filterForm.setValue({
            fltrState: "",
            fltrLOB: "",
            fltrStaffID: "",
            fltrBand: "",         
            fltrPostID: "",
            fltrBatch: "",
            fltrDept: "",
            fltrUnit: "",
        });
   
        this.idpData2 = [];       
        this.applList45Data = [];        
        this.setPage2(1);      
        this.loading2 = false;
        this.getBatch(); 
        this.getAllBatch(); 
        this.getState();   
        //this.getSearchTalentFilters();   
        this.getlob();
        this.selectDeptMult = false;
        this.selectUnitMult = false;
        
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-spreporting',
            [
                'assets/js/jobs/job-adv-tracking.js',
            ]);
    }

    setPage2(page: number) {
        // get pager object from service
        this.pager2 = this.pagerService.getPager(this.idpData2.length, page, this.pageSize2);
        // get current page of items
        this.pagedItems2 = this.idpData2.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/1/i.test(usrRole)) && (!/6/i.test(usrRole)) && (!/7/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
     
    }
    loadingState = true;
    stateInfo;
    getState() {
        this._GET_api_Service.GET_data(INVars.getStatesAPI).subscribe(data => {
            //console.log(data)
            this.loadingState = false;
            this.stateInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get state] ' + error);
            this.loadingState = true;
        });
    }

    // lobOptions = [];
    // //empGroupOptions = [];
    // bandOptions = [];
    // getSearchTalentFilters() {
    //     this._GET_api_Service.GET_data(INVars.getLOBBandAPI).subscribe(data => {
    //         //console.log(data)
    //         this.lobOptions = data.filter.lob;
    //         //this.empGroupOptions = data.filter.empGroup;
    //         this.bandOptions = data.filter.band;
    //         this.loading = false;
    //         this.loading2 = false;
    //     }, error => {
    //         console.log('[ERROR - Fail to get lob & band] ' + error);
    //     });   
    // }

    mylob='';
    alllob = '';
    admintype;
    cntlob;
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
                this.cntlob = 1; 
            }
            else{
                let ids = this.optLobList.map(function(item) {
                    return item['lob'];
                });
                this.alllob = ids.join('|');
                this.admintype = this.optLobList[0].admin;
                this.cntlob = 99;
            }

        },
            error => {
                console.log('[ERROR - Get Lob List Talent HCBD] ' + error);
                this.loadingLob = true;
            }
        );
    }

    loadingBatch = true;
    batchInfo;
    getBatch() {
        this._GET_api_Service.GET_SP_DATA(INVars.getSPCurrBatchAPI).subscribe(data => {
            //console.log(data)
            this.loadingBatch = false;
            this.batchInfo = data;
            this.filterForm.patchValue({ fltrBatch: this.batchInfo[0].batch_id });
      
        }, error => {
            console.log('[ERROR - Fail to get current SP batch] ' + error);
            this.loadingBatch = true;
        });
    }

    loadingAllBatch = true;
    allbatchInfo;
    getAllBatch() {
        this._GET_api_Service.GET_SP_DATA(INVars.getSPBatchAPI).subscribe(data => {
            //console.log(data)
            this.loadingAllBatch = false;
            this.allbatchInfo = data;
        
        }, error => {
            console.log('[ERROR - Fail to get all SP batches] ' + error);
            this.loadingAllBatch = true;
        });
    }


    submitFilter(type) {
        
        this.loading2 = true;
      
        this.downloading2 = true;
        let lobval;
        let dept = '';
        let unit = '';
        
        if (type === 1) {
            if (this.filterForm.get('fltrLOB').value == '' && this.admintype == 'HCBD'){
                lobval = this.alllob;
            }
            else{
                lobval = this.filterForm.get('fltrLOB').value;
            }
            if (this.filterForm.get('fltrDept').value !== '' && this.filterForm.get('fltrDept').value !== null){
           
                dept = this.filterForm.get('fltrDept').value.orgUnitDept;
            }

            if (this.filterForm.get('fltrUnit').value !== '' && this.filterForm.get('fltrUnit').value !== null){
           
                unit = this.filterForm.get('fltrUnit').value.orgUnit;
            }

                let dataPos;

                dataPos = {                   
                    Pers_Subarea: this.filterForm.get('fltrState').value,
                    Lob_Desc: lobval,
                    Org_Unit: this.filterForm.get('fltrUnit').value,
                    Org_Unit_Dept: this.filterForm.get('fltrDept').value,
                    Post_ID: this.filterForm.get('fltrPostID').value,
                    TM_Band: this.filterForm.get('fltrBand').value,
                    Pernr_No: this.filterForm.get('fltrStaffID').value,
                    Batch_id: this.filterForm.get('fltrBatch').value
                }

                console.log(dataPos)
               
                //listing successor
                this._POST_api_Service.POST_SP_data(INVars.getSPDownAPI, dataPos).subscribe(data => {
                    //console.log(data)

                    
                    this.idpData2 = data;                   
                    this.applList45Data= data;
                    if (data.length === 0) {
                        this.descEmptyData2 = 'List is Empty';
                    }
                    this.setPage2(1);
                    this.loading2 = false;
                    this.downloading2 = false;
                }, error => {
                    this.loading2 = false;
                    this.downloading2 = true;
                    console.log('[ERROR] Fail to submit filter and download for successor: ' + error);
                });

                //reporting successor
                // this._POST_api_Service.POST_SP_data(INVars.getSPDownAPI, dataPos).subscribe(data => {
                //     this.downloading2 = false;
                //     this.applList45Data= data;
        
                // }, error => {
                //     this.downloading2 = true;
                //     console.log('[ERROR - Download SP Successor] ' + error);
                // });               
               
        }

        //reset form
        else if (type === 2) {
            this.filterForm.setValue({
                fltrState: "",
                fltrLOB: this.cntlob === 1 ? this.alllob : '' ,
                fltrStaffID: "",
                fltrBand: "",
                fltrPostID: "",
                fltrBatch: this.batchInfo[0].batch_id,
                fltrDept: "",
                fltrUnit: ""

            });
           
            this.idpData2 = [];         
            this.applList45Data = [];           
            this.setPage2(1);        
            this.loading2 = false;
        }
    }

    public formatterD(optionD: IOptionD, query?: string): string {
        return `${optionD.orgUnitDept}`;
    }

    public formatterU(optionU: IOptionU, query?: string): string {
        return `${optionU.orgUnit}`;
    }

    multiSelDept: any = [];
    multiSelUnit: any = [];
    disableDept = false;
    disableUnit = false;

    dataGetFlDept = '';
    getFlDept(data) {
        this.dataGetFlDept = data.orgUnitDept;
        console.log('selected dept: ', this.dataGetFlDept)
        this.loadingDept = false;
        this.selectDeptMult = false; 
        this.filterForm.patchValue({ fltrDept: this.dataGetFlDept});
    }

    dataGetFlUnit = '';
    getFlUnit(data) {
        this.dataGetFlUnit = data.orgUnit;
        console.log('selected unit: ', this.dataGetFlUnit)
        this.loadingUnit = false;
        this.selectUnitMult = false; 
        this.filterForm.patchValue({ fltrUnit: this.dataGetFlUnit});
    }

    closeDropdownFilter() {
        //console.log('close dropdown for dept')
        this.loadingDept = false;
        this.selectDeptMult = false;       
    }

    closeDropdownFilter2() {
        //console.log('close dropdown for unit')
        this.loadingUnit = false;
        this.selectUnitMult = false;       
    }
   
    resetDDVal(){      
        if (this.selectDeptMult === true) {
            //console.log ('reset dept')
            this.loadingDept = false;
            this.selectDeptMult = false;
            this.filterForm.patchValue({ fltrDept: ''});
        }
        if (this.selectUnitMult === true) {
            //console.log ('reset unit')
            this.loadingUnit = false;
            this.selectUnitMult = false;
            this.filterForm.patchValue({ fltrUnit: ''});
        }
    }

    resetDept(){       
        if (this.selectDeptMult === true) {
            //console.log ('close ddwn and reset dept')
            this.loadingDept = false;
            this.selectDeptMult = false;
            this.filterForm.patchValue({ fltrDept: ''});
        }
    }

    resetUnit(){       
        if (this.selectUnitMult === true) {
            //console.log ('close ddwn and reset unit')
            this.loadingUnit = false;
            this.selectUnitMult = false;
            this.filterForm.patchValue({ fltrUnit: ''});
        }
    }

    displayNoResult = false;
    onNameKeyUpDept(event: any) {        
        this.nameDept = event.target.value;
        this.foundDept = false;
        this.selectDeptMult = false;

        if (this.nameDept.length === 0) {
            this.selectDeptMult = false;
            this.loadingDept = false;
        }      
        else{
            this.displayNoResult = false;
            this.selectDeptMult = true;
            this.loadingDept = true;     
            if (this.multiSelDept.length < 1 && this.nameDept.length > 2) {
                this.searchDept(this.nameDept);                         
            }
        }           
    }

    displayNoResult2 = false;
    onNameKeyUpUnit(event: any) {        
        this.nameUnit = event.target.value;
        this.foundUnit = false;
        this.selectUnitMult = false;

        if (this.nameUnit.length === 0) {
            this.selectUnitMult = false;
            this.loadingUnit = false;
        }
        else{
            this.displayNoResult2 = false;
            this.selectUnitMult = true;
            this.loadingUnit = true;     
            if (this.multiSelUnit.length < 1 && this.nameUnit.length > 2) {
                this.searchUnit(this.nameUnit);                         
            }
        }           
    }
 
    dataSearch: any = {};
    newDataDept: any = [];
    newDataUnit: any = [];
    loadingDept = false;  
    searchDept(name) {
        let data = {
            text: name
        }
        let searchUserSend = this._POST_api_Service.POST_data(INVars.searchOrgUnitDeptAPI, data);
        let ret = searchUserSend.subscribe(dataRes => {
            this.dataSearch = dataRes;
            this.loadingDept = true;
            if (this.dataSearch.results.length >= 1) {
                
                if (this.dataSearch.results.length > 10) {
                    this.newDataDept = this.dataSearch.results.slice(0, 10);
                }
                else {
                    this.newDataDept = this.dataSearch.results;
                }
            }
            else{
                this.displayNoResult = true;
                //console.log('no result for dept')
            }
                         
        },
            error => {
                console.log('[ERROR + Dept Not Found]', error);
            })
    }

    loadingUnit = false;  
    searchUnit(name) {
        let data = {
            text: name
        }
        let searchUserSend = this._POST_api_Service.POST_data(INVars.searchOrgUnitAPI, data);
        let ret = searchUserSend.subscribe(dataRes => {
            this.dataSearch = dataRes;
            this.loadingUnit = true;
            if (this.dataSearch.results.length >= 1) {
                
                if (this.dataSearch.results.length > 10) {
                    this.newDataUnit = this.dataSearch.results.slice(0, 10);
                }
                else {
                    this.newDataUnit = this.dataSearch.results;
                }
            }
            else{
                this.displayNoResult2 = true;
                //console.log('no result for unit')
            }
                         
        },
            error => {
                console.log('[ERROR + Unit Not Found]', error);
            })
    }

    download2() {
        this.downloading2 = true;
        var csvData = this.ConvertToCSV(this.applList45Data);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type:  'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'SP_Successor_' + dateToday + '.csv';
        a.click();
        this.downloading2 = false;
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