import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './sptracking-vars';
import { LOB, lobArr } from "./arrCons";
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
// import { Requestor, reqArr } from "./arrCons";
import { PagerService } from '../../job/shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NotifierService } from 'angular-notifier';


export interface IOption {
    name: string,
    positionId: string,
    positionName: string,
    status: string
}
export interface IOptionD {
    orgUnitDept: string
}
export interface IOptionU {
    orgUnit: string
}

@Component({
    selector: 'app-sptracking',
    templateUrl: './sptracking.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./sptracking.component.css']
})

export class sptrackingComponent implements OnInit, AfterViewInit {

    // pager object
    pager: any = {};
    pageSize = 10;
    pagedItems: any[];
    pager2: any = {};
    pageSize2 = 10;
    pagedItems2: any[];
    private readonly notifier: NotifierService;
    selBatchVal: any;
    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        notifierService: NotifierService, private formBuilder: FormBuilder,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) 
        {
            this.notifier = notifierService;
            this.submitForm = this.formBuilder.group({
                chkboxPos: this.formBuilder.array([], )
            });
            this.submitForm2 = this.formBuilder.group({
                chkboxPos2: this.formBuilder.array([], )
            });            
        }
   
    loading = true;
    loading2 = true;
    loading1 = true;
    downloading = true;
    downloading2 = true;
    displaybutton = false;
    displaybutton45 = false;
    
    filterForm : FormGroup;
    addNewForm: FormGroup;  
    submitForm: FormGroup;  
    submitForm2: FormGroup;  

    mySearch: string; 
    userList = [];
  
    name: string = '';
    found: boolean;
    options: IOption[];
    selected: IOption[];

    nameDept: string = '';
    foundDept: boolean;
    optionsD: IOptionD[];
    selectedD: IOptionD[];

    nameUnit: string = '';
    foundUnit: boolean;
    optionsU: IOptionU[];
    selectedU: IOptionU[];

    public formatter(option: IOption, query?: string): string {
        return `${option.name} / ${option.positionId} / ${option.positionName}`;
    }

    public formatterD(optionD: IOptionD, query?: string): string {
        return `${optionD.orgUnitDept}`;
    }

    public formatterU(optionU: IOptionU, query?: string): string {
        return `${optionU.orgUnit}`;
    }

    idpData; idpData2; applListCrData; applList45Data;
    getLOBAPI = INVars.getLOBJobAdsAPI;

    optLob: LOB = new LOB();
    //optLobList = Array<lobArr>();
    optLobList = []; 
    descEmptyData = 'For better response, please customize your filter';
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

        this.addNewForm = new FormGroup({
            juUser: new FormControl('', Validators.required),          
        });
               
        this.addNewForm.setValue({
            juUser: "",
        });

       /* this.submitForm = new FormGroup({
            calibrateNom: new FormControl('', Validators.required),          
        });
               
        this.submitForm.setValue({
            calibrateNom: "",
        });*/

        this.selectDeptMult = false;
        this.selectUnitMult = false;
        this.loading = false;
        this.loading2 = false;
        this.idpData = [];
        this.idpData2 = [];
        this.applListCrData = [];
        this.applList45Data = [];
        this.setPage(1);
        this.setPage2(1); 
        this.getBatch(); 
        this.getAllBatch(); 
        this.getState();    
        this.getlob();   
    }

    ngAfterViewInit() {
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.idpData.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.idpData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    setPage2(page: number) {
        // get pager object from service
        this.pager2 = this.pagerService.getPager(this.idpData2.length, page, this.pageSize);
        // get current page of items
        this.pagedItems2 = this.idpData2.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
    }

    myrole;
    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/1/i.test(usrRole)) && (!/6/i.test(usrRole)) && (!/7/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
        this.myrole=usrRole;
    }

    stateInfo;
    loadingState = true;
    getState() {
        this._GET_api_Service.GET_data(INVars.getStatesAPI).subscribe(data => {
            //console.log(data)
            this.stateInfo = data;
            this.loadingState = false;

        }, error => {
            console.log('[ERROR - Fail to get state] ' + error);
            this.loadingState = true;
        });
    }

    mylob = '';
    alllob = '';
    alllob2 = '';
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
                this.alllob2 = "'"+this.optLobList[0].lob+"'";
                this.filterForm.patchValue({ fltrLOB: this.alllob });
                this.cntlob = 1;              
            }
            //if (data.length > 1){
            else{
                let ids = this.optLobList.map(function(item) {
                    return item['lob'];
                });
                let ids2 = this.optLobList.map(function(item) {
                    return "'" +item['lob']+ "'";
                });
                
                this.alllob = ids.join('|');
                this.alllob2 = ids2.join(',') ;
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
            this.allbatchInfo = data;
            this.loadingAllBatch = false;
        }, error => {
            console.log('[ERROR - Fail to get all SP batches] ' + error);
            this.loadingAllBatch = true;
        });
    }

    modalTitle; isAddData;
    deptList: any = [];
    fltrDept2;
    submitFilter(type) {
        this.loading = true;
        this.loading2 = true;
        this.downloading = true;
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

            this.selBatchVal = this.filterForm.get('fltrBatch').value;

                let dataPos;

                dataPos = {                   
                    Pers_Subarea: this.filterForm.get('fltrState').value,
                    Lob_Desc: lobval,
                    //Org_Unit: unit,
                    //Org_Unit_Dept: dept,
                    Org_Unit: this.filterForm.get('fltrUnit').value,
                    Org_Unit_Dept: this.filterForm.get('fltrDept').value,
                    Post_ID: this.filterForm.get('fltrPostID').value,
                    TM_Band: this.filterForm.get('fltrBand').value,
                    Pernr_No: this.filterForm.get('fltrStaffID').value,
                    Batch_id: this.selBatchVal
                }
                
                console.log(dataPos)
               
                //listing post band 4 n 5
                this._POST_api_Service.POST_SP_data(INVars.getSPPostAPI, dataPos).subscribe(data => {
                    //console.log(data)

                    this.idpData2 = data;
                    this.applList45Data= data;
                    if (data.length === 0) {
                        this.displaybutton45 = true;
                        this.descEmptyData2 = 'List is Empty';
                    }
                   
                    this.setPage2(1);
                    this.loading2 = false;
                    this.downloading2 = false;
                }, error => {
                    this.loading2 = false;
                    this.downloading2 = true;
                    console.log('[ERROR] Fail to submit filter and download for band 4 & 5: ' + error);
                });

                //listing critical
                this._POST_api_Service.POST_SP_data(INVars.getSPCriticalAPI, dataPos).subscribe(data => {
                    //console.log(data)

                    this.idpData = data;
                    if (data.length === 0) {
                        this.displaybutton = true;
                        this.descEmptyData = 'List is Empty';
                    }
                    
                    this.setPage(1);
                    this.loading = false;
                }, error => {
                    this.loading = false;
                    console.log('[ERROR] Fail to submit filter for critical: ' + error);
                });

                //reporting 4 & 5
                // this._POST_api_Service.POST_SP_data(INVars.getSPPostAPI, dataPos).subscribe(data => {
                //     this.downloading2 = false;
                //     this. applList45Data= data;
        
                // }, error => {
                //     this.downloading2 = true;
                //     console.log('[ERROR - Download SP Band 4 & 5] ' + error);
                // });

                //reporting critical
                this._POST_api_Service.POST_SP_data(INVars.getSPdldCriticalAPI, dataPos).subscribe(data => {
                    this.downloading = false;
                    this.applListCrData = data;
        
                }, error => {
                    this.downloading = true;
                    console.log('[ERROR - Download SP Critical Post] ' + error);
                });
          
        }

        //reset form
        else if (type === 2) {
           this.closeDropdownFilter();
           this.closeDropdownFilter2();         
           this.filterForm.setValue({
                fltrState: "",
                fltrLOB: this.cntlob === 1 ? this.alllob : '' ,
                fltrStaffID: "",
                fltrBand: "",
                fltrPostID: "",
                fltrBatch: this.batchInfo[0].batch_id,
                fltrDept: "" ,
                fltrUnit: ""
            });
            
            this.loading = false;
            this.loading2 = false;
            this.displaybutton=false;
            this.displaybutton45=false;
            this.setPage(1);
            this.setPage2(1);
            this.pagedItems2.length=0;
            this.pagedItems.length=0;
            this.pager2.pages.length=0;
            this.pager.pages.length=0;
            this.idpData = [];
            this.idpData2 = [];
            this.applListCrData = [];
            this.applList45Data = [];                 
        }
    }

    timer = null;
    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
        clearTimeout(this.timer);
        //this.timer = setTimeout(() => {
        if (event.target.value.length > 2) {
            if (this.multiSelUser.length < 2) {
                this.searchUser(this.name);  
                       
            }
        }
    //}, 500);
    }
    
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
 
    // onNameKeyUpUnit(event: any) {
    //     this.nameUnit = event.target.value;
    //     this.foundUnit = false;
    //     if (this.nameUnit.length > 3) {
    //         if (this.multiSelUnit.length < 1) {
    //             this.searchUnit(this.nameUnit);                      
    //         }
    //     }
    // }   
    
    save(item){
         let val = item.positionId;                
         for (let i = 0; i < this.multiSelUser.length; i++) {            
            if (this.multiSelUser[i].positionId === val){
                //console.log('found same post at position'+i)
                this.disableDuplicate = true;
                this.selectedUser=true;
                setTimeout(() => {
                    this.disableDuplicate = false;
                }, 5000);
                               
                this.newData.splice(i, 1);              
            }
        }
    }    

    dataSearch: any = {};
    newData: any = [];
    newDataDept: any = [];
    newDataUnit: any = [];

    searchUser(name) {
        let data = {
            text: name,
            lob: this.admintype === 'TCM' ? "" : this.alllob2
        }
        //console.log (data)
        let searchUserSend = this._POST_api_Service.POST_data(INVars.searchCriticalAPI, data);
        let ret = searchUserSend.subscribe(dataRes => {
            this.dataSearch = dataRes;
            if (this.dataSearch.results) {
                if (this.dataSearch.results.length > 10) {
                    this.newData = this.dataSearch.results.slice(0, 10);
                }
                else {
                    this.newData = this.dataSearch.results;
                }
            }
        },
            error => {
                console.log('[ERROR + User Not Found] - '+ name, error);
            })
    }

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

    // searchUnit(name) {
    //     let data = {
    //         text: name
    //     }
    //     let results = [];
    //     let searchUserSend = this._POST_api_Service.POST_data(INVars.searchOrgUnitAPI, data);
    //     let ret = searchUserSend.subscribe(dataRes => {
    //         this.dataSearch = dataRes;
    //         if (this.dataSearch.results) {
    //             if (this.dataSearch.results.length > 10) {
    //                 this.newDataUnit = this.dataSearch.results.slice(0, 10);
    //             }
    //             else {
    //                 this.newDataUnit = this.dataSearch.results;
    //             }          
    //          }       
    //     },
    //         error => {
    //             console.log('[ERROR + Dept Not Found]', error);
    //         })
    // }

    filters = [];
    addNewSubmit() {
    //console.log('multiSelUser: '+this.multiSelUser.length)
    //console.log(this.multiSelUser);
        if(this.multiSelUser.length > 0) {
            for (let i = 0; i < this.multiSelUser.length; i++) {
                let data = {
                    
                        Post_ID: this.multiSelUser[i].positionId,
                        Batch_id: this.batchInfo[0].batch_id
                    }
                    let Post_nm = this.multiSelUser[i].positionName;
                    let addCr = this._POST_api_Service.POST_SP_data('/sp/admin/addCritical', data);
                    let dataJUDel: any = {};
                    let ret = addCr.subscribe(dataRes => {
                        dataJUDel = dataRes;
                        if (dataJUDel.status === 0) {                  
                            this.notifier.notify('success','Successfully add '+Post_nm+' to Critical Position');
                        } 
                        else {                    
                            this.notifier.notify('error','Position '+Post_nm+' already exist');
                        }
                        this.resetForm();
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
                        
                        this.submitFilter(1);                                                                
                }, 
                error => {
                            console.log('[ERROR + User Not Found]- '+this.multiSelUser[i].positionId, error);
                        }
                )               
            }
        }
    }

    resetForm() {
        this.multiSelUser = [];
        this.addNewForm.setValue({
            juUser: "",
       
        });
    }

    multiSelDept: any = [];
    multiSelUnit: any = [];
    multiSelUser: any = [];
    disable = false;
    disableDept = false;
    disableUnit = false;
    disableDuplicate = false;
    selectedUser = false;
    multiSelectedUser(user) {
        if (user.length <= 2) {
            this.multiSelUser = user;
            this.disable = false;
        }
        else if (user.length > 2) {
            console.log('Max 2 Position Only');
            this.disable = true;
        }   
        this.newData = [];
    }

    deletePost(id,name) {
        let dataPos = {
            Post_ID: id,
            Batch_id: this.batchInfo[0].batch_id
        }
        this._POST_api_Service.POST_SP_data(INVars.deleteCriticalAPI, dataPos).subscribe(data => {
            if (data.status === 'OK') {                  
                this.notifier.notify('success','Successfully delete '+name+' from Critical Position');
                this.submitFilter(1);
            } 
            
        }, error => {
            console.log('[ERROR] Fail to delete critical post: ' + error);
        });
    }

    download() {
        this.downloading = true;
        var csvData = this.ConvertToCSV(this.applListCrData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'SP_CriticalPost_' + dateToday + '.csv';
        a.click();
        this.downloading = false;
        return 'success';
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
        a.download = 'SP_Band4And5_' + dateToday + '.csv';
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

    onCheckboxChange(e) {
        const chkboxPos: FormArray = this.submitForm.get('chkboxPos') as FormArray;
        if (e.target.checked) {
          chkboxPos.push(new FormControl(e.target.value));
        } else {
           const index = chkboxPos.controls.findIndex(x => x.value === e.target.value);
           chkboxPos.removeAt(index);
        }
    }
    onCheckboxChange2(e) {
        const chkboxPos2: FormArray = this.submitForm2.get('chkboxPos2') as FormArray;
        if (e.target.checked) {
          chkboxPos2.push(new FormControl(e.target.value));
        } else {
           const index = chkboxPos2.controls.findIndex(x => x.value === e.target.value);
           chkboxPos2.removeAt(index);
        }
    }

    submit(btnRole){
        let sts,messg,i;

        if(btnRole === 'HCBD'){
            sts = 2;
            messg = 'Submitted';
        } 
        else{
            sts = 3;
            messg = 'Verified';
        }

        if(this.submitForm.value.chkboxPos.length > 0) {
            for (i = 0; i < this.submitForm.value.chkboxPos.length; i++) {
                let dataStatus = {
                    batch_Id: this.filterForm.get('fltrBatch').value,
                    position_Id: this.submitForm.value.chkboxPos[i],
                    status_Id: sts  
                }
                //console.log(i+' - '+this.submitForm.value.chkboxPos[i])
                let updNominationSend = this._POST_api_Service.POST_SP_data(INVars.APIPostNominationStatus, dataStatus);
                let dataSPUpd: any = {};
                let ret = updNominationSend.subscribe(dataRes => {
                dataSPUpd = dataRes;

                // if (dataSPUpd.message === 'Success') {
                //     if(sts == 2){
                //         this.notifier.notify('success', 'Successfully Submitted!');
                //     }
                //     else {
                //         this.notifier.notify('success', 'Successfully Verified!');
                //     }       
                // } 
                // else if (dataSPUpd.message === "cancel") {
                //     this.notifier.notify('error', 'Submit Fail!');
                // }
                // else{
                //     this.notifier.notify('error', 'Error! '+ dataSPUpd.msg);
                // }             
                this.submitForm = this.formBuilder.group({
                    chkboxPos: this.formBuilder.array([], )
                });            
                this.submitFilter(1);       
            },
                error => {
                    console.log('[ERROR + User Not Found: ' + error);
            })                                               
            }      
            this.notifier.notify('success', 'Successfully '+messg+'!');                                    
        }

    }

    submit2(btnRole){ 
        let sts,messg,i;

        //7-talenthcbd, 6-tcm
        if(btnRole === 'HCBD'){
            sts = 2;
            messg = 'Submitted';
        } 
        else{
            sts = 3;
            messg = 'Verified';
        }

        if(this.submitForm2.value.chkboxPos2.length > 0) {
            for (i = 0; i < this.submitForm2.value.chkboxPos2.length; i++) {
                let dataStatus = {
                    batch_Id: this.filterForm.get('fltrBatch').value,
                    position_Id: this.submitForm2.value.chkboxPos2[i],
                    status_Id: sts  
                }
                //console.log(i+' - '+this.submitForm2.value.chkboxPos2[i])
                let updNominationSend = this._POST_api_Service.POST_SP_data(INVars.APIPostNominationStatus, dataStatus);
                let dataSPUpd: any = {};
                let ret = updNominationSend.subscribe(dataRes => {
                dataSPUpd = dataRes;

                // if (dataSPUpd.message === 'Success') {
                //     if(sts == 2){
                //         this.notifier.notify('success', 'Successfully Submitted!');
                //     }
                //     else {
                //         this.notifier.notify('success', 'Successfully Verified!');
                //     }       
                // } 
                // else if (dataSPUpd.message === "cancel") {
                //     this.notifier.notify('error', 'Submit Fail!');
                // }
                // else{
                //     this.notifier.notify('error', 'Error! '+ dataSPUpd.msg);
                // }                       
                this.submitFilter(1);  
                this.submitForm2 = this.formBuilder.group({
                    chkboxPos2: this.formBuilder.array([], )
                });               
            },
                error => {
                    console.log('[ERROR + User Not Found: ' + error);
            })
                       
            }
            this.notifier.notify('success', 'Successfully '+messg+'!');
        }
    }

    
}