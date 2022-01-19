import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalVariable } from "../../../../../environments/environment";
import { NotifierService } from 'angular-notifier';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { UsrVars, LOB, lobArr } from './user-mngt-vars';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

export interface IOption {
    staffNo: string,
    name: string
}

@Component({
    selector: 'app-user-mngt',
    templateUrl: './user-mngt.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./user-mngt-css.css']
})
export class UserMngtComponent implements OnInit {

    loading1 = true; loading2 = true;
    userList = [];
    optLobList = Array<lobArr>();
    addNewForm: FormGroup;

    name: string = '';
    found: boolean;
    mySearch: string; myLob: string; //myType = JUVars.myType;

    options: IOption[];

    private readonly notifier: NotifierService;

    constructor(
        private pagerService: PagerService, private _script: ScriptLoaderService,
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
    ) {
        this.getUserList();
        this.getlob();
        this.notifier = notifierService;
    }

    ListAdm = []; ListUser = [];

    ngOnInit() {
        this.loading1 = true; this.loading2 = true;

        this.addNewForm = new FormGroup({
            juUser: new FormControl("", Validators.required),//minLength(2)),
            juLOB: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewForm.setValue({
            juUser: "",
            juLOB: "",
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-user-mngt',
            [
                'assets/js/superadmin/delete-alert.js',
                // 'assets/js/superadmin/bootstrap-notify.js',
            ]);
    }

    getUserList() {

        this._GET_api_Service.GET_data(UsrVars.getUserAPI).subscribe(data => {
            this.userList = data;
            this.ListAdm = this.userList.filter(user => user.role === 1);
            this.ListUser = this.userList.filter(user => user.role === 2);

            this.setPageAdm(1); this.setPageUsr(1);
            this.loading1 = false; this.loading2 = false;
        });
    }

    pagerAdm: any = {}; pagedItemsAdm: any[];
    setPageAdm(page: number) {
        let maxPerPage = 20;
        this.pagerAdm = this.pagerService.getPager(this.ListAdm.length, page, maxPerPage);
        this.pagedItemsAdm = this.ListAdm.slice(this.pagerAdm.startIndex, this.pagerAdm.endIndex + 1);
    }

    pagerUsr: any = {}; pagedItemsUsr: any[];
    setPageUsr(page: number) {
        let maxPerPage = 20;
        this.pagerUsr = this.pagerService.getPager(this.ListUser.length, page, maxPerPage);
        this.pagedItemsUsr = this.ListUser.slice(this.pagerUsr.startIndex, this.pagerUsr.endIndex + 1);
    }

    loadingLob = true;
    getlob() {
        
        this._GET_api_Service.GET_data(UsrVars.getLOBAPI).subscribe(data => {
            this.optLobList = data;
            this.loadingLob = false;
        },
            error => {
                console.log('[ERROR - Get Lob List] ' + error);
                this.loadingLob = false;
            }
        );
    }

    addTitle: string;
    updateJobUser(type: number) {
        switch (type) {
            case 1: this.addTitle = 'Admin'; break;
            case 2: this.addTitle = 'User'; break;
        }
        this.newData = [];
        this.resetForm();
        this.multiSelUser = [];
    }

    resetForm() {
        this.addNewForm.setValue({
            juUser: "",
            juLOB: "",
        });
    }

    public formatter(option: IOption, query?: string): string {
        return `${option.staffNo} - ${option.name}`;
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
        if (this.name.length > 2) {
            if (this.multiSelUser.length < 1) {
                this.searchUser(this.name);
            }
        }
    }

    dataSearch: any = {};
    newData: any = [];
    searchUser(name) {
        let data = {
            text: name
        }
        let searchUserSend = this._POST_api_Service.POST_data(UsrVars.jobAdvUserSearch, data);
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
                console.log('[ERROR + User Not Found]', error);
            })
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

    loadingSubmit = false;
    addNewSubmit() {
        let dataPost: any = {};
        dataPost = {
            staffId: this.multiSelUser[0].staffNo,
            lob: this.addNewForm.get('juLOB').value,
            role: this.addTitle === "Admin" ? 1 : this.addTitle === "User" ? 2 : null,
        }

        let addUserSend = this._POST_api_Service.POST_data(UsrVars.addNewUserAPI, dataPost);
        let dataUserAdd: any = {};
        let ret = addUserSend.subscribe(dataRes => {
            dataUserAdd = dataRes;
            if (dataUserAdd.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New User !');
                this.getUserList();
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

    delUserSubmit() {
        let data = {
            id: this.selUser.id
        }

        let deleteUserSend = this._POST_api_Service.POST_data(UsrVars.delUserAPI, data);
        let dataUsrDel: any = {};
        let ret = deleteUserSend.subscribe(dataRes => {
            dataUsrDel = dataRes;
            if (dataUsrDel.status === "OK") {
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
}