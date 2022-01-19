import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Vars } from '../settings-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { PagerService } from '../../job/shared/pager/pager.component';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { VSVars } from './verify-skillsets-vars';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'app-verify-skillsets-component',
    templateUrl: './verify-skillsets.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgVerifySkillsetsComponent implements OnInit {
    title1 = Vars.title1;
    title2 = Vars.vsTitle2;
    verifySkillsets = Vars.verifySkillsets;
    loading1 = true; loading2 = true; loading3 = true;
    err1 = false; err2 = false; err3 = false;
    getSkillsetListVerifyAPI = VSVars.getSkillsetListVerifyAPI;
    getSkillsetListVerifiedAPI = VSVars.getSkillsetListVerifiedAPI;
    getSkillsetListAllAPI = VSVars.getSkillsetListAllAPI;
    postSkillsetVerify = VSVars.postSkillsetVerify;
    postSkillsetAdd = VSVars.postSkillsetAdd;
    postSkillsetDel = VSVars.postSkillsetDel;
    postSkillsetEdit = VSVars.postSkillsetEdit;
    postSkillsetUser = VSVars.postSkillsetUser;
    postSkillsetSearch = VSVars.postSkillsetSearch;
    errNoResult = VSVars.errNoResult;
    skillsetList: any = [];

    addNewSkillset: FormGroup;
    editSkillset: FormGroup;
    searchSkillset: FormGroup;
    name: string = '';

    displayTbl = false;
    displayAlert = false;
    searchResult: string; searchResultStyle: string; searchResultIcon: string;
    imgOptArrListSkillset: any;
    imgOptArrListInterest: any;

    private readonly notifier: NotifierService;

    constructor(
        private pagerService: PagerService,
        private route: ActivatedRoute,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private _script: ScriptLoaderService,
        notifierService: NotifierService,
    ) {
        this.getSkillsetListVerify();
        this.notifier = notifierService;
    }


    ngOnInit() {
        this.loading1 = true; this.loading2 = true; this.loading3 = true;

        this.addNewSkillset = new FormGroup({
            vsName: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addNewSkillset.setValue({
            vsName: "",
        });

        this.editSkillset = new FormGroup({
            vsID: new FormControl("", Validators.required),//minLength(2)),
            vsName: new FormControl("", Validators.required),//minLength(2)),
        });

        this.editSkillset.setValue({
            vsID: "",
            vsName: "",
        });

        this.searchSkillset = new FormGroup({
            vsSearch: new FormControl("", Validators.required)
        });

        this.searchSkillset.setValue({
            vsSearch: "",
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-verify-skillsets-component',
            [
                'assets/js/superadmin/verify-skillset-alert.js',
                'assets/js/superadmin/delete-skillset-alert.js',
            ]);
    }

    getSkillsetListVerify() {
        this.loading1 = true;
        this.displayTbl = false;
        this._GET_api_Service.GET_data(this.getSkillsetListVerifyAPI).subscribe(data => {
            let filterData = [];
            filterData = data;
            filterData.sort((a, b) => b.total - a.total);    // filter from highest total to lowest
            this.skillsetList = filterData;
            this.setPageSkillset(1);
            if (this.skillsetList.length > 0) {
                this.loading1 = false;
                this.displayTbl = true;
            }
        });
    }

    getSkillsetListVerified() {
        this.loading1 = true;
        this.displayTbl = false;
        this._GET_api_Service.GET_data(this.getSkillsetListVerifiedAPI).subscribe(data => {
            let filterData = [];
            filterData = data;
            filterData.sort((a, b) => b.total - a.total);    // filter from highest total to lowest?
            this.skillsetList = filterData;
            this.setPageSkillset(1);
            if (this.skillsetList.length > 0) {
                this.loading1 = false;
                this.displayTbl = true;
            }
        });
    }

    getSkillsetListAll() {
        this.loading1 = true;
        this.displayTbl = false;
        this._GET_api_Service.GET_data(this.getSkillsetListAllAPI).subscribe(data => {
            let filterData = [];
            filterData = data;
            filterData.sort((a, b) => b.total - a.total);    // filter from highest total to lowest
            this.skillsetList = filterData;
            this.setPageSkillset(1);
            if (this.skillsetList.length > 0) {
                this.loading1 = false;
                this.displayTbl = true;
            }
        });
    }

    userListSkillset: any = [];
    userListInterest: any = [];
    userListSkillset1: any = [];
    userListInterest1: any = [];
    skillsetUserList() {
        this.userListSkillset1 = [];
        this.userListInterest1 = [];
        this.loading2 = true; this.loading3 = true; this.err2 = false; this.err3 = false;
        let data = {
            id: this.selSkill.id
        }
        let verifySkillsetSend = this._POST_api_Service.POST_data(this.postSkillsetUser, data);
        let ret = verifySkillsetSend.subscribe(dataRes => {
            this.userListSkillset = dataRes.users.skillset;
            this.userListInterest = dataRes.users.interest;
            this.imgOptArrListSkillset = this.getImgOpt(this.userListSkillset);
            this.imgOptArrListInterest = this.getImgOpt(this.userListInterest);
            this.userListSkillset1 = this.setImg(this.userListSkillset, this.imgOptArrListSkillset);
            this.userListInterest1 = this.setImg(this.userListInterest, this.imgOptArrListInterest);

            if (this.userListSkillset.length > 0) {
                this.loading2 = false;
                this.err2 = false
            }
            if (this.userListInterest.length > 0) {
                this.loading3 = false;
                this.err3 = false;
            }
            if (this.userListSkillset.length === 0) {
                this.err2 = true;
                this.loading2 = false;
            }
            if (this.userListInterest.length === 0) {
                this.err3 = true;
                this.loading3 = false;
            }
        },
            error => {
                this.loading2 = false; this.loading3 = false;
                this.notifier.notify('error', 'Error -  Fail to retrieve data from server !');
                console.log('[ERROR + Skillset Not Found]', error);
            }
        )
    }

    pagerSkillset: any = {}; pagedItemsSkillset: any[];
    setPageSkillset(page: number) {
        this.pagerSkillset = this.pagerService.getPager(this.skillsetList.length, page, Vars.skillsetMaxPerPage);
        this.pagedItemsSkillset = this.skillsetList.slice(this.pagerSkillset.startIndex, this.pagerSkillset.endIndex + 1);
        window.scrollTo(0, 170);
    }

    selSkill: any = {};
    selectedSkill(skill) {
        this.selSkill = skill;
    }

    onNameKeyUp(event: any) {
        this.name = event.target.value;
    }

    verifySkillsetSubmit() {
        this.displayTbl = false;
        this.displayAlert = false;
        this.loading1 = true;
        let data = {
            id: this.selSkill.id
        }
        let verifySkillsetSend = this._POST_api_Service.POST_data(this.postSkillsetVerify, data);
        let dataVSVerify: any = {};
        let ret = verifySkillsetSend.subscribe(dataRes => {
            dataVSVerify = dataRes;
            if (dataVSVerify.status === "OK") {
                this.notifier.notify('success', 'Successfully Verify Skillset !');
                if (this.value.length > 0 || this.searchSkillset.get('vsSearch').value.length > 0) {
                    this.searchSubmit();
                }
                else if (this.filterValue === 'All') {
                    this.getSkillsetListAll();
                }
                else if (this.filterValue === 'Verified') {
                    this.getSkillsetListVerified();
                }
                else if (this.filterValue === 'Pending Verified' || this.filterValue === 'Filter List by') {
                    this.getSkillsetListVerify();
                }
                else {

                }

            } else {
                this.loading1 = false;
                this.notifier.notify('error', 'Error - Fail to Verify Skillset !');
            }
        },
            error => {
                this.displayTbl = false;
                this.loading1 = false;
                this.notifier.notify('error', 'Error -  Fail to retrieve data from server !');
                console.log('[ERROR + Skillset Not Found]', error);
            }
        )
    }

    addNewSkillsetSubmit() {
        this.displayTbl = false;
        this.displayAlert = false;
        this.loading1 = true;
        let data = {
            name: this.name
        }
        let vsAddSend = this._POST_api_Service.POST_data(this.postSkillsetAdd, data);
        let dataVSAdd: any = {};
        let ret = vsAddSend.subscribe(dataRes => {
            dataVSAdd = dataRes;
            if (dataVSAdd.status === "OK") {
                this.notifier.notify('success', 'Successfully Added New Skillset !');
                if (this.filterValue === 'Pending Verified' || this.filterValue === 'Filter List by') {
                    this.getSkillsetListVerify();
                }
                if (this.value.length > 0 || this.searchSkillset.get('vsSearch').value.length > 0) {
                    this.searchSubmit();
                }
                if (this.filterValue === 'All') {
                    this.getSkillsetListAll();
                }
                if (this.filterValue === 'Verified') {
                    this.getSkillsetListVerified();
                }

            }
            else if (dataVSAdd.status === "Error") {
                this.loading1 = false;
                this.displayTbl = true;
                this.notifier.notify('error', 'Error -  Skillset already exists !');
            }
            else {
                this.loading1 = false;
                this.notifier.notify('error', 'Error -  Fail to add new Skillset !');
            }
            this.addNewSkillset.reset();
        },
            error => {
                this.displayTbl = false;
                this.loading1 = false;
                this.notifier.notify('error', 'Error -  Fail to retrieve data from server !');
                console.log('[ERROR]', error);
            }
        )
    }

    delSkillsetSubmit() {
        this.displayTbl = false;
        this.displayAlert = false;
        this.loading1 = true;
        let data = {
            id: this.selSkill.id
        }
        let delSkillsetSend = this._POST_api_Service.POST_data(this.postSkillsetDel, data);
        let dataVSDel: any = {};
        let ret = delSkillsetSend.subscribe(dataRes => {
            dataVSDel = dataRes;
            if (dataVSDel.status === "OK") {
                this.notifier.notify('success', 'Successfully Delete Skillset !');
                if (this.value.length > 0 || this.searchSkillset.get('vsSearch').value.length > 0) {
                    this.searchSubmit();
                }
                else if (this.filterValue === 'All') {
                    this.getSkillsetListAll();
                }
                else if (this.filterValue === 'Verified') {
                    this.getSkillsetListVerified();
                }
                else if (this.filterValue === 'Pending Verified' || this.filterValue === 'Filter List by') {
                    this.getSkillsetListVerify();
                }
                else {

                }

            } else {
                this.loading1 = false;
                this.notifier.notify('error', 'Error - Fail to Delete Skillset !');
            }
        },
            error => {
                this.displayTbl = false;
                this.loading1 = false;
                console.log('[ERROR + Skillset Not Found]', error);
            }
        )
    }

    editSkillsetSubmit() {
        this.displayTbl = false;
        this.displayAlert = false;
        this.loading1 = false;
        let data = {
            id: this.editSkillset.get('vsID').value === '' ? this.selSkill.id : this.editSkillset.get('vsID').value,
            name: this.editSkillset.get('vsName').value === '' ? this.selSkill.name : this.editSkillset.get('vsName').value,
        }
        let editSkillsetSend = this._POST_api_Service.POST_data(this.postSkillsetEdit, data);
        let dataVSEdit: any = {};
        let ret = editSkillsetSend.subscribe(dataRes => {
            dataVSEdit = dataRes;
            if (dataVSEdit.status === "OK") {
                this.notifier.notify('success', 'Successfully Edit Skillset !');
                if (this.value.length > 0 || this.searchSkillset.get('vsSearch').value.length > 0) {
                    this.searchSubmit();
                }
                else if (this.filterValue === 'All') {
                    this.getSkillsetListAll();
                }
                else if (this.filterValue === 'Verified') {
                    this.getSkillsetListVerified();
                }
                else if (this.filterValue === 'Pending Verified' || this.filterValue === 'Filter List by') {
                    this.getSkillsetListVerify();
                }
                else {

                }

            } else {
                this.loading1 = false;
                this.notifier.notify('error', 'Error - Fail to Edit Skillset !');
            }
        },
            error => {
                this.displayTbl = false;
                this.loading1 = false;
                console.log('[ERROR + Skillset Not Found]', error);
            }
        )
    }

    searchSubmit() {
        this.displayAlert = false;
        this.displayTbl = false;
        this.loading1 = true;
        this.filterValue = 'All';
        let data = {
            name: this.searchSkillset.get('vsSearch').value.length > 0 ? this.searchSkillset.get('vsSearch').value : ''
        }
        if (this.searchSkillset.get('vsSearch').value.length > 0) {
            let searchSend = this._POST_api_Service.POST_data(this.postSkillsetSearch, data);
            let ret = searchSend.subscribe(dataRes => {
                let filterData = [];
                filterData = dataRes;
                filterData.sort((a, b) => b.total - a.total);    // filter from highest total to lowest
                this.skillsetList = filterData;
                if (filterData.length > 0) {
                    this.searchResult = "You have search for " + this.searchSkillset.get('vsSearch').value + ".  ";
                    this.searchResult += filterData.length + " result(s) found. ";
                    this.searchResultStyle = 'primary'; this.searchResultIcon = 'la-info-circle';
                    this.displayAlert = true;
                    this.displayTbl = true;
                    this.loading1 = false;
                    this.setPageSkillset(1);
                } else {
                    this.searchResult = "You have search for " + this.searchSkillset.get('vsSearch').value + ". " + this.errNoResult; this.searchResultStyle = 'warning'; this.searchResultIcon = 'la-warning';
                    this.displayTbl = false;
                    this.displayAlert = true;
                    this.loading1 = false;
                }
            },
                error => {
                    this.displayTbl = false;
                    this.loading1 = false;
                    console.log('[ERROR + Skillset Not Found]', error);
                }
            )
        } else {
            this.getSkillsetListAll();
        }

    }

    resetUserList() {
        this.userListSkillset = [];
        this.userListInterest = [];
    }

    filterValue = 'Filter List by'
    filterBy(value) {
        if (value === 'All') {
            this.filterValue = 'All';
            this.getSkillsetListAll();
            this.displayAlert = false;
        }
        else if (value === 'Verified') {
            this.filterValue = 'Verified';
            this.getSkillsetListVerified();
            this.displayAlert = false;
        }
        else if (value === 'Pending Verify') {
            this.filterValue = 'Pending Verify';
            this.getSkillsetListVerify();
            this.displayAlert = false;
        }
        else if (value === 'Filter List by') {
            this.filterValue = 'Filter List by';
            this.displayAlert = false;
        }
    }

    value = '';
    onEnter(value: string) {
        this.value = value;
        this.searchSubmit();
    }

    getImgOpt(type) {
        let ret = [];
        let url = {};
        let val: string;
        for (let i = 0; i < type.length; i++) {
            val = type[i].image_url;
            url = GlobalVariable.BASE_API_URL + VSVars.APIGetImg + "/" + val + "?api_key=" + GlobalVariable.API_KEY;
            ret.push({ "val": val, "url": url });
        }

        return ret;
    }

    setImg(skillset, interest) {
        let ret = [];
        let arr1 = skillset;
        let arr2 = interest;

        for (let i = 0; i < arr1.length; i++) {
            this._GET_api_Service.GET_data(VSVars.APIGetImg + "/" + arr2[i].val).subscribe(data => {
                console.log('data', data);
            },
                error => {
                    if (error.status === 404) {
                        ret.push({
                            "Name": arr1[i].Name,
                            "Staff_No": arr1[i].Staff_No,
                            "Post_Desc": arr1[i].Post_Desc,
                            "image_url": arr1[i].image_url,
                            "url": "../../../../../../assets/app/media/img/users/ghcm-user-default.jpg",
                        });
                    }
                    else {
                        ret.push({
                            "Name": arr1[i].Name,
                            "Staff_No": arr1[i].Staff_No,
                            "Post_Desc": arr1[i].Post_Desc,
                            "image_url": arr1[i].image_url,
                            "url": arr2[i].url,
                        });
                    }
                });
        }
        console.log('this.userListInterest', this.userListInterest);
        return ret;
    }
}
