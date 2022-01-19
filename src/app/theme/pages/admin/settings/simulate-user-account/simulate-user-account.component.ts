import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ComponentFactoryResolver, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Vars } from '../settings-vars';
import { PagerService } from '../../job/shared/pager/pager.component';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { JUVars, LOB, lobArr } from '../job-user/job-user-vars';
import { SUAVars, LOBSUA, lobSUAArr } from './simulate-user-account-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalVariable } from "../../../../../../environments/environment";

export interface IOption {
    staffNo: string,
    name: string
}

@Component({
    selector: 'app-simulate-user-account.component',
    templateUrl: './simulate-user-account.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgSimulateUserAccountComponent implements OnInit {

    loading1 = true; loading2 = true; loading3 = true; loading4 = true; loading5 = true; loading7 = true;
    err1 = false; err2 = false; err3 = false; err4 = false;
    title1 = Vars.title1; 
    SuaTitle = Vars.SuaTitle;
    pageTitle = Vars.SuaTitle;
    titleIcon = Vars.SuaSec1Icon;
    userBtn = Vars.SuaAddbtn;

    name: string = '';
    found: boolean;
   
    addNewForm: FormGroup;
   
    userList = [];
    options: IOption[];
    selected: IOption[];


    APIPostAdd = SUAVars.APIPostAdd;
    APIPostDelete = SUAVars.APIPostDelete;
    APIGetList = SUAVars.APIGetList;

    env = GlobalVariable.ENV_NAME;
    env_prod = false;

    private readonly notifier: NotifierService;

    constructor(
        private pagerService: PagerService,
        private route: ActivatedRoute, private routers: Router,
        private _script: ScriptLoaderService,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
      
    ) {
        
        this.getUserSUList();
        this.notifier = notifierService;
    }

    ListAdm = []; 
    
    ngOnInit() {
        this.loading1 = true; this.loading2 = true; this.loading3 = true; this.loading4 = true; this.loading7 = true; 

        this.addNewForm = new FormGroup({
            SUuser: new FormControl("", Validators.required),//minLength(2)),
            SUPass: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewForm.setValue({
            SUuser: "",
            SUPass: "",
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-simulate-user-account.component',
            [
                'assets/js/superadmin/delete-alert.js',
            ]);
    }

    // Get User List
    userSUList = [];
    ListSUAdm = [];

    getUserSUList() {
        this._GET_api_Service.GET_data(this.APIGetList).subscribe(data => {
            this.userSUList = data;
            this.setPageAdm(1); 
            this.loading1 = false; 
        });
    }

    loadingSubmit = false;

    //Add User -SU
    addUser(){
        let dataAddPost: any = {};
        dataAddPost = {
            uId: this.addNewForm.get('SUuser').value,
            uPass: this.addNewForm.get('SUPass').value
        }
        let addUserSend = this._POST_api_Service.POST_data(this.APIPostAdd, dataAddPost);
        let dataAdd: any = {};
        let ret = addUserSend.subscribe(dataRes => {
            dataAdd = dataRes;
            if (dataAdd.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New User !');
                this.getUserSUList();
            } else {
                this.notifier.notify('error', 'Error - Cannot add duplicate user !');
            }
            this.addNewForm.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
               
            }
        ) 
    }

    selUser: any = {};
    selectedUser(user) {
    this.selUser = user;
    }
    //Delete User 
    delUser(){
        let data = {
            uId: this.selUser.user_id
        }
        let delUserSend = this._POST_api_Service.POST_data(this.APIPostDelete, data);
        let dataDel: any = {};
        let ret = delUserSend.subscribe(dataRes => {
            dataDel = dataRes;
            if (dataDel.status === "OK") {
                this.notifier.notify('success', 'Successfully Delete User !');
                this.getUserSUList();
            } else {
                this.notifier.notify('error', 'Error - Fail to delete user !');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }

      
     // Add user SU
     pagerAdm: any = {}; pagedItemsAdm: any[];
     setPageAdm(page: number) {
         this.pagerAdm = this.pagerService.getPager(this.userSUList.length, page, Vars.admMaxPerPage);
         this.pagedItemsAdm = this.userSUList.slice(this.pagerAdm.startIndex, this.pagerAdm.endIndex + 1);
       
     }

   
    resetForm() {
        this.addNewForm.setValue({
            SUuser: "",
            SUPass: "",
        });
    }

    public formatter(option: IOption, query?: string): string {
        return `${option.staffNo} - ${option.name}`;
    }

}
