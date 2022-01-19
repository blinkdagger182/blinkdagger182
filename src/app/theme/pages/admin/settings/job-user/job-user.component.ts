import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ComponentFactoryResolver, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Vars } from '../settings-vars';
import { PagerService } from '../../job/shared/pager/pager.component';
//import { AlertService } from '../../../../auth/_services/alert.service';
//import { AlertComponent } from '../../../../auth/_directives/alert.component';
//import "rxjs/add/operator/map";
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { COMP, CompArr, JUVars, LOB, lobArr } from './job-user-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalVariable } from "../../../../../../environments/environment";
import { E } from '@angular/core/src/render3';

export interface IOption {
    staffNo: string,
    name: string
}

@Component({
    selector: 'app-job-user-component',
    templateUrl: './job-user.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgJobUserComponent implements OnInit {
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    loading1 = true; loading2 = true; loading3 = true; loading4 = true; loading5 = true; 
    loading6 = true; loading7 = true; loading8 = true; loading9 = true; loading10 = true;
    loading11 = true;
    err1 = false; err2 = false; err3 = false; err4 = false; err5 = false; 
    err6 = false; err7 = false; err8= false; err9 = false; err10 = false;
    err11 = false;
    jobUser = Vars.jobUser; title1 = Vars.title1;

    sec1Title = Vars.jUSec1; sec2Title = Vars.jUSec2; sec3Title = Vars.jUSec3; sec4Title = Vars.jUSec4; 
    sec5Title = Vars.jUSec5; sec6Title = Vars.jUSec6; sec7Title = Vars.jUSec7; sec8Title = Vars.jUSec8;
    sec9Title = Vars.jUSec9; sec10Title = Vars.jUSec10; sec11Title = Vars.jUSec11;

    sec1Icon = Vars.jUSec1Icon; sec2Icon = Vars.jUSec2Icon; sec3Icon = Vars.jUSec3Icon; sec4Icon = Vars.jUSec4Icon; 
    sec5Icon = Vars.jUSec5Icon; sec6Icon = Vars.jUSec6Icon; sec7Icon = Vars.jUSec7Icon; sec8Icon = Vars.jUSec8Icon;
    sec9Icon = Vars.jUSec9Icon; sec10Icon = Vars.jUSec10Icon; ; sec11Icon = Vars.jUSec11Icon;

    name: string = '';
    found: boolean;
    mySearch: string; myLob: string; myType = JUVars.myType;

    addNewForm: FormGroup;
    addNewFormComp: FormGroup;
    addNewFormPnl: FormGroup;
    getLOBAPI = JUVars.getLOBAPI;
    getCOMPAPI = JUVars.getCOMPAPI;
    optLob: LOB = new LOB();
    optLobList = Array<lobArr>();
    optComp: COMP = new COMP();
    optCompList = Array<CompArr>();
    searchRes = Array;
    jobAdvUserSearch = JUVars.jobAdvUserSearch;
    jobAdvUserAdd = JUVars.jobAdvUserAdd;
    jobAdvUserCompAdd = JUVars.jobAdvUserCompAdd;
    getJobUserList = JUVars.getJobUserList;
    jobAdvUserDel = JUVars.jobAdvUserDel;
    jobAddPnlMgmt = JUVars.jobAddPnlMgmt;
    userList = [];
    options: IOption[];
    selected: IOption[];

    private readonly notifier: NotifierService;

    constructor(
        private pagerService: PagerService,
        private route: ActivatedRoute, private routers: Router,
        private _script: ScriptLoaderService,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
        //private _alertService: AlertService, private cfr: ComponentFactoryResolver
        
    ) {
        this.getUserList();
        this.getlob();
        this.getComp();
        this.notifier = notifierService;
    }

    ListAdm = []; ListHead = []; ListAdv = []; ListEdt = []; ListPro = []; 
    ListHeadHCBO = []; ListExp = []; ListHCBD = []; ListPM = []; ListRPM = []; 
    ListMAPS = []; ListVRP = []; 

    ngOnInit() {
        if(this.env === 'prod')
               this.env_prod = true;
            else
               this.env_prod = false;
        this.loading1 = true; this.loading2 = true; this.loading3 = true; this.loading4 = true
        this.loading6 = true; this.loading7 = true; this.loading8 = true; this.loading9 = true; 
        this.loading10 = true; this.loading11 = true;

        this.addNewForm = new FormGroup({
            juUser: new FormControl("", Validators.required),//minLength(2)),
            juLOB: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewForm.setValue({
            juUser: "",
            juLOB: "",
        });

        this.addNewFormComp = new FormGroup({
            juUser: new FormControl("", Validators.required),//minLength(2)),
            juCOMP: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewFormComp.setValue({
            juUser: "",
            juCOMP: "",
        });

        this.addNewFormPnl = new FormGroup({
            juUserPnl: new FormControl("", Validators.required),//minLength(2)),
            juLOBPnl: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewFormPnl.setValue({
            juUserPnl: "",
            juLOBPnl: "",
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-job-user-component',
            [
                'assets/js/superadmin/delete-alert.js',
                // 'assets/js/superadmin/bootstrap-notify.js',
            ]);
    }

    getUserList() {
        this._GET_api_Service.GET_data(this.getJobUserList).subscribe(data => {
            this.userList = data;
            this.ListAdm = this.userList.filter(user => user.Role === 'Admin');
            this.ListHead = this.userList.filter(user => user.Role === 'HeadHCBD');
            this.ListAdv = this.userList.filter(user => user.Role === 'Advertiser');
            this.ListEdt = this.userList.filter(user => user.Role === 'HCBD');
            this.ListPro = this.userList.filter(user => user.Role === 'Career MGMT');
            this.ListExp = this.userList.filter(user => user.Role === 'Talent MGMT');
            this.ListHCBD = this.userList.filter(user => user.Role === 'Talent HCBD');
            this.ListPM = this.userList.filter(user => user.Role === 'PanelMGMT');
            this.ListRPM = this.userList.filter(user => user.Role === 'RPM');
            this.ListMAPS = this.userList.filter(user => user.Role === 'MAPS HCBD');
            this.ListVRP = this.userList.filter(user => user.Role === 'VRP HCBO');

            this.setPageAdm(1); this.setPageHead(1); this.setPageAdv(1); 
            this.setPageEdt(1); this.setPagePro(1); this.setPageExp(1); 
            this.setPageHCBD(1); this.setPagePM(1); this.setPageRPM(1); 
            this.setPageMAPS(1); this.setPageVRP(1);
            this.loading1 = false; this.loading2 = false; this.loading3 = false; this.loading4 = false; 
            this.loading5 = false; this.loading6 = false; this.loading7 = false; this.loading8 = false; 
            this.loading9 = false; this.loading10 = false; this.loading11 = false;
        });
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

    loadingComp = true;
    getComp() {
        this._GET_api_Service.GET_data(this.getCOMPAPI).subscribe(data => {
            this.optCompList = data;
            this.loadingComp = false;
        },
            error => {
                console.log('[ERROR - Get Lob List] ' + error);
                this.loadingLob = false;
            }
        );
    }

    onNameKeyUp(e) {
        //this.name =e ;
        this.found = false;
        if (e.length > 2) {
            if (this.multiSelUser.length < 1) {
                this.searchUser(e);
            }
        }
    }

    dataSearch: any = {};
    newData: any = [];
    searchUser(e) {
        console.log(e,'namaaa');
        
        this.selectUser = true;
      
        if(e){

        if(e.length > 2){
        let searchUserSend = this._POST_api_Service.POST_data(this.jobAdvUserSearch, {text: e});
        
        let ret = searchUserSend.subscribe(dataRes => {
            this.dataSearch = dataRes;
            console.log(this.dataSearch,'this.dataSearch');
            if (this.dataSearch.results) {
                if (this.dataSearch.results.length > 10) {
                    this.newData = this.dataSearch.results.slice(0, 10);
                }
                else {
                    this.newData = this.dataSearch.results;
                }
            }
            console.log(this.newData,'data baru');
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
        }
        }
    }

    selectUser = false;
    loadingSubmit = false;
    addNewSubmit() {
        let dataPost: any = {};
        this.selectUser = false;
        console.log(this.searchUserStaffNo, 'emp3');
        this.searchUserList =[];
        dataPost = {
            staffId: this.searchUserStaffNo,
            lob: this.addNewForm.get('juLOB').value,
            role: this.addTitle === "Admin" ? 1 : this.addTitle === "HeadHCBD" ? 2 : this.addTitle === "Advertiser" ? 3 : this.addTitle === "HCBD" ? 4 : this.addTitle === "Career Management" ? 5 : this.addTitle === "Talent Management" ? 6 : this.addTitle === "Talent HCBD" ? 7 : this.addTitle === "RPM" ? 9 : this.addTitle === "MAPS HCBD" ? 10 : this.addTitle === "VRP HCBO" ? 11 : null,
        }
        let addUserSend = this._POST_api_Service.POST_data(this.jobAdvUserAdd, dataPost);
        let dataJUAdd: any = {};
        let ret = addUserSend.subscribe(dataRes => {
            dataJUAdd = dataRes;
            console.log(dataJUAdd, 'dataJUAdd');
            if (dataJUAdd.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New User !');
                this.getUserList();
            } else {
                this.notifier.notify('error', 'Error - Cannot add duplicate user !');
            }
            this.addNewForm.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
                // this.bcShowMsg = true;
                // this.advPosMsg = 'Fail to Broadcast Message.'
                // this.advPosStyle = " alert-danger ";this.loadingSubmit=false;
            }
        )

    }

    addNewSubmitComp() {
        let dataPost: any = {};
        dataPost = {
            staffId: this.multiSelUser[0].staffNo,
            comp: this.addNewFormComp.get('juCOMP').value,
            role: this.addTitle === "VRP HCBO" ? 11 : null,
        }
        let addUserSend = this._POST_api_Service.POST_data(this.jobAdvUserCompAdd, dataPost);
        let dataJUAdd: any = {};
        let ret = addUserSend.subscribe(dataRes => {
            dataJUAdd = dataRes;
            if (dataJUAdd.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New User !');
                this.getUserList();
            } else {
                this.notifier.notify('error', 'Error - Cannot add duplicate user !');
            }
            this.addNewFormComp.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
                // this.bcShowMsg = true;
                // this.advPosMsg = 'Fail to Broadcast Message.'
                // this.advPosStyle = " alert-danger ";this.loadingSubmit=false;
            }
        )

    }

    // Save Panel Management (23/08/2021)
    addPanelSubmit() {
        let dataPostPnl: any = {};
       
        dataPostPnl = {
            staffId: this.searchUserStaffNo,
            lob: this.addNewFormPnl.get('juLOBPnl').value,
            role: this.addTitle === "PanelMGMT" ? 8 : null,
        }
        let addUserPnlSend = this._POST_api_Service.POST_REC_data(this.jobAddPnlMgmt, dataPostPnl);
        let dataJUAdd: any = {};
        let ret = addUserPnlSend.subscribe(dataRes => {
            dataJUAdd = dataRes;
            if (dataJUAdd.status === 0) {
                this.notifier.notify('success', 'Successfully Add New User !');
                this.getUserList();
            } else {
                this.notifier.notify('error', 'Error - Cannot add duplicate user !');
            }
            // this.addNewFormPnl.reset();
            this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
           }
        )
    }


    selUser: any = {};
    selectedUser(user) {
        this.selUser = user;
        console.log('this.selUser',this.selUser)
    }

    delJobUserSubmit() {
        let data = {
            id: this.selUser.id
        }
        let deleteUserSend = this._POST_api_Service.POST_data(this.jobAdvUserDel, data);
        let dataJUDel: any = {};
        let ret = deleteUserSend.subscribe(dataRes => {
            dataJUDel = dataRes;
            if (dataJUDel.status === "OK") {
                this.notifier.notify('success', 'Successfully Delete User !');
                this.getUserList();
            } else {
                this.notifier.notify('error', 'Error - Fail to delete user !');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )

    }

    //Delete Panel
    
    delJobUserPanelSubmit(user) {
        let data = {
            id: user
        }
        console.log('Deldatapnl',data)
        let deleteUserSend = this._POST_api_Service.POST_REC_data('/recruitment/admin/dltJobUser', data);
        let dataJUDel: any = {};
        let ret = deleteUserSend.subscribe(dataRes => {
            dataJUDel = dataRes;
            if (dataJUDel.status == "OK") {
                this.notifier.notify('success', 'Successfully Delete User !');
                this.getUserList();
            } else {
                this.notifier.notify('error', 'Error - Fail to delete user !');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )

    }

    pagerAdm: any = {}; pagedItemsAdm: any[];
    setPageAdm(page: number) {
        this.pagerAdm = this.pagerService.getPager(this.ListAdm.length, page, Vars.admMaxPerPage);
        this.pagedItemsAdm = this.ListAdm.slice(this.pagerAdm.startIndex, this.pagerAdm.endIndex + 1);
    }

    pagerHead: any = {}; pagedItemsHead: any[];
    setPageHead(page: number) {
        this.pagerHead = this.pagerService.getPager(this.ListHead.length, page, Vars.headMaxPerPage);
        this.pagedItemsHead = this.ListHead.slice(this.pagerHead.startIndex, this.pagerHead.endIndex + 1);
    }

    pagerAdv: any = {}; pagedItemsAdv: any[];
    setPageAdv(page: number) {
        this.pagerAdv = this.pagerService.getPager(this.ListAdv.length, page, Vars.advMaxPerPage);
        this.pagedItemsAdv = this.ListAdv.slice(this.pagerAdv.startIndex, this.pagerAdv.endIndex + 1);
    }

    pagerEdt: any = {}; pagedItemsEdt: any[];
    setPageEdt(page: number) {
        this.pagerEdt = this.pagerService.getPager(this.ListEdt.length, page, Vars.edtMaxPerPage);
        this.pagedItemsEdt = this.ListEdt.slice(this.pagerEdt.startIndex, this.pagerEdt.endIndex + 1);
    }

    pagerPro: any = {}; pagedItemsPro: any[];
    setPagePro(page: number) {
        this.pagerPro = this.pagerService.getPager(this.ListPro.length, page, Vars.proMaxPerPage);
        this.pagedItemsPro = this.ListPro.slice(this.pagerPro.startIndex, this.pagerPro.endIndex + 1);
    }

    pagerPM: any = {}; pagedItemsPM: any[];
    setPagePM(page: number) {
        this.pagerPM = this.pagerService.getPager(this.ListPM.length, page, Vars.pmMaxPerPage);
        this.pagedItemsPM = this.ListPM.slice(this.pagerPM.startIndex, this.pagerPM.endIndex + 1);
    }

    pagerRPM: any = {}; pagedItemsRPM: any[];
    setPageRPM(page: number) {
        this.pagerRPM = this.pagerService.getPager(this.ListRPM.length, page, Vars.rpmMaxPerPage);
        this.pagedItemsRPM = this.ListRPM.slice(this.pagerRPM.startIndex, this.pagerRPM.endIndex + 1);
    }

    pagerExp: any = {}; pagedItemsExp: any[];
    setPageExp(page: number) {
        this.pagerExp = this.pagerService.getPager(this.ListExp.length, page, Vars.expMaxPerPage);
        this.pagedItemsExp = this.ListExp.slice(this.pagerExp.startIndex, this.pagerExp.endIndex + 1);
    }

    pagerHCBD: any = {}; pagedItemsHCBD: any[];
    setPageHCBD(page: number) {
        this.pagerHCBD = this.pagerService.getPager(this.ListHCBD.length, page, Vars.admMaxPerPage);
        this.pagedItemsHCBD = this.ListHCBD.slice(this.pagerHCBD.startIndex, this.pagerHCBD.endIndex + 1);
    }

    pagerMAPS: any = {}; pagedItemsMAPS: any[];
    setPageMAPS(page: number) {
        this.pagerMAPS = this.pagerService.getPager(this.ListMAPS.length, page, Vars.mapsMaxPerPage);
        this.pagedItemsMAPS = this.ListMAPS.slice(this.pagerMAPS.startIndex, this.pagerMAPS.endIndex + 1);
    }

    pagerVRP: any = {}; pagedItemsVRP: any[];
    setPageVRP(page: number) {
        this.pagerVRP = this.pagerService.getPager(this.ListVRP.length, page, Vars.vrpMaxPerPage);
        this.pagedItemsVRP = this.ListVRP.slice(this.pagerVRP.startIndex, this.pagerVRP.endIndex + 1);
    }

    addTitle: string;
    updateJobUser(type: number) {
        switch (type) {
            case 1: this.addTitle = 'Admin'; break;
            case 2: this.addTitle = 'HeadHCBD'; break;
            case 3: this.addTitle = 'Advertiser'; break;
            case 4: this.addTitle = 'HCBD'; break;
            case 5: this.addTitle = 'Career Management'; break;
            case 6: this.addTitle = 'Talent Management'; break;
            case 7: this.addTitle = 'Talent HCBD'; break;
            case 8: this.addTitle = 'PanelMGMT'; break;
            case 9: this.addTitle = 'RPM'; break;
            case 10: this.addTitle = 'MAPS HCBD'; break;
        }
        this.newData = [];
        this.resetForm();
        this.multiSelUser = [];
    }

    updateJobUserComp(type: number) {
        switch (type) {
            case 11: this.addTitle = 'VRP HCBO'; break;
        }
        this.newData = [];
        this.resetFormComp();
        this.multiSelUser = [];
     }

  
    // Reset
    resetForm() {

        this.addNewForm.setValue({
            juUser: "",
            juLOB: "",
        });

    }

    resetFormComp() {

        this.addNewFormComp.setValue({
            juUser: "",
            juCOMP: "",
        });
    }

    resetFormPanel() {

        this.addNewFormPnl.setValue({
            juUserPnl: "",
            juLobPnl: "",
        });
    }

    public formatter(option: IOption, query?: string): string {
        return `${option.staffNo} - ${option.name}`;
    }

    multiSelUser: any = [];
    disable = false;
    multiSelectedUser(user) {
        if (user.length <= 1) {
            this.multiSelUser = user;
            this.disable = false;
        }
        else if (user.length > 1) {
            console.log('Max 1 Selection Only');
            this.disable = true;
        }
        this.newData = [];
    }

    searchUserList = [];
    searchUserStaffNo: any;
    getRoute(emp) {
        this.selectUser = false;
        console.log(emp, 'emp');
        //this.selectRoute = false;
        this.searchUserList = emp.search;
        this.searchUserStaffNo = emp.staffNo;
        console.log(this.searchUserStaffNo, 'emp2');

    }
}
