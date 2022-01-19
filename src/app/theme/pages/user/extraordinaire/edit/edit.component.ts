import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EditVars } from './edit-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ContactSearchService } from './contact-search.service';
import { ExorSummaryComponent } from '../summary/summary.component';
import { ExorTrackingComponent } from '../tracking/tracking.component';
import { SharingService } from '../extraordinaire-sharing-service';

@Component({
    selector: 'app-u-exor-edit-component',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.css']
})
export class ExorEditComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder, private route: ActivatedRoute,
        private routers: Router, private _script: ScriptLoaderService,
        private _POST_api_Service: POST_Service, private _GET_api_Service: GET_Service,
        private clientSearchService: ContactSearchService,
        private summData: ExorSummaryComponent,
        private trackingData: ExorTrackingComponent,
        private sharingService: SharingService
    ) {

    }

    // links 
    loading = true;

    // -------------- START
    projNameHelp = EditVars.projNameHelp; projNamePlaceHolder = EditVars.projNamePlaceHolder;
    projTimeStPlaceHolder = EditVars.projTimeStPlaceHolder; projTimeEdPlaceHolder = EditVars.projTimeEdPlaceHolder;
    projObjPlaceHolder = EditVars.projObjPlaceHolder; projLeadPlaceHolder = EditVars.projLeadPlaceHolder;
    projApproverPlaceHolder = EditVars.projApproverPlaceHolder; projMsPlaceHelp = EditVars.projMsPlaceHelp;
    projDatePlaceHolder = EditVars.projDatePlaceHolder; projVacPlaceHelp = EditVars.projVacPlaceHelp;
    projRmkPlaceHolder = EditVars.projRmkPlaceHolder;

    APILeadList = EditVars.APILeadList;
    APILeadContact = EditVars.APILeadContact;

    leadList = [];
    contactList = [];

    // :Form
    exOrCreateForm: FormGroup; formChooseName: FormGroup;
    projMsArr: FormArray;
    projVacArr: FormArray;
    projTagArr: FormArray;
    loadingSubmit = false;
    canAddMs = false; canAddVac = false;
    formErr = EditVars.formErr;

    public clients: Observable<any[]>;
    private searchTerms = new Subject<string>();
    public ClientName = '';
    public flag: boolean = true;
    loadingContactOpt = false;
    projNameDup = false;
    lobList = this.summData.summDataMyLobsList;
    targetList = this.summData.summDataTarget;

    // ------------------------- END

    loadResetForm() {
        this.exOrCreateForm = new FormGroup({
            projName: new FormControl('', {
                validators: [Validators.required, Validators.minLength(3), this.validateProjName.bind(this)], updateOn: 'blur'
            }),
            projCtcName: new FormControl('', Validators.required),
            projObj: new FormControl(null, Validators.required),
            projLead: new FormControl(null, Validators.required),
            projApprover: new FormControl(this.summData.summDataMyApproval.StaffNo + " - " + this.summData.summDataMyApproval.Name, Validators.required),
            projSumm: new FormControl("", Validators.required),
            projMsArr: new FormArray([this.initMilestoneFields()]),
            projVacArr: new FormArray([this.initVacFields()]),
            projTagArr: new FormArray([this.initTagFields()]),
            projRmk: new FormControl(null),//(null, Validators.required), 
            projLoc: new FormControl(this.summData.summDataMySumm.location),
            projLob: new FormControl()//(this.summData.summDataMySumm.LOB_Desc), 
        });
        this.summData.summDataMySumm.LOB_Desc = 'TM GLOBAL';
    }

    toEdit = 0;
    ngOnInit() {
        console.log("TRACKING: ", this.trackingData.idx);
        // console.log("TRACKING: ", this.sharingService.currentMessage);

        this.toEdit = this.trackingData.idx;
        this.loading = false;
        let usrLoginName = (JSON.parse(localStorage.getItem('currentUser')).body.name);
        this.loadResetForm();

        // :Form to choose name (Contact and Project Lead)
        this.formChooseName = new FormGroup({
            choosenFor: new FormControl("", Validators.required),
            searchCtcName: new FormControl(""),
            choosenName: new FormControl(null, Validators.required),
        })
        this.checkCanAddMs();

        this.clients = this.searchTerms
            .debounceTime(300)        // wait for 300ms pause in events  
            .distinctUntilChanged()   // ignore if next search term is same as previous  
            .switchMap(term => term   // switch to new observable each time  
                // return the http search observable  
                ? this.clientSearchService.search(term)
                // or the observable of empty heroes if no search term  
                : Observable.of<any[]>([]))
            .catch(error => {
                // TODO: real error handling  
                console.log(error);
                return Observable.of<any[]>([]);
            });
    }

    validateProjName(control: FormControl) {
        this.projNameDup = false;
        if (control.value.length >= 3) {
            let pName = control.value;
            let checkProjNameAPI = EditVars.APIcheckProjName; //'/project/name/check'; //
            let data = { name: pName };
            let retAPI = this._POST_api_Service.POST_data(checkProjNameAPI, data);
            retAPI.subscribe(retData => {
                if (retData.valid == false) {
                    this.projNameDup = true;
                    return { 'duplicateName': true }; //console.log("masuk>>>");                     
                }
            },
                error => {
                    console.log('[ERROR] validateProjName: ' + error); return null;
                });
        }
        return null;
    }
    // :start milestone
    checkCanAddMs() {
        let check = true;
        for (let i = 0; i < this.milestoneArray.length; i++) {
            if (!(this.milestoneArray[i].targetMs)) {
                check = false; break;
            } else if (!((document.getElementById("targetDt_" + i) as HTMLInputElement).value)) {
                check = false; break;
            }
        }
        return check;
    }

    initMilestoneFields(): FormGroup {
        return this.formBuilder.group({
            targetDt: [''], targetMs: ['']
        });
    }

    milestoneArray: Array<any> = [
        {
            'targetDt': '',
            'targetMs': ''
        },
    ];
    newAttribute: any = {};
    isEditItems: boolean;
    addMilestoneValue() { // addMilestoneValue(index) {
        let check = this.checkCanAddMs();
        // if (this.milestoneArray.length <= 2) {
        if (check == true) {
            this.milestoneArray.push(this.newAttribute);
            this.newAttribute = {};
        }
    }
    deleteMilestoneValue(index) {
        this.milestoneArray.splice(index, 1);
    }

    clearLOB() {
        this.exOrCreateForm.patchValue({ projLob: '' });
    }

    // :start vacancy 
    initVacFields(): FormGroup {
        return this.formBuilder.group({
            vacPos: [''], vacTgt: [1],
            vacNum: [''], vacRole: [''],
        });
    }
    checkCanAddVac() {
        let check = true;
        for (let i = 0; i < this.vacArray.length; i++) {
            if (!(this.vacArray[i].vacPos) || !(this.vacArray[i].vacTgt) || !(this.vacArray[i].vacNum) || !(this.vacArray[i].vacRole)) {
                check = false; break;
            }
        }
        return check;
    }
    addVacValue() {// addVacValue(index) {  
        let check = this.checkCanAddVac();
        if (check == true) {
            this.vacArray.push(this.newVacAttribute);
            this.newVacAttribute = {};
        }
    }
    newVacAttribute: any = {};
    vacArray: Array<any> = [{ 'vacPos': '', 'vacTgt': 1, 'vacNum': '', 'vacRole': '' },];
    deleteVacValue(index) {
        this.vacArray.splice(index, 1);
    }

    // :: start tagging 
    initTagFields(): FormGroup {
        return this.formBuilder.group({ tag: [''] });
    }
    checkCanAddTag() {
        let check = true;
        for (let i = 0; i < this.tagArray.length; i++) {
            if (!(this.tagArray[i].tag)) {
                check = false; break;
            }
        }
        return check;
    }
    addTagValue() {// addVacValue(index) {  
        let check = this.checkCanAddTag();
        if (check == true) {
            this.tagArray.push(this.newTagAttribute);
            this.newTagAttribute = {};
        }
    }
    newTagAttribute: any = {};
    tagArray: Array<any> = [{ 'tag': '' },];
    deleteTagValue(index) {
        this.tagArray.splice(index, 1);
    }

    // :open model for search contact and set chosen for value (1-contact; 2-project lead)
    openSearchContact(chooseFor) {
        this.searchNameRes = {};
        this.formChooseName.setValue({ choosenFor: chooseFor, choosenName: "", searchCtcName: "" });
    }
    // :submit chosen name
    formChooseNameSubmit(): void {
        let type = this.formChooseName.get('choosenFor').value;
        let name = this.formChooseName.get('choosenName').value;
        if (type == '1') {
            this.exOrCreateForm.patchValue({ projCtcName: name });
        } else if (type == '2') {
            this.exOrCreateForm.patchValue({ projLead: name });
        }
    }
    // copy contact to leader
    copyContact(type) {
        if (type == '1') this.exOrCreateForm.patchValue({ projCtcName: this.exOrCreateForm.get('projLead').value });
        if (type == '2') this.exOrCreateForm.patchValue({ projLead: this.exOrCreateForm.get('projCtcName').value });
    }

    findInvalidControls() {
        const invalid = [];
        const controls = this.exOrCreateForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        // console.log(invalid);
    }

    searchNameLoading = false;
    searchNameRes: any = {};
    searchName = false;
    searchNameTotal = 0;
    searchByName(newVal) {
        if (newVal.length > 2) {
            this.searchNameLoading = true;
            this._POST_api_Service.POST_data(EditVars.APISearchUser, { text: newVal })
                .subscribe(data => {
                    this.searchNameRes = data; this.searchNameTotal = data.results.length;
                    this.searchNameLoading = false;
                    this.searchName = true;
                },
                error => {
                    console.log('[ERROR - myCallbackContact] ' + error);
                });
        }
    }
    getStatusColor(status) {
        let ret = '';
        switch (status.toLocaleUpperCase()) {
            case 'ACTIVE': ret = 'success'; break;
        }
        return ret;
    }

    get projName() { return this.exOrCreateForm.get('projName'); }
    // :: Save as Draft 
    advPosMsg: string; advPosStyle: string; advPosIcon: string; saving = false; submitting = false;
    bcShowMsg = false;
    exOrCreateFormSave(type): void {
        if (type == 1) this.saving = true;
        if (type == 2) this.submitting = true;
        // this.bcShowMsg = false;
        let postApi: string;
        let milestoneArr = [];
        for (let i = 0; i < this.milestoneArray.length; i++) {
            let arrMsDt = ((document.getElementById("targetDt_" + i) as HTMLInputElement).value).split("-");
            //milestoneArr.push({ "date": ((document.getElementById("targetDt_" + i) as HTMLInputElement).value), "milestone": this.milestoneArray[i].targetMs });
            milestoneArr.push({ "date": new Date(Date.parse(arrMsDt[1] + '-' + arrMsDt[0] + '-' + arrMsDt[2])), "milestone": this.milestoneArray[i].targetMs });
        }
        let vacArr = [];
        for (let j = 0; j < this.vacArray.length; j++) {
            vacArr.push({
                "position": this.vacArray[j].vacPos,
                "target": this.vacArray[j].vacTgt,
                "vacancies": this.vacArray[j].vacNum,
                "description": this.vacArray[j].vacRole
            });
        }
        let tagArr = [];
        for (let j = 0; j < this.tagArray.length; j++) {
            tagArr.push(this.tagArray[j].tag);
        }

        let arrContact = (this.exOrCreateForm.get('projCtcName').value).split(" - ");
        let arrLead = (this.exOrCreateForm.get('projLead').value).split(" - ");
        // console.log((document.getElementById("startDt") as HTMLInputElement).value); // this.dateNow.toISOString(); 
        let arrSt = ((document.getElementById("startDt") as HTMLInputElement).value).split("-");
        let arrEd = ((document.getElementById("endDt") as HTMLInputElement).value).split("-");

        let dataPost = {
            name: this.exOrCreateForm.get('projName').value,
            contact: arrContact[0].trim(),
            project_start: new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2])),
            project_close: new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2])),
            objective: this.exOrCreateForm.get('projObj').value,
            leader: arrLead[0].trim(),
            approval: this.summData.summDataMyApproval.StaffNo,  // From API
            summary: this.exOrCreateForm.get('projSumm').value,
            milestone: milestoneArr, position: vacArr, tagging: tagArr,
            lob: this.exOrCreateForm.get('projLob').value,
            location: this.exOrCreateForm.get('projLoc').value,
            remark: this.exOrCreateForm.get('projRmk').value,
            image: "6S9dhDwejlY1vN16",// TODO
            type: type,// 1-draft, 2-submit
        }
        //console.log(dataPost);
        let dataAdvPos: any = {}; let strType1 = ""; let strType2 = "";
        this._POST_api_Service.POST_data(EditVars.APISaveSubmit, dataPost).subscribe(dataQuaRes => {
            this.bcShowMsg = true;
            if (dataQuaRes.status == "OK") {
                if (type == 1) { strType1 = "Saved"; strType2 = "Save"; }
                if (type == 2) { strType1 = "Submitted"; strType2 = "Submit"; }
                this.advPosMsg = 'Successfully ' + strType1 + ' Advertisement';
                this.advPosStyle = ' alert-success '; this.advPosIcon = ' flaticon-paper-plane ';
                //this.bcShowMsg = true;
                //:start reset form
                this.vacArray = [{ 'vacPos': '', 'vacTgt': 1, 'vacNum': '', 'vacRole': '' }];
                this.milestoneArray = [{ 'targetDt': '', 'targetMs': '' }];
                this.tagArray = [{ 'tag': '' }];
                this.loadResetForm();
                //:end reset form
                this.loadingSubmit = false;
                setTimeout(function() {
                    //this.bcShowMsg = false;
                    this.summData.getSummData();
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.advPosStyle = ' alert-danger  '; this.advPosIcon = ' flaticon-circle ';
                //this.bcShowMsg = true;
                if (dataQuaRes.msg == 'Key already exists') {
                    this.advPosMsg = 'Fail to ' + strType2 + ' Advertisement. Advertisement Name already exists.';
                } else {
                    this.advPosMsg = 'Fail to ' + strType2 + ' Advertisement';
                }
            }
            this.saving = false; this.submitting = false;
        },
            error => {
                console.log('[ERROR] Save Extraordinaire Project: ' + error);
                //this.bcShowMsg = true;
                this.advPosMsg = 'Fail to Broadcast Message.'
                this.advPosStyle = " alert-danger "; this.loadingSubmit = false;
            })
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-u-exor-new-component',
            [
                'assets/js/user/extraordinaire/create-project.js',
                // 'assets/js/user/extraordinaire/vendors.bundle.js',
            ]);
    }

}
