import {
    ViewChild, ViewContainerRef, ComponentFactoryResolver, Component, OnInit,
    AfterViewInit, ViewEncapsulation, Injectable
} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Approver, appArr, Requestor, reqArr, Qualification, quaArr, ComLvl, comLvlArr, ComCluster, comClusterArr, ComCat, comCatArr, ComCom, comComArr } from "./arrCons";
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { JDVars } from './adv-detail-vars';
//import { IdleTimeoutService } from '../../../../_services/idleTimeout.service';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
//import { NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

declare let Dropzone: any;
declare var mWizard: any;
declare var thisPosId: any;
@Component({
    selector: 'app-adv-detail',
    templateUrl: './adv-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})

@Injectable()
export class AdvDetailComponent implements OnInit, AfterViewInit {
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    ads = GlobalVariable.ADS; posId = GlobalVariable.POS_ID; posName = GlobalVariable.POS_NAME;
    cannotAdv = JDVars.cannotAdv;
    updFeature = false; // after seperate job profile and adv profile, here cannot do editing
    loading = true;
    msgOccupied = JDVars.msgOccupied;
    msgDefault = JDVars.msgDefault;
    skillSearch = JDVars.skillSearch;

    usrLoginLvl = 0;
    // Advertise property
    rJobDetails = JDVars.rJobDetails;
    advBtnDisplay = true;
    advDisabled = true;
    btnAdvertise = JDVars.btnAdvertise;
    btnGotoJobProfile = JDVars.btnGotoJobProfile;
    editedAdvPos = false;
    disableSubmitAdv = true;
    msgAdvPeriod = JDVars.msgAdvPeriod;

    applyAdvPos: string;
    // Approve/ Decline property

    // Apply property
    applyBtnDisplay: string;
    updFormTechComTitle: string;
    errLevel = false;
    private getJobDataAPI = JDVars.jobProfById;

    thisPodId = this.route.snapshot.paramMap.get('id');
    data: any = {};
    posId2: string;
    tab1Title = JDVars.tab1Title; tab2Title = JDVars.tab2Title;
    tab3Title = JDVars.tab3Title; tab4Title = JDVars.tab4Title;
    tab5Title = JDVars.tab5Title; tab6Title = JDVars.tab6Title;
    tab7Title = JDVars.tab7Title; tab8Title = JDVars.tab8Title;
    tab9Title = JDVars.tab9Title; tab10Title = JDVars.tab10Title;
    noData = JDVars.noData;
    unauthorizeMsg: string;
    unauthorize = false;

    title1 = JDVars.title1; title2 = JDVars.title2;

    failDataDef = '-- Fail to Fetch Data --';
    comClusOptDef = '-- Select Cluster --';
    comCatOptDef = '-- Select Category --';
    comCompOptDef = '-- Select Competency --';
    comCompDefinitionDef: string;
    comLvlOptDef = '-- Select Level --';

    optionDate;
    optionDate2;

    // populate qualification list
    quaList = Array<quaArr>();
    qualification: Qualification = new Qualification();

    // populate technical Competency - job cluster
    comCluster: ComCluster = new ComCluster();
    comClusterList = Array<comClusterArr>();
    // populate technical competecny - job category
    comCat: ComCat = new ComCat();
    comCatList = Array<comCatArr>();
    // populate technical Competency - competency
    comCom: ComCom = new ComCom();
    comComList = Array<comComArr>();
    // competency definition
    comComDef: string;
    // populate technical Competency - level
    comlvl: ComLvl = new ComLvl();
    comLvlList = Array<comLvlArr>();

    /* :start Only HCBD Can Update Job Profile */
    toUpdPurpose = false; toUpdQua = false;
    toUpdTech = false; toUpdAOR = false;
    toUpdExp = false; toAdvJob = false;
    toUpdSkill = false;
    /* :end Only HCBD Can Update Job Profile */

    canUpdPosDesc = false;
    //formControl: NgControl, 
    constructor(private datePipe: DatePipe, private routers: Router, private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service, private http: Http,
        private route: ActivatedRoute, private formBuilder: FormBuilder,
        private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        this.getJobDetailData();
        this.getRequestor();
        this.getApprover();
        this.getJobAdsType();
        //this.routers.navigate(['job/advertisement-tracking/all']);          
    }

    getJobDetail() {
        let newPosId = this.route.snapshot.paramMap.get('id');
        this.posId2 = newPosId;
        let data = {
            positionId: newPosId //this.posId2
        }
        return this._POST_api_Service.POST_data(this.getJobDataAPI, data);
    }

    advDisableMsg = JDVars.advDisableMsg;
    advDisableMsg2 = JDVars.advDisableMsg2;
    showAdvDisableMsg = false;
    errLoadData = JDVars.errLoadData;
    getJobDetailData() {
        let jobPurpose = "";
        this.getJobDetail().subscribe(data => {
            this.data = data;
            this.loading = false;
            try {
                if (data.purpose.length > 0) {
                    jobPurpose = data.purpose[0].job_purpose;
                }
            }
            catch (e) {
                console.log("[ERROR] Populate Job Details Data: " + e);
            }

            // : GHCMDP-497 only job purpose and aor are required to submit advertisement
            // if (data.purpose[0].job_purpose.length<1||data.qualification.length<1||data.technical.length<1||
            // : GHCMDP-529 only job purpose is required to submit advertisement
            // if ( data.purpose[0].job_purpose.length<1|| data.aor.length<1 ){

            // if (data.purpose[0].job_purpose.length < 1) {
            //     this.advDisabled = true; this.showAdvDisableMsg = true;
            // } else {
            //     this.advDisabled = false; this.showAdvDisableMsg = false;
            // }

            if(this.env === 'prod'){
                if (data.purpose[0].job_purpose.length < 1) {
                    this.advDisabled = true; this.showAdvDisableMsg = true;
                } else {
                    this.advDisabled = false; this.showAdvDisableMsg = false;
                }
            }
            else{
                if (data.purpose[0].job_purpose.length < 1 || data.skillset.length < 1 ) {
                    this.advDisabled = true; this.showAdvDisableMsg = true;
                } else {
                    this.advDisabled = false; this.showAdvDisableMsg = false;
                }
            }

            this.updPosDescForm.setValue({
                updPosDesc: data.profile[0].position_desc,
                updPosDescPosId: data.profile[0].position_id
            });

            this.updPurposeForm.setValue({
                updPurpose: jobPurpose,
                //projSkill: '',
                updPurposePosId: data.profile[0].position_id
            });
            this.skillsetForm.setValue({
                projSkill: ''
            });
            this.advPosForm.setValue({
                advPosIdx2: data.profile[0].position_id,
                advPosRemark: '',
                //advPosStartDt: '',
                //advPosEndDt: '',
                //advPosStartDt2: '',
                //advPosEndDt2: '',
                dtStart: this.todayDate, dtEnd: this.advEndDate, //advPosDtRange: '', 
                advPosRemarkCheckBox: '',
                advPosRequestor: '', advPosApprover: '', advPosJobType: '',
            });

            // :: check user's job role
            let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
            let roleArr = usrRole.split(",");
            for (let i = 0; i < roleArr.length; i++) {
                roleArr[i] = roleArr[i].trim();
            }
            // if (usrRole == 'HCBD' || usrRole == 'ADMINHCBO,HCBD') {
            if ((roleArr.indexOf('3') >= 0) || (roleArr.indexOf('1') >= 0 && roleArr.indexOf('3') >= 0)) {
                this.toUpdPurpose = true;
                this.toUpdQua = true;
                this.toUpdTech = true;
                this.toUpdAOR = true;
                this.toUpdExp = true;
                this.toAdvJob = true;
                this.toUpdSkill = true;
                this.disableSubmitAdv = false;
            }

            // not authorized - HCBD only
            if ((roleArr.indexOf('3') >= 0) || (roleArr.indexOf('1') >= 0 && roleArr.indexOf('3') >= 0)) {
                this.canUpdPosDesc = true;
                if (this.data.profile[0].ableAdvertise != 1) {
                    this.unauthorize = true;
                    this.unauthorizeMsg = JDVars.cannotAdv;
                }
            } else {
                this.unauthorize = true; this.unauthorizeMsg = JDVars.unauthorizeMsg;
            }
            /*switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
                case 'HCBD':
                case 'ADMINHCBO,HCBD':
                    this.canUpdPosDesc = true;
                    if (this.data.profile[0].ableAdvertise != 1) {
                        this.unauthorize = true;
                        this.unauthorizeMsg = JDVars.cannotAdv;
                        break;
                    }
                    break;
                default: this.unauthorize = true; this.unauthorizeMsg = JDVars.unauthorizeMsg; break; // OTHER THAN HCBD CANNOT ADVERTISE
            }*/

            // already advertised
            if ((this.unauthorize == false) && (data.profile[0].adv_id != 0)) {
                this.showAdvDisableMsg = true; this.advDisabled = true;
                this.advDisableMsg = ' Position has been advertised. ';
                this.advDisableMsg2 = ' Position has been advertised. ';
            }
        },
            error => {
                this.showAlert('alertError');
                // this._alertService.error(error);
                this._alertService.error(this.errLoadData);
                console.log('[ERROR] Adv Details: ' + error);
                this.loading = false;
            })
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    ngOnInit() {
        if(this.env === 'prod')
               this.env_prod = true;
            else
               this.env_prod = false;
           
        this.checkLevel();
        this.getJobDetailData();
        // UPDATE POSITION DESCRIPTION FORM
        this.updPosDescForm = new FormGroup({
            updPosDesc: new FormControl(null, Validators.required),//minLength(2)),
            updPosDescPosId: new FormControl()
        });

        // UPDATE PURPOSE FORM
        this.updPurposeForm = new FormGroup({
            //projSkill: new FormControl(null),
            updPurpose: new FormControl(null, [Validators.required, Validators.maxLength(2500)]),//minLength(2)),
            updPurposePosId: new FormControl()
        });

        // UPDATE SKILLSET FORM
        this.skillsetForm = new FormGroup({
            projSkill: new FormControl(null)
        });

        // DELETE SKILLSET
        this.delSkillForm = new FormGroup({
            postId: new FormControl(null, Validators.required),
            tag: new FormControl(null, Validators.required)
        });

        // POPULATE QUALIFICATION LIST
        this.quaList.push(new quaArr(1, 'Professional'));
        this.quaList.push(new quaArr(2, 'Education'));
        this.qualification = new Qualification();
        this.qualification.qua = new quaArr(1, '');

        // TECHNICAL COMPETENCY
        // POPULATE TECHNICAL COMPETENCY LEVEL
        this.comLvlList = Array<comLvlArr>();
        this.comLvlList.push(new comLvlArr(null, '-- Select Level --'));
        this.comLvlList.push(new comLvlArr(1, 'Fundamental'));
        this.comLvlList.push(new comLvlArr(2, 'Intermediate'));
        this.comLvlList.push(new comLvlArr(3, 'Advanced'));
        this.comLvlList.push(new comLvlArr(4, 'Expert'));



        // ADVERTISEMENT REQUEST / SEND TO APPROVER
        this.advPosForm = new FormGroup({
            advPosIdx2: new FormControl(null, Validators.required),
            advPosRemark: new FormControl(),
            //advPosStartDt: new FormControl(),// new FormControl(null, Validators.required),
            //advPosEndDt: new FormControl(),// new FormControl(null, Validators.required),
            //advPosStartDt2: new FormControl(),// new FormControl(null, Validators.required),
            //advPosEndDt2: new FormControl(),// new FormControl(null, Validators.required),
            dtStart: new FormControl('', { updateOn: 'blur' }), dtEnd: new FormControl('', { updateOn: 'blur' }),//advPosDtRange: '', advPosDtRange: new FormControl(),
            advPosRemarkCheckBox: new FormControl(),
            advPosRequestor: new FormControl(), advPosApprover: new FormControl(), advPosJobType: new FormControl(),
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-adv-detail',
            [
                'assets/js/jobs/job-details-form.js',
                'assets/js/jobs/job-details-alert.js',
                //'assets/js/main/bootstrap-select.js'
            ]);
        Dropzone._autoDiscoverFunction();
    }

    // :start update position description
    showupdPosDesc = false; editedPosDesc = false;
    updPosDescMsg = ""; updPosDescStyle = "";
    changeUpdPosDesc(state) {
        this.showupdPosDesc = state;
    }
    updPosDescForm: FormGroup;
    onPosDescFormSubmit(): void {
        let data2 = {
            positionDesc: this.updPosDescForm.get('updPosDesc').value,
            positionId: this.updPosDescForm.get('updPosDescPosId').value
        }
        let updPosDescSend = this._POST_api_Service.POST_data(JDVars.posDesc, data2);
        let ret = updPosDescSend.subscribe(data2Res => {
            if (data2Res.status == "OK") {
                this.updPosDescMsg = 'Successfully Updated Position Description'
                this.updPosDescStyle = " alert-success ";
                this.getJobDetailData();// REFRESH DATA WITHOUT LOADING -- this.getJobDetailData();
            } else {
                this.updPosDescMsg = 'Fail to Update Position Description'
                this.updPosDescStyle = " alert-danger ";
            }
            this.showupdPosDesc = false;
            this.editedPosDesc = true;
            setTimeout(function() {
                this.editedPosDesc = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end update position description
    skillsetForm: FormGroup;
    // :start update purpose
    updPurposeForm: FormGroup;
    editedPurpose = false;
    updPurposeStyle: string;
    dataUpdPurpose: any = {};
    updPorposeMsg: string;
    onPurposeFormSubmit(): void {
        let data2 = {
            positionId: this.updPurposeForm.get('updPurposePosId').value,
            purpose: this.updPurposeForm.get('updPurpose').value
        }
        let updPurposeSend = this._POST_api_Service.POST_data(JDVars.jobUpdPurpose, data2);

        let ret = updPurposeSend.subscribe(data2Res => {
            this.dataUpdPurpose = data2Res;
            if (this.dataUpdPurpose.status == "OK") {
                this.updPorposeMsg = 'Successfully Updated Job Purpose'
                this.updPurposeStyle = " alert-success ";
                this.getJobDetailData();// REFRESH DATA WITHOUT LOADING -- this.getJobDetailData();
            } else {
                this.updPorposeMsg = 'Fail to Update Job Purpose'
                this.updPurposeStyle = " alert-danger ";
            }
            this.editedPurpose = true;
            setTimeout(function() {
                this.editedPurpose = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end update purpose

    // :start get qualification category name
    findQuaName(quaIdx) {
        let myObj = this.quaList.find(x => x.id == quaIdx);
        // if (myObj == null)
        //     myObj['name'] = '';
        return myObj['name'];
    }
    act: string;
    // :start tech com
    editedTechCom = false; // Add/Update message display
    // Add/Update Tech Com
    updTechComForm: FormGroup;
    tglTectComCat = false; tglTectComCom = false; tglTectComComDef = false;

    findTecComCat(idx) {
        if ((idx.match(this.comCatOptDef) !== null) || (idx.match('0') !== null)) {
            return 'N/A';
        } else {
            return idx;
        }
    }

    // :start on change level
    lvlChangedUpdLvlHidden(this) {
        let selLvl = this.updTechComForm.get('updTechComLvl').value;
        if (selLvl.match(this.comLvlOptDef) !== null) {
            this.updTechComForm.setValue({
                updTechComDef: this.dataUpdReq[0].COMP_DEF, updTechComIdx: this.updTechComForm.get('updTechComIdx').value,
                updTechComCatOpt: this.updTechComForm.get('updTechComCatOpt').value, updTechComComOpt: this.updTechComForm.get('updTechComComOpt').value,
                updTechComClusIdOpt: this.updTechComForm.get('updTechComClusIdOpt').value, updTechComLvl: this.updTechComForm.get('updTechComLvl').value,
                updTechComLvlHidden: ''
            });
            this.errLevel = true;
        } else {
            this.updTechComForm.setValue({
                updTechComDef: this.dataUpdReq[0].COMP_DEF, updTechComIdx: this.updTechComForm.get('updTechComIdx').value,
                updTechComCatOpt: this.updTechComForm.get('updTechComCatOpt').value, updTechComComOpt: this.updTechComForm.get('updTechComComOpt').value,
                updTechComClusIdOpt: this.updTechComForm.get('updTechComClusIdOpt').value, updTechComLvl: this.updTechComForm.get('updTechComLvl').value,
                updTechComLvlHidden: this.updTechComForm.get('updTechComLvl').value
            });
            this.errLevel = false;
        }
    }
    // :end on change level

    // :start HCBD admin send advertisement for approval
    advPosForm: FormGroup;
    //disableSubmitAdv = true;
    errAdvPeriod = false;
    dataAdvPos: any = {};
    advPosMsg: string;
    advPosStyle: string; advPosIcon: string;
    private postAdvertisePositionAPI = JDVars.jobPostAdv;

    onadvPosFormSubmit(): void {
        let advPosIdx2 = this.thisPodId;
        //let posStartDt = this.advPosForm.get('advPosStartDt').value;
        //let posEndDt = this.advPosForm.get('advPosEndDt').value;
        let posStartDt2 = '';//((document.getElementById("advPosStartDt") as HTMLInputElement).value); // <HTMLInputElement>document.getElementById("advPosStartDt2");//this.advPosForm.get('advPosStartDt2').value;
        let posEndDt2 = '';//((document.getElementById("advPosEndDt") as HTMLInputElement).value); // <HTMLInputElement>document.getElementById("advPosEndDt2");//this.advPosForm.get('advPosEndDt2').value;        
        let posRemark = this.advPosForm.get('advPosRemark').value;
        let posJobType = this.advPosForm.get('advPosJobType').value;
        let advPosRemarkCheckBox = this.advPosForm.get('advPosRemarkCheckBox').value;
        let generalMsg = ' Advertise Job Position #' + advPosIdx2;
        let advApi = this.postAdvertisePositionAPI;

        // Date Range Code let posDtRange = ((document.getElementById("advPosDtRange") as HTMLInputElement).value);
        // Date Range Code let advStartDt = posDtRange.substr(3, 2) + "-" + posDtRange.substr(0, 2) + "-" + posDtRange.substr(6, 4);
        // Date Range Code let advEndDt = posDtRange.substr(17, 2) + "-" + posDtRange.substr(14, 2) + "-" + posDtRange.substr(20, 4);
        let advStartDt = ((document.getElementById("startDate2") as HTMLInputElement).value); //this.advPosForm.get('dtStart').value;
        let advEndDt = ((document.getElementById("endDate2") as HTMLInputElement).value); //this.advPosForm.get('dtEnd').value;

        //console.log(advStartDt); console.log(advEndDt);
        let advPosRequestorArr = (this.advPosForm.get('advPosRequestor').value).split(" - ");
        let advPosRequestor = advPosRequestorArr[0];
        let advPosApproverArr = (this.advPosForm.get('advPosApprover').value).split(" - ");
        let advPosApprover = advPosApproverArr[0];
        // let advPosJobTypeArr = (this.advPosForm.get('advPosJobType').value).split(" - ");
        // let advPosJobType = advPosJobTypeArr[0];

        if(posJobType == 'Internal (ERA)')
            posJobType = 1;
        else
            posJobType = 0;

        this.dataAdvPos = {
            position_id: advPosIdx2,
            start: advStartDt, // posStartDt2,
            close: advEndDt, // posEndDt2,
            remark: posRemark,
            requester: advPosRequestor,
            approval: advPosApprover,
            // type: posJobType,
            public: posJobType,
            share: "Y"
        }

        //console.log(this.dataAdvPos);
        /**** REMARK SEKEJAP TODO NANTO REMOVE   */
        let updQuaSend = this._POST_api_Service.POST_data(advApi, this.dataAdvPos);
        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            //console.log(this.dataAdvPos.status);
            if (this.dataAdvPos.status == "OK") {
                this.advPosMsg = 'Successfully' + generalMsg;
                this.advPosMsg += ' You will be redirected to Advertisement Tracking page shortly. ';
                this.advPosStyle = ' alert-success '; this.advPosIcon = ' flaticon-paper-plane ';
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
                this.editedAdvPos = true;
                setTimeout(function() {
                    this.editedAdvPos = false;
                    // this.routers.navigate(['admin/job/advertisement-tracking/all']);
                    
                    if(posJobType == 1)
                        this.routers.navigate(['admin/job/advertisement-tracking/1_0_0_0_0']);
                    else
                        this.routers.navigate(['admin/job/career-tm/all_0_0_0_0']);

                }.bind(this), 3000); //wait 3 Seconds and hide
                this.advBtnDisplay = false;
            } else {
                this.advPosMsg = 'Fail to ' + generalMsg + ' (Position has been advertised)';
                this.advPosStyle = ' alert-danger  '; this.advPosIcon = ' flaticon-circle ';
                this.editedAdvPos = true;
                this.advBtnDisplay = false;//this.advDisabled = true;
            }
        },
            error => {
                console.log('[ERROR] Advertise Job Profile: ' + error);
                this.editedAdvPos = true;
                this.advPosMsg = 'Fail to Advertise Job Profile.'
                this.advPosStyle = " alert-danger ";
            })
        /* end test */

    }
    // :end HCBD admin send advertisement for approval 

    showOccMsg = false; advMsgStyle = 'secondary'; apprRemark = false;
    checkOccupied(occ) {
        if (occ == 1) {
            this.showOccMsg = true; this.advMsgStyle = 'warning'; this.apprRemark = true;
        } else {

        }
    }

    requestorListAPI = JDVars.requestorList;
    optReq: Requestor = new Requestor();
    optReqList = Array<reqArr>();
    optReqList2 = [];
    getRequestor() {
        let comClusterListSend = this._GET_api_Service.GET_data(this.requestorListAPI);
        this._GET_api_Service.GET_data(this.requestorListAPI).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                this.optReqList2.push(data[i].Staff_No + " - " + data[i].Pernr_Name);
            }
            //this.optReqList = data;
        },
            error => console.log('[ERROR - Get Requestor List] ' + error),
        );
    }

    approverListAPI = JDVars.approverList;
    optApp: Approver = new Approver();
    optAppList = Array<appArr>();
    optAppList2 = [];
    getApprover() {
        let dataPos = {
            id: this.thisPodId
        };
        this._POST_api_Service.POST_data(this.approverListAPI, dataPos).subscribe(data => {
            // this.optAppList = data;
            for (let i = 0; i < data.length; i++) {
                this.optAppList2.push(data[i].Staff_No + " - " + data[i].Pernr_Name);
            }
        },
            error => console.log('[ERROR - Get Approver List] ' + error),
        );
    }

    optAppList3 = [];
    getJobAdsType() {
        this.optAppList3.push("Internal (ERA)");
        this.optAppList3.push("External (Career@TM)");
    }

    date1: Date; date2: Date;
    todayDate = new Date(); //this.transformDate(new Date());
    newDt = new Date();
    advEndDate = new Date(this.newDt.setDate(this.newDt.getDate() + 14 - 1)); //this.transformDate(new Date(this.newDt.setDate(this.newDt.getDate() + 14)));
    advEDevent = 1;
    isErr = false;
    advDateError: any = { isError: false, errorMessage: '' };

    transformDate(date) {
        return this.datePipe.transform(date, 'dd-MM-yyyy'); //whatever format you need. 
    }
    
    selectChangeHandler (event: any) {
        this.isErr = false;

        this.advDateError = {
            isError: this.isErr,
        };
        // console.log("1.) nilai advEndDate: " +this.advEndDate);
        //update the ui
        this.optionDate = event.target.value;
        // console.log("the value is: " +this.optionDate);
        
        if(this.optionDate === "External (Career@TM)"){this.dateChangeVariable(2); this.optionDate2 = 2;}
        
        if(this.optionDate === "Internal (ERA)"){this.dateChangeVariable(1); this.optionDate2 = 1;}

        
      }

    dateChangeVariable(a:number)
    {
        if (this.advEDevent === 1 )
        {
            this.advEndDate = new Date(this.newDt.setDate(this.newDt.getDate() - 14 + 1 ));
        } else if (this.advEDevent === 2 )
        {
            this.advEndDate = new Date(this.newDt.setDate(this.newDt.getDate() - 31 + 1 ));
        }

        // console.log("2.) nilai advEndDate: " +this.advEndDate);
        this.advEndDate = null;
        // console.log("3.) nilai advEndDate: " +this.advEndDate);
        if (a === 1 ) { this.advEndDate = new Date(this.newDt.setDate(this.newDt.getDate() + 14 - 1)); this.advEDevent = 1}
        else if (a === 2 ) { this.advEndDate = new Date(this.newDt.setDate(this.newDt.getDate() + 31 - 1)); this.advEDevent = 2} 
        // console.log("4.) nilai advEndDate: " +this.advEndDate);
    }

    dtEnd: any; dtStart: any;
    compareTwoDates() { //this.advPosForm.get('advPosIdx2').value;
        let mySt = new Date((document.getElementById("startDate2") as HTMLInputElement).value);
        let myEd = new Date((document.getElementById("endDate2") as HTMLInputElement).value);
        var ONE_DAY = 1000 * 60 * 60 * 24;
        let days = Math.round((Math.abs(myEd.getTime() - mySt.getTime()) / ONE_DAY));
        let errMsg = '';
        //console.log(mySt);        console.log(myEd);        console.log(days);        
        //if (Math.round(((myEd.getTime() - mySt.getTime()) / ONE_DAY)) < 0) {
        if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            this.isErr = true; errMsg += 'Invalid advertisement period. End date should not be less than start date. ';
            //console.log("Invalid"); console.log(Math.round(((myEd.getTime() - mySt.getTime()) / ONE_DAY))); console.log('--');
            //} else if (days > 14) {
        } else if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY > (14 - 1) && this.optionDate2 === 1) {
            this.isErr = true; errMsg += 'Advertisement period should not be more than 14 days. ';
            // console.log("More than 14"); console.log(days);  console.log('--');
        } else if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY > (31 - 1)  && this.optionDate2 === 2) {
            this.isErr = true; errMsg += 'Advertisement period should not be more than one month. ';
            // console.log("More than 14"); console.log(days);  console.log('--');
        }
        let today = new Date(); // new Date();
        //if  (Math.round(((mySt.getTime() - today.getTime()) / ONE_DAY)) < 0)  {
        if ((mySt.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            this.isErr = true; errMsg += 'Advertisement start date has expired. ';
            //console.log("Expired"); console.log(Math.round(((myEd.getTime() - mySt.getTime()) / ONE_DAY))); console.log('--');
        }
        this.advDateError = {
            isError: this.isErr, errorMessage: errMsg,
        };
        //  console.log(this.advDateError);
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }

    // begin: save skillset
    delSkillMsg: string;
    delSkillStyle: string;
    editSkillset = false;
    saveSkillset(){
        this.act = "Add";
        // console.log('skillsets: '+this.skillsets2.length)
        // console.log(this.skillsets2);

        if(this.skillsets2.length > 0) {
            for (let i = 0; i < this.skillsets2.length; i++) {
                let data = {                  
                        postId: this.thisPodId,
                        tag: this.skillsets2[i]
                    }
                    
                    let addCr = this._POST_api_Service.POST_REC_data('/recruitment/admin/addSkills', data);
                    let dataJUDel: any = {};
                    let ret = addCr.subscribe(dataRes => {
                        dataJUDel = dataRes;                                                                                                                            
                    })
            }

            this.editSkillset = true;
            this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            this.delSkillMsg = 'Successfully ' + this.act + ' Skillset';
            this.delSkillStyle = " alert-success ";
            
            $("#skillset").val("");
            this.resSkill = [];
            this.skillsets = [];
            this.skillsets2 = [];
            
            setTimeout(function() {
                this.editSkillset = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        }   
    }
    // end: save skillset

    // begin: delete skillset
    
    delSkillForm: FormGroup;
    // open model and set value
    delSkill(idx) {
        this.delSkillForm.setValue({
            postId: this.thisPodId, tag: idx
        });
    }
    
    jobDeleteSkill = '/recruitment/admin/deleteSkills';
    onDelSkillFormSubmit() {
        this.act = "Delete";
        let postData = {
            postId: this.delSkillForm.get('postId').value,
            tag: this.delSkillForm.get('tag').value
        }
        let postDelSkill = this._POST_api_Service.POST_REC_data(this.jobDeleteSkill, postData);

        let ret = postDelSkill.subscribe(dataFuncRes => {
            let res = dataFuncRes;
            if (res.status == "OK") {
                this.delSkillMsg = 'Successfully ' + this.act + ' Skillset';
                this.delSkillStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.delSkillMsg = 'Fail to ' + this.act + ' Skillset';
                this.delSkillStyle = " alert-danger ";
            }
            this.editSkillset = true;
            setTimeout(function() {
                this.editSkillset = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })

    }
    // end: delete skillset


    skillError = false;
    timer = null;
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

    skillsets: any = [];
    skillsets2: any = [];
    errAddSkill = false;
    addSkillset(id) {
        this.skillError = false;
        $("#errSkill").addClass("m--hide");

        if (this.skillsets.length < 1) {
            this.skillsets.push($("#skillset").val().toString());
            this.skillsets2.push(id);
        }
        else if (this.skillsets.length > 0) {

            if (this.checkPushSkillset() === true) {
                this.skillsets.push($("#skillset").val().toString());
                this.skillsets2.push(id);
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
        for (let i = 0; i < this.skillsets2.length; i++) {
            if (i === index) {
                this.skillsets2.splice(i, 1);
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
        $("#skillset").val(text.name);
        this.addSkillset(text.id);
    }


}

