import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm, FormsModule, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { NewVars } from './new-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ContactSearchService } from './contact-search.service';
import { ExorSummaryComponent } from '../summary/summary.component';
import { SharingService } from '../extraordinaire-sharing-service';
import { DetailsVars } from '../details/details-vars';
import { DatePipe } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { e } from '@angular/core/src/render3';

@Component({
    selector: 'app-u-exor-new-component',
    templateUrl: './new.component.html',
    styleUrls: ['./new.css', './jquery.fancybox.min.css'],
})
export class ExorNewComponent implements OnInit {
    // message: string;
    item: any[];
    myName: any;
    toEditId = "0";

    keyTinyMCE = NewVars.keyTinyMCE;
    plugs = {
        menubar: false,
        branding: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor textcolor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | bullist numlist outdent indent |',

    }

    modules = {
        // formula: true,
        // imageResize: {},
        // syntax: true,
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            ['italic', 'underline'], //['bold', 'strike'],   // toggled buttons
            // ['blockquote', 'code-block'],          
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'align': [] }],

            // ['clean']       
        ],
        //   placeholder: 'Compose an epic...',
        //   theme: 'snow'
    }


    private readonly notifier: NotifierService;
    constructor(
        public datepipe: DatePipe,
        private formBuilder: FormBuilder, private route: ActivatedRoute,
        private routers: Router, private _script: ScriptLoaderService,
        private _POST_api_Service: POST_Service, private _GET_api_Service: GET_Service,
        private clientSearchService: ContactSearchService,
        private summData: ExorSummaryComponent,
        private sharingService: SharingService,
        notifierService: NotifierService
    ) {
        // this.sharingService.currentMessage.subscribe(message => this.message = message);
        // console.log("NEW MSG ", this.message);

        this.notifier = notifierService;

        this.sharingService.dataString$.subscribe(
            data => {
                // console.log(data);
                this.toEditId = data; this.loadMyData(this.toEditId);
            });
        /*this.sharingService.getData().subscribe((value) => {
            // this.navIcons = value;
            console.log(value)
        });

        sharingService.getData().then(userFName => {
            console.log('userFName =', userFName);
       });*/

    }

    loadingEdit = false; dataEdit: any; noDataEdit = false; errLoadingEdit = false;
    loadMyData(idx) {
        this.loadingEdit = false; this.dataEdit = {}; this.noDataEdit = false; this.errLoadingEdit = false;
        this.milestoneArray = [{ 'targetDt': '', 'targetMs': '' },];
        this.vacArray = [{ 'vacPos': '', 'vacTgt': '', 'vacNum': '', 'vacRole': '' },];
        this.tagArray = [{ 'tag': '' },];

        if (idx != "0") {
            this.loadingEdit = true;
            this._POST_api_Service.POST_data(DetailsVars.APIGetDetails, { id: idx }).subscribe(data => {
                // console.log(data);
                if (data) {
                    this.dataEdit = data;
                    console.log(this.dataEdit)
                } else {
                    this.noDataEdit = true;
                }
                this.loadingEdit = false;
                // console.log(this.dataEdit);
                this.loadResetForm();
            },
                error => {
                    console.log('[ERROR] Fetching Extraordinaire Details Data From Edit: ' + error);
                    this.loadingEdit = false; this.errLoadingEdit = true;
                });
        }
    }

    // myCurrId = { editIdx: 0 };
    // links
    loading = true;

    // -------------- START
    projNameHelp = NewVars.projNameHelp; projNamePlaceHolder = NewVars.projNamePlaceHolder;
    projTimeStPlaceHolder = NewVars.projTimeStPlaceHolder; projTimeEdPlaceHolder = NewVars.projTimeEdPlaceHolder;
    projObjPlaceHolder = NewVars.projObjPlaceHolder; projSummaryPlaceHolder = NewVars.projSummaryPlaceHolder;
    projLeadPlaceHolder = NewVars.projLeadPlaceHolder;
    projApproverPlaceHolder = NewVars.projApproverPlaceHolder; projMsPlaceHelp = NewVars.projMsPlaceHelp;
    projDatePlaceHolder = NewVars.projDatePlaceHolder; projVacPlaceHelp = NewVars.projVacPlaceHelp;
    projVacFindFriend = NewVars.projVacFindFriend; projRmkPlaceHolder = NewVars.projRmkPlaceHolder;
    projSkillset = NewVars.projSkillset; projRmkHelp = NewVars.projRmkHelp;

    APILeadList = NewVars.APILeadList;
    APILeadContact = NewVars.APILeadContact;

    leadList = [];
    contactList = [];

    // :Form
    exOrCreateForm: FormGroup; formChooseName: FormGroup;
    projMsArr: FormArray;
    projVacArr: FormArray;
    projTagArr: FormArray;
    loadingSubmit = false;
    canAddMs = false; canAddVac = false;
    formErr = NewVars.formErr;
    contactPersonErr = NewVars.contactPersonErr;
    proLocationErr = NewVars.proLocationErr;
    projNameErr = NewVars.projNameErr;
    projLeaderErr = NewVars.projLeaderErr;
    projObjErr = NewVars.projObjErr;
    projSummErr = NewVars.projSummErr;
    keyMileErr = NewVars.keyMileErr;
    VacErr = NewVars.VacErr;
    SkillErr = NewVars.SkillErr;

    skillSearch = NewVars.skillSearch;

    public clients: Observable<any[]>;
    private searchTerms = new Subject<string>();
    public ClientName = '';
    public flag: boolean = true;
    loadingContactOpt = false;
    projNameDup = false;
    lobList = this.summData.summDataMyLobsList;
    targetList = this.summData.summDataTarget;
    imgOptArr = this.summData.summDataMyImg;
    imgOptArrList: any;
    showIconOptions = false; showIconText = "View ";
    // ------------------------- END

    // copyFrmCtc = false; copyFrmLeader = false;

    toggleIconOptions(stt) {
        console.log(this.showIconOptions);
        if (stt == true) {
            this.showIconOptions = false; this.showIconText = "View ";
        } else { this.showIconOptions = true; this.showIconText = "Hide "; }
    }

    changeIcon(url, val) {
        this.exOrCreateForm.patchValue({ projIconValue: val });
        this.IconVal = val;
        this.iconUrl = url;
    }

    getImgOpt() {
        let ret = [];
        let url: string;
        let val: string;
        for (let i = 0; i < this.imgOptArr.length; i++) {
            val = this.imgOptArr[i].image_url;
            url = GlobalVariable.BASE_API_URL + NewVars.APIGetImg + "/" + val + "?api_key=" + GlobalVariable.API_KEY;
            ret.push({ "value": val, "url": url });
        }

        return ret;
    }
    loadResetForm() {
        this.bcShowMsg = false;
        this.bcShowSubmitting = false;
        this.bcShowSaving = false;
        // this.copyFrmCtc = false; this.copyFrmLeader = false;
        //console.log(this.dataEdit);
        if (!this.dataEdit.details) {
            this.iconUrl = this.imgOptArrList[0].url;
            this.IconVal = this.imgOptArrList[0].value;
        } else {
            let val = this.dataEdit.details[0].image_url;
            this.iconUrl = GlobalVariable.BASE_API_URL + NewVars.APIGetImg + "/" + val + "?api_key=" + GlobalVariable.API_KEY;
            this.IconVal = val;
        }
        // if (this.dataEdit.details && this.dataEdit.details[0].contact.trim().length > 0) this.copyFrmCtc = true;
        // if (this.dataEdit.details && this.dataEdit.details[0].leader.trim().length > 0) this.copyFrmLeader = true;
        // this.exOrCreateForm.patchValue( { tmlnStart : this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy') });

        if (this.summData.summDataMyApproval) {
            this.exOrCreateForm = new FormGroup({
                projName: new FormControl((!this.dataEdit.details) ? '' : this.dataEdit.details[0].name, {
                    validators: [Validators.required, Validators.minLength(3), this.validateProjName.bind(this)], updateOn: 'blur'
                }),
                projCtcName: new FormControl((!this.dataEdit.details) ? '' : this.dataEdit.details[0].contact + " - " + this.dataEdit.details[0].contact_name, Validators.required),
                projObj: new FormControl((!this.dataEdit.details) ? '' : this.dataEdit.details[0].objective, Validators.required),
                projLead: new FormControl((!this.dataEdit.details) ? '' : this.dataEdit.details[0].leader + " - " + this.dataEdit.details[0].leader_name, Validators.required),
                projApprover: new FormControl((this.summData.summDataMyApproval) ? this.summData.summDataMyApproval.StaffNo + " - " + this.summData.summDataMyApproval.Name : 'No data', Validators.required),
                projSumm: new FormControl((!this.dataEdit.details) ? '' : this.dataEdit.details[0].summary, Validators.required),
                projRmk: new FormControl((!this.dataEdit.details) ? '' : this.dataEdit.details[0].remark),//(null, Validators.required),
                projLoc: new FormControl((!this.dataEdit.details) ? this.summData.summDataMySumm.location : this.dataEdit.details[0].location),
                projLob: new FormControl((!this.dataEdit.details) ? this.summData.summDataMySumm.LOB_Desc : this.dataEdit.details[0].lob),

                projMsArr: new FormArray([this.initMilestoneFields()]),
                projVacArr: new FormArray([this.initVacFields()]),
                projTagArr: new FormArray([this.initTagFields()]),

                projSkill: new FormControl(''),

                //centurion scanning
                //tmlnStart: new FormControl((!this.dataEdit.details) ? this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy') : this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy')),
                //tmlnEnd: new FormControl((!this.dataEdit.details) ? this.datepipe.transform(new Date(new Date().getFullYear(), 11, 31).toISOString(), 'dd-MM-yyyy') : this.datepipe.transform(new Date(new Date().getFullYear(), 11, 31).toISOString(), 'dd-MM-yyyy')),

                projIconValue: new FormControl(this.imgOptArrList[0].value)
            });

            if (this.dataEdit.details) {
                if (this.newData.length < 1 && this.newData2.length < 1) {
                    this.newData.push(this.exOrCreateForm.get('projLead').value);
                    this.newData2.push(this.exOrCreateForm.get('projCtcName').value);
                }

                this.selectedPLeader(this.exOrCreateForm.get('projLead').value);
                this.selectedCName(this.exOrCreateForm.get('projCtcName').value);
            }

            this.skillsets = [];
            if (this.dataEdit.tag) {
                for (let i = 0; i < this.dataEdit.tag.length; i++) {
                    this.skillsets.push(this.dataEdit.tag[i].tag);
                }
            }
        } else {
            alert('PLEASE CONTACT ADMINISTRATOR !\n APPOROVER DATA NOT FOUND !');
        }


        // this.summData.summDataMySumm.LOB_Desc = 'TM GLOBAL'; // TODO
    }
    closeEdit(el) {
        console.log('el', el);
        this.sharingService.saveData("0");
        this.bcShowSubmitting = false;
        this.bcShowSaving = false;
        this.dataEdit = {}; this.loadResetForm();
        this.milestoneArray = [{ 'targetDt': '', 'targetMs': '' },];
        this.vacArray = [{ 'vacPos': '', 'vacTgt': '', 'vacNum': '', 'vacRole': '' },];
        this.tagArray = [{ 'tag': '' },];
        this.skillsets = [];
        this.newData = [];
        this.newData2 = [];
        el.scrollIntoView();
        // window.scrollTo(0, 0);
    }

    closeEdit1() {
        this.sharingService.saveData("0");
        this.bcShowSubmitting = false;
        this.bcShowSaving = false;
        this.dataEdit = {}; this.loadResetForm();
        this.milestoneArray = [{ 'targetDt': '', 'targetMs': '' },];
        this.vacArray = [{ 'vacPos': '', 'vacTgt': '', 'vacNum': '', 'vacRole': '' },];
        this.tagArray = [{ 'tag': '' },];
        this.skillsets = [];
        this.newData = [];
        this.newData2 = [];
    }

    iconUrl: any; IconVal: any;
    ngOnInit() {

        this.loading = false;
        let usrLoginName = (JSON.parse(localStorage.getItem('currentUser')).body.name);
        this.imgOptArrList = this.getImgOpt();
        this.loadResetForm();

        let currentUser = (JSON.parse(localStorage.getItem('currentUser')));
        console.log(currentUser)
        
        

        this.exOrCreateForm.patchValue( {projCtcName : currentUser.userid + " - " + currentUser.body.name})
        $("#ctcName").val(currentUser.userid + " - " + currentUser.body.name);
        this.exOrCreateForm.patchValue( {projLead : currentUser.userid + " - " + currentUser.body.name})
        $("#prjLead").val(currentUser.userid + " - " + currentUser.body.name);

        this.selectedPLeader(currentUser.userid + " - " + currentUser.body.name);
        this.selectedCName(currentUser.userid + " - " + currentUser.body.name);

        // :Form to choose name (Contact and Project Lead)
        this.formChooseName = new FormGroup({
            choosenFor: new FormControl("", Validators.required),
            searchCtcName: new FormControl(""),
            choosenName: new FormControl(null, Validators.required),
        })
        // this.checkCanAddMs(); 
        // this.checkCanAddMsDate();

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

    checkValue(e) {

        var target = e.target;
        var div_id = e.target.nextElementSibling.id;

        if (target.value.length) {
            $("#" + div_id).removeClass('m--hide');
            document.getElementById(div_id).style.visibility = 'visible';
        }
    }

    clearInput(e) {
        var div_id = e.target.parentElement.id;
        (<HTMLInputElement>document.getElementById(div_id).previousElementSibling).value = null;
        document.getElementById(div_id).style.visibility = 'hidden';
    }

    validateProjName(control: FormControl) {
        this.projNameDup = false;
        let letsCheck = true;
        if (this.dataEdit && this.dataEdit.details) {
            if (this.dataEdit.details[0].name == control.value) letsCheck = false;
        }
        if ((control.value && control.value.length >= 3) && (letsCheck)) {
            let pName = control.value;
            let checkProjNameAPI = NewVars.APIcheckProjName; //'/project/name/check'; //
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
        // console.log(check)
        return check;
    }
    checkCanAddMsDate() {
        let check = true;
        let arrSt = [];
        if (((document.getElementById("startDt") as HTMLInputElement))) {
            arrSt = ((document.getElementById("startDt") as HTMLInputElement).value).split("-");
        }
        let arrEd = [];
        if (((document.getElementById("endDt") as HTMLInputElement))) {
            arrEd = ((document.getElementById("endDt") as HTMLInputElement).value).split("-");
        }
        let sDt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]))
        let eDt = new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2]));
        let arrTd = []; let tDt = new Date();
        // console.log(((document.getElementById("startDt") as HTMLInputElement).value));
        if ((arrSt) && (arrEd) && (this.milestoneArray.length > 0)) {
            // console.log("Start Date", arrSt);
            // console.log("End Date", arrEd);
            for (let i = 0; i < this.milestoneArray.length; i++) {
                if (((document.getElementById("targetDt_" + i) as HTMLInputElement))) {
                    //console.log("MS Date", ((document.getElementById("targetDt_" + i) as HTMLInputElement).value));
                    arrTd = ((document.getElementById("targetDt_" + i) as HTMLInputElement).value).split("-");
                    tDt = new Date(Date.parse(arrTd[1] + '-' + arrTd[0] + '-' + arrTd[2]));
                    // console.log("Target Date", arrTd);

                    // console.log("compare end", (tDt>eDt));
                    // console.log("compare start", (tDt<sDt));
                    if ((tDt > eDt) || (tDt < sDt)) {
                        check = false; break;
                    }
                }
            }
        }

        // kalau betul retun false
        // console.log(check)
        return check;
    }

    checkArrMs() {
        if (this.milestoneArray.length > 0) {
            for (let i = 0; i < this.milestoneArray.length; i++) {
                if (this.milestoneArray[i].targetMs) {
                    console.log('ok')
                } else if (this.milestoneArray.length > 1) {
                    this.milestoneArray.pop();
                }
            }
        }
        // console.log('this.milestoneArray', this.milestoneArray);
    }

    initMilestoneFields(): FormGroup {
        if (this.dataEdit && this.dataEdit.milestone && this.dataEdit.milestone.length > 0) {
            this.milestoneArray.splice(0, 1);
            for (let i = 0; i < this.dataEdit.milestone.length; i++) {
                this.milestoneArray.push({
                    'targetDt': this.datepipe.transform(this.dataEdit.milestone[i].date, 'dd-MM-yyyy'),
                    'targetMs': this.dataEdit.milestone[i].milestone
                });
            }
            return this.formBuilder.group(this.milestoneArray);
        } else {
            return this.formBuilder.group({
                targetDt: [''], targetMs: ['']
            });
        }
    }

    milestoneArray: Array<any> = [
        {
            'targetDt': this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy'),
            'targetMs': 'Advertisement Submitted'
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
        if (this.dataEdit && this.dataEdit.position && this.dataEdit.position.length > 0) {
            this.vacArray.splice(0, 1);
            // console.log('this.vacArray', this.vacArray);
            for (let i = 0; i < this.dataEdit.position.length; i++) {
                this.vacArray.push({ 'vacPos': this.dataEdit.position[i].position, 'vacTgt': this.dataEdit.position[i].target, 'vacNum': this.dataEdit.position[i].vacancies, 'vacRole': this.dataEdit.position[i].description });
            }
            return this.formBuilder.group(this.vacArray);
        } else {
            return this.formBuilder.group({
                vacPos: [''], vacTgt: [''],
                vacNum: [''], vacRole: [''],
            });
        }

    }
    checkCanAddVac() {
        let check = true;
        for (let i = 0; i < this.vacArray.length; i++) {
            if (!(this.vacArray[i].vacPos) || !(this.vacArray[i].vacTgt) || !(this.vacArray[i].vacNum) || !(this.vacArray[i].vacRole)) {
                check = false;
                $('#vacStatus_' + i).val(0);
                break;
            }
            else {
                $('#vacStatus_' + i).val(1);
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
    vacArray: Array<any> = [{ 'vacPos': '', 'vacTgt': '', 'vacNum': '', 'vacRole': '' },];
    deleteVacValue(index) {
        this.vacArray.splice(index, 1);
    }

    // :: start tagging
    initTagFields(): FormGroup {
        if (this.dataEdit && this.dataEdit.tag && this.dataEdit.tag.length > 0) {
            this.tagArray.splice(0, 1);
            for (let i = 0; i < this.dataEdit.tag.length;) {
                return this.formBuilder.group({ tag: this.dataEdit.tag[i].tag });
            }
            return this.formBuilder.group(this.tagArray);
        } else {
            return this.formBuilder.group({ tag: [''] });
        }
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
    addTagValue() {
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
        if (type == '1') this.exOrCreateForm.patchValue({ projCtcName: this.selPLeader });
        if (type == '2') this.exOrCreateForm.patchValue({ projLead: this.selCName });
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
            this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: newVal })
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

    // get projName() { return this.exOrCreateForm.get('projName'); }
    // :: Save as Draft
    advPosMsg: string; advPosStyle: string; advPosIcon: string; saving = false; submitting = false;
    bcShowMsg = false; bcShowSubmitting = false; bcShowSaving = false;
    exOrCreateFormSave(type): void {
        console.log(type)
        // let ret = '';
        // let ret1='Project Contact Name is invalid. Please choose from the list only. ';
        // let ret2='Project Lead Name is invalid. Please choose from the list only.';
        // let arrContact = ctc.split(" - "); //(this.exOrCreateForm.get('projCtcName').value).split(" - ");
        // let arrLead = (this.exOrCreateForm.get('projLead').value).split(" - ");

        // let checkMe1=this.checkMe(this.exOrCreateForm.get('projCtcName').value, 1);
        // let checkMe2=this.checkMe(this.exOrCreateForm.get('projLead').value, 2);

        // this.checkMe().subscribe();
        // let ret1=this.checkMe1();
        if (type === 1) { this.bcShowSaving = true; }
        else if (type === 2) { this.bcShowSubmitting = true; }
        this.bcShowMsg = false;
        let ret = '';
        let ret1 = 'Adv Contact Name is invalid. Please choose from the list only. ';
        let ret2 = 'Adv Lead Name is invalid. Please choose from the list only.';
        let arrContact = (this.selCName).split(" - ");
        let arrLead = (this.selPLeader).split(" - ");

        // console.log(arrContact[1]);
        this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: arrContact[0] }).subscribe(dataRes => {
            if (dataRes.results.length > 0) { ret1 = ''; }
            console.log("dataRes", dataRes);
            this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: arrLead[0] }).subscribe(dataRes => {
                if (dataRes.results.length > 0) { ret2 = ''; }
                ret = ret1 + ret2;
                if (ret != "") {
                    this.bcShowMsg = true;
                    this.advPosStyle = ' alert-danger  '; this.advPosIcon = ' flaticon-circle ';
                    this.advPosMsg = ret;
                    this.bcShowSubmitting = false;
                    this.bcShowSaving = false;
                } else {
                    this.executeExOrCreateFormSave(type);
                }
            });

        });

    }

    executeExOrCreateFormSave(type) {
        this.compareTwoDates();
        if (!this.advDateError.isError) {
            // KENAPA BUAT NI????type = 1;
            if (type == 1) this.saving = true;
            if (type == 2) this.submitting = true;
            // this.bcShowMsg = false;
            let postApi: string;
            let milestoneArr = [];
            // for (let i = 0; i < this.milestoneArray.length; i++) {
            //     let arrMsDt = ((document.getElementById("targetDt_" + i) as HTMLInputElement).value).split("-");
            //     milestoneArr.push({ "date": ((document.getElementById("targetDt_" + i) as HTMLInputElement).value), "milestone": this.milestoneArray[i].targetMs });
            // }
            milestoneArr.push({ "date": new Date().toISOString(), "milestone": 'Submitted Date' });


            let vacArr = [];
            for (let j = 0; j < this.vacArray.length; j++) {
                vacArr.push({
                    "position": this.vacArray[j].vacPos,
                    "target": this.vacArray[j].vacTgt,
                    "vacancies": this.vacArray[j].vacNum,
                    "description": this.vacArray[j].vacRole
                });
            }

            let arrContact = (this.selCName).split(" - ");
            let arrLead = (this.selPLeader).split(" - ");
            // console.log((document.getElementById("startDt") as HTMLInputElement).value); // this.dateNow.toISOString();
            let arrSt = ((document.getElementById("startDt") as HTMLInputElement).value).split("-");
            let arrEd = ((document.getElementById("endDt") as HTMLInputElement).value).split("-");

            let myApprover: string;
            if (!this.summData.summDataMyApproval.StaffNo) {
                myApprover = "-";
            } else {
                myApprover = this.summData.summDataMyApproval.StaffNo;
            }

            let posAPI = ""; let dataPost: any;
            if (this.toEditId == '0') {
                dataPost = {
                    name: this.exOrCreateForm.get('projName').value,
                    contact: arrContact[0].trim(),
                    project_start: moment($("#startDt").val().toString(), 'DD-MM-YYYY').format(),
                    project_close: moment($("#endDt").val().toString(), 'DD-MM-YYYY').format(),
                    objective: this.exOrCreateForm.get('projObj').value,
                    leader: arrLead[0].trim(),
                    approval: myApprover, //this.summData.summDataMyApproval.StaffNo,  // From API
                    summary: this.exOrCreateForm.get('projSumm').value,
                    milestone: milestoneArr, position: vacArr, tagging: this.skillsets,
                    lob: this.exOrCreateForm.get('projLob').value,
                    location: this.exOrCreateForm.get('projLoc').value,
                    remark: this.exOrCreateForm.get('projRmk').value,
                    image: this.exOrCreateForm.get('projIconValue').value,// TODO
                    type: type,// 1-draft, 2-submit
                }
                posAPI = NewVars.APISaveSubmit;
            } else {
                dataPost = {
                    id: this.toEditId,
                    name: this.exOrCreateForm.get('projName').value,
                    contact: arrContact[0].trim(),
                    project_start: moment($("#startDt").val().toString(), 'DD-MM-YYYY').format(),
                    project_close: moment($("#endDt").val().toString(), 'DD-MM-YYYY').format(),
                    objective: this.exOrCreateForm.get('projObj').value,
                    leader: arrLead[0].trim(),
                    approval: myApprover, //this.summData.summDataMyApproval.StaffNo,  // From API
                    summary: this.exOrCreateForm.get('projSumm').value,
                    milestone: milestoneArr, position: vacArr, tagging: this.skillsets,
                    lob: (this.exOrCreateForm.get('projLob').value) ? this.exOrCreateForm.get('projLob').value : this.dataEdit.details[0].lob, //this.exOrCreateForm.get('projLob').value,
                    location: this.exOrCreateForm.get('projLoc').value,
                    remark: this.exOrCreateForm.get('projRmk').value,
                    image: this.IconVal, //"6S9dhDwejlY1vN16",// TODO projIconValue
                    type: type,// 1-draft, 2-submit
                }
                posAPI = NewVars.APIEditSubmit;
            }

            console.log(posAPI); console.log(dataPost);
            let dataAdvPos: any = {}; let strType1 = ""; let strType2 = "";
            if (type === 1) { this.bcShowSaving = true; }
            else if (type === 2) { this.bcShowSubmitting = true; }

            console.log(dataPost)
            this._POST_api_Service.POST_data(posAPI, dataPost).subscribe(dataQuaRes => {
                // this.bcShowMsg = true;

                if (dataQuaRes.status == "OK") {
                    if (type == 1) { strType1 = "Saved"; strType2 = "Save"; }
                    if (type == 2) { strType1 = "Submitted"; strType2 = "Submit"; }
                    this.advPosMsg = 'Successfully ' + strType1 + ' Advertisement';
                    this.advPosStyle = ' alert-success '; this.advPosIcon = ' flaticon-paper-plane ';
                    //this.bcShowMsg = true;
                    //:start reset form
                    this.vacArray = [{ 'vacPos': '', 'vacTgt': '', 'vacNum': '', 'vacRole': '' }];
                    this.milestoneArray = [{ 'targetDt': '', 'targetMs': '' }];
                    this.tagArray = [{ 'tag': '' }];
                    this.loadResetForm();
                    //:end reset form
                    this.loadingSubmit = false;
                    this.notifier.notify('success', this.advPosMsg);
                    setTimeout(function() {
                        this.bcShowMsg = false;
                        if (type == 2) { this.summData.getSummData('all'); this.loadMyData("0"); this.closeEdit1(); console.log('hai'); }
                        if (this.toEditId != '0') { this.loadMyData(this.toEditId); console.log('hello'); }
                        if ((type == 1) && (this.toEditId == '0')) { this.summData.getSummData('all'); console.log('halu'); }
                    }.bind(this), 3000);

                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                    //wait 3 Seconds and hide
                } else {
                    this.advPosStyle = ' alert-danger  '; this.advPosIcon = ' flaticon-circle ';
                    //this.bcShowMsg = true;
                    if (dataQuaRes.msg == 'Key already exists') {
                        this.advPosMsg = 'Fail to ' + strType2 + ' Advertisement. Advertisement Name already exists.';
                    } else {
                        this.advPosMsg = 'Fail to ' + strType2 + ' Advertisement.';
                    }
                    this.notifier.notify('error', this.advPosMsg);
                }
                this.bcShowMsg = true; this.bcShowSubmitting = false; this.bcShowSaving = false;
                this.saving = false; this.submitting = false;
                // setTimeout(function() {
                //     location.reload();
                // }, 3000);
            },
            error => {
                console.log('[ERROR] Save Extraordinaire Project: ' + error);
                //this.bcShowMsg = true;
                this.advPosMsg = 'Fail to ' + strType2 + ' Advertisement.'
                this.advPosStyle = " alert-danger "; this.loadingSubmit = false;
                this.saving = false; this.submitting = false; this.advPosIcon = ' flaticon-circle ';
                this.notifier.notify('error', this.advPosMsg);
            })

        }

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-u-exor-new-component',
            [
                'assets/js/user/extraordinaire/create-project.js',
                'assets/js/user/extraordinaire/jquery.fancybox.min.js',
                'assets/js/user/extraordinaire/image-checkbox.js',
                'assets/js/user/extraordinaire/jquery.imgcheckbox.js',
                // 'assets/js/user/extraordinaire/vendors.bundle.js',
            ]);
    }

    compareTwoDates() { //this.advPosForm.get('advPosIdx2').value;
        this.advDateError.isError = false; this.advDateError.errorMessage = "";
        let arrSt = ((document.getElementById("startDt") as HTMLInputElement).value).split("-");
        let arrEd = ((document.getElementById("endDt") as HTMLInputElement).value).split("-");
        let mySt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]));
        let myEd = new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2]));
        this.advDateError = this.dateComparison(mySt, myEd, true);
    }

    advDateError: any = { isError: false, errorMessage: '' };
    dateComparison(mySt, myEd, chckStartDt) {
        // console.log("start date", mySt); console.log("end date", myEd);
        let isErr = false; let errMsg = '';
        var ONE_DAY = 1000 * 60 * 60 * 24;
        let days = Math.round((Math.abs(myEd.getTime() - mySt.getTime()) / ONE_DAY));
        // console.log((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) ;
        if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            isErr = true; errMsg += 'Invalid adv timeline period. End date should not be less than start date. ';
        }

        if (chckStartDt) {
            let today = new Date();
            if ((myEd.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
                isErr = true; errMsg += 'Adv date has expired. ';
            }
        }
        // if (days > 14) {
        //     isErr = true; errMsg += 'Project date should not be more than 14 days. ';
        // }

        if (isErr == false) {
            $("#msgTimeline").removeClass("errMsg");
        }

        let retErr = { isError: isErr, errorMessage: errMsg };
        return retErr;
    }

    onSkillKeyDown(event: any) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.searchSkill(event.target.value);
            } else if (event.target.value.length < 1) {
                this.resSkill = [];
            }
        }, 500);
    }

    resSkill = [];
    searchSkill(text) {
        this.resSkill = [];
        this._POST_api_Service.POST_data(this.skillSearch, { skillset: text }).subscribe(dataRes => {
            this.resSkill = dataRes.body;
        })
    }

    timer = null;
    onNameKeyDownPL(event: any) {
        this.loadCtc = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.searchUser(event.target.value, 1);
            }
        }, 500);
    }

    loadCtc = false; loadCtc2 = false;
    onNameKeyDownCtc(event: any) {
        this.loadCtc2 = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.searchUser(event.target.value, 2)
            }
        }, 500);
    }

    newData: any = [];
    newData2: any = [];
    searchUser(name, type) {
        let results = [];
        this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: name }).subscribe(dataRes => {
            if (dataRes.results) {

                if (type === 1) this.newData = [];
                else if (type === 2) this.newData2 = [];

                if (dataRes.results.length < 1) {
                    console.log("0");
                } else if (dataRes.results.length > 10) {
                    results = dataRes.results.slice(0, 10);
                } else { results = dataRes.results; }

                for (let i = 0; i < results.length; i++) {
                    if (type === 1) {
                        this.newData.push(results[i].search);
                    }
                    if (type === 2) {
                        this.newData2.push(results[i].search);
                    }
                }
            }
            this.loadCtc = false; this.loadCtc2 = false;
        },
            error => { console.log('[ERROR: Extraordinaire Project Lead Search User]', error); })
    }

    errLeadCtc: string;
    checkMe() {
        let ret = '';
        let ret1 = 'Adv Contact Name is invalid. Please choose from the list only. ';
        let ret2 = 'Adv Lead Name is invalid. Please choose from the list only.';
        let arrContact = (this.selCName).split(" - ");
        let arrLead = (this.selPLeader).split(" - ");

        // console.log(arrContact[1]);
        this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: arrContact[1] }).subscribe(dataRes => {
            // console.log("arrContact "+dataRes.results);
            if (dataRes.results) {
                for (let i = 0; i < dataRes.results.length; i++) {
                    // console.log(dataRes.results[i].search);
                    // console.log((this.exOrCreateForm.get('projCtcName').value));
                    if (dataRes.results[i].search === this.exOrCreateForm.get('projCtcName').value) { ret1 = ''; break; }
                }
            }

            this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: arrLead[1] }).subscribe(dataRes => {
                if (dataRes.results) {
                    for (let i = 0; i < dataRes.results.length; i++) {
                        if (dataRes.results[i].search === this.selPLeader) { ret2 = ''; break; }
                    }
                }
                ret = ret1 + ret2;
                this.errLeadCtc = ret;
                console.log(this.errLeadCtc);
            });

        });

    }

    checkMe1() {
        let ret = '';
        let ret1 = 'Adv Contact Name is invalid. Please choose from the list only. ';
        // let ret2='Project Lead Name is invalid. Please choose from the list only.';
        let arrContact = (this.selCName).split(" - ");
        // let arrLead = (this.exOrCreateForm.get('projLead').value).split(" - ");

        this._POST_api_Service.POST_data(NewVars.APISearchUser, { text: arrContact[1] }).subscribe(dataRes => {
            // console.log("arrContact "+dataRes.results);
            if (dataRes.results) {
                for (let i = 0; i < dataRes.results.length; i++) {
                    // console.log(dataRes.results[i].search);
                    // console.log((this.exOrCreateForm.get('projCtcName').value));
                    if (dataRes.results[i].search === this.exOrCreateForm.get('projCtcName').value) { ret1 = ''; break; }
                }
            }
            return ret1;
        });

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

    selPLeader: any = '';
    projLeadErr = false;
    selectedPLeader(user) {
        if (!user) {
            this.projLeadErr = true;
        }
        else {
            this.projLeadErr = false;
            this.selPLeader = user;
            $("#prjLead").val(this.selPLeader);
        }
    }

    selCName: any = '';
    contactPErr = false;
    selectedCName(user) {
        if (!user) {
            this.contactPErr = true;
        }
        else {
            this.contactPErr = false;
            this.selCName = user;
            $("#ctcName").val(this.selCName);
        }
    }

    keyInLoc() {
        if (this.exOrCreateForm.get('projLoc').value.length < 1) {
            this.proLocErr = true;
        }
        else {
            this.proLocErr = false;
            $("#errProjLoc").addClass("m--hide").show();
        }
    }

    keyInObj() {
        if (this.exOrCreateForm.get('projObj').value.length < 3) {
            this.prjObjErr = true;
        }
        else {
            this.prjObjErr = false;
            $("#errProjObj").addClass("m--hide").show();
        }
    }

    keyInSumm() {
        if (this.exOrCreateForm.get('projSumm').value.length < 3) {
            this.prjSummErr = true;
        }
        else {
            this.prjSummErr = false;
            $("#errProjSumm").addClass("m--hide").show();
        }
    }

    keyinKM() {
        this.kmError = false;
    }

    keyinVac() {
        this.VacError = false;
    }

    keySkill() {
        this.skillError = false;
        $("#errSkill").addClass("m--hide").show();
    }
    clearErrors() {
        this.prjNameErr = false; this.advDateError.isError = false;
        this.projLeadErr = false; this.contactPErr = false; this.skillError = false;
        this.prjNameErr = false; this.prjObjErr = false; this.proLocErr = false;
        this.prjSummErr = false; this.kmError = false; this.VacError = false;
    }

    prjNameErr = false;
    proLocErr = false;
    prjObjErr = false;
    prjSummErr = false;
    kmError = false;
    VacError = false;
    skillError = false;
    checkError() {

        //projectName
        if (this.exOrCreateForm.get('projName').value.length < 3) {
            this.prjNameErr = true;
        }
        else
            this.prjNameErr = false;

        this.compareTwoDates();

        //timeline
        let arrSt = (document.getElementById("startDt") as HTMLInputElement).value;
        let arrEd = (document.getElementById("endDt") as HTMLInputElement).value;
        if (arrSt.length < 1 || arrEd.length < 1) {
            this.advDateError.errorMessage = "Please choose start and end date.";
            this.advDateError.isError = true;
        }

        //location
        if (this.exOrCreateForm.get('projLoc').value.length < 1) {
            this.proLocErr = true;
        }

        //objective
        if (this.exOrCreateForm.get('projObj').value.length < 3) {
            this.prjObjErr = true;
        }
        else
            this.prjObjErr = false;

        //summary
        if (this.exOrCreateForm.get('projSumm').value.length < 3) {
            this.prjSummErr = true;
        }
        else
            this.prjSummErr = false;

        //key milestone
        // if (this.milestoneArray.length > 0) {
        //     this.checkArrMs();
        //     if (this.checkKmDate()) {
        //         for (let i = 0; i < this.milestoneArray.length; i++) {
        //             if (!(document.getElementById("inputKM_" + i) as HTMLInputElement).value
        //                 || !(document.getElementById("targetDt_" + i) as HTMLInputElement).value) {
        //                 this.kmError = true;
        //             } else
        //                 this.kmError = false;
        //         }
        //     } else
        //         this.kmError = true;
        // }

        //vacancy
        console.log(this.checkCanAddVac());
        if (this.checkCanAddVac()) {
            this.VacError = false;
        }
        else
            this.VacError = true;


        //skillset
        if (this.skillsets.length > 0) {
            this.skillError = false;
        }
        else
            this.skillError = true;
    }

    checkKmDate() {
        let check = true;
        let startDt = (document.getElementById("startDt") as HTMLInputElement).value;
        let endDt = (document.getElementById("endDt") as HTMLInputElement).value;

        if ((startDt.length > 0) && (endDt.length > 0) && (this.milestoneArray.length > 0)) {

            let arrSt = []; let arrEd = [];

            arrSt = ((document.getElementById("startDt") as HTMLInputElement).value).split("-");
            arrEd = ((document.getElementById("endDt") as HTMLInputElement).value).split("-");

            let sDt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]))
            let eDt = new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2]));
            let arrTd = []; let tDt = new Date();

            for (let i = 0; i < this.milestoneArray.length; i++) {
                if (((document.getElementById("targetDt_" + i) as HTMLInputElement))) {

                    arrTd = ((document.getElementById("targetDt_" + i) as HTMLInputElement).value).split("-");
                    tDt = new Date(Date.parse(arrTd[1] + '-' + arrTd[0] + '-' + arrTd[2]));

                    if ((tDt > eDt) || (tDt < sDt)) {
                        check = false; break;
                    }
                }
            }
        }
        else
            check = false;

        // kalau betul retun false
        return check;
    }

    pName: any = '';
    errInvalidName: any = false;
    pNameExist = false;
    onProjNameKeyUp(event: any) {
        this.pName = event.target.value;
        if (this.pName.length < 3) {
            this.errInvalidName = true;
            this.prjNameErr = false;
        }
        else {
            this.errInvalidName = false;
            this.pNameExist = true;
            $("#errProjName").removeClass("errMsg").show();
        }
    }

    cpCheck: boolean;
    cpBoxChange() {
        this.cpCheck = !this.cpCheck;
        console.log("cpCheck", this.cpCheck);
        if (this.cpCheck === true) {  //!this.dataEdit.details && 
            this.exOrCreateForm.patchValue({ projCtcName: this.exOrCreateForm.get('projLead').value });
            this.selCName = this.exOrCreateForm.get('projLead').value;
        }
        else
            this.selCName = '';

        console.log("selCName", this.selCName)
    }

    skillsets: any = [];
    errAddSkill = false;
    addSkillset() {
        this.skillError = false;
        $("#errSkill").addClass("m--hide");

        if (this.skillsets.length < 1) {
            this.skillsets.push($("#skillset").val().toString());
        }
        else if (this.skillsets.length > 0) {

            if (this.checkPushSkillset() === true) {
                this.skillsets.push($("#skillset").val().toString());
            }
            else if (this.checkPushSkillset() === false) {
                this.errAddSkill = true;
                setTimeout(() => {
                    this.errAddSkill = false;
                }, 5000);
            }
        }
        $("#skillset").val("");
        this.resSkill = [];
    }

    checkPushSkillset() {
        let check = true;
        let findSkill = this.skillsets.find(skill => { return skill.toLowerCase() === $("#skillset").val().toString().toLowerCase() });

        if (findSkill) {
            check = false;
        } else {
            check = true;
        }
        return check;
    }

    removeSkillset(index) {
        for (let i = 0; i < this.skillsets.length; i++) {
            if (i === index) {
                this.skillsets.splice(i, 1);
            }
        }
    }

    checkCanAddSkill() {
        let check = true;
        if ($("#skillset").val().toString().length > 0) {
            check = false;
        }
        else {
            check = true;
        }
        return check;
    }

    setTextInput(text) {
        $("#skillset").val(text);
        this.addSkillset();
    }
}
