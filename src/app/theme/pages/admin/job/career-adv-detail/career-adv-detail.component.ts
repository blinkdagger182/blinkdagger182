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
import {
    Approver, Requestor, appArr, reqArr, Qualification, quaArr, ComLvl, comLvlArr,
    FuncCluster, funcClusterArr, FuncFam, funcFamArr, FuncFamDesc, funcFamDescArr,
    ComCluster, comClusterArr, ComCat, comCatArr, ComCom, comComArr
} from "./arrCons";
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { JDVars } from './career-adv-detail-vars';
//import { IdleTimeoutService } from '../../../../_services/idleTimeout.service';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';

import { JobsVars } from '../../../user/user-job/user-job-vars';
import { MyPostCode } from './postcode';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es/lodash';
declare let Dropzone: any;
declare var mWizard: any;
declare var thisPosId: any;
@Component({
    selector: 'app-career-adv-detail',
    templateUrl: './career-adv-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})
    
@Injectable()
export class CareerAdvDetailComponent implements OnInit, AfterViewInit {

    skillSearch = JDVars.skillSearch;
    rJobAdvProf = JDVars.rJobAdvProf;
    rJobAdvTrack = JDVars.rJobAdvTrack;
    rNEPromo = JDVars.rNEPromo;
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    myPostCode = MyPostCode;
    myCities = _.uniqBy(this.myPostCode, function (e) {
        return e.Post_Office;
      });
    //myState = _.uniqBy(this.myPostCode, function (e) {
    //    return e.State;
    //});
    isAdv = false;// old process
    goToAdv = false;
    goToNE = false;
    loading = true;
    msgOccupied = JDVars.msgOccupied;
    msgDefault = JDVars.msgDefault;
    advId = 0; ads = GlobalVariable.ADS; posId = GlobalVariable.POS_ID; posName = GlobalVariable.POS_NAME;

    usrLoginLvl = 0;
    // Advertise property
    advBtnDisplay = true;
    advDisabled = true;
    btnAdvertise = JDVars.btnAdvertise;
    btnPrvAdvertise = JDVars.btnPrvAdvertise;
    btnGotoAdvertise = JDVars.btnGotoAdvertise; btnGotoAdsTracking = JDVars.btnGotoAdsTracking; btnGotoNEPromo = JDVars.btnGotoNEPromo;
    editedAdvPos = false;
    disableSubmitAdv = true;
    msgAdvPeriod = JDVars.msgAdvPeriod;

    applyAdvPos: string;
    // Approve/ Decline property

    // Apply property
    applyBtnDisplay: string;
    updFormTechComTitle: string;
    errLevel = false; errLevel2 = false;

    //private apiUrl = GlobalVariable.BASE_API_URL;
    //private baseApiToken = GlobalVariable.API_KEY;
    //private token = '?api_key=' + this.baseApiToken;
    //private getJobDataAPI = this.apiUrl + JDVars.jobProfById + this.token;
    private getJobDataAPI = JDVars.jobProfById;

    thisPodId = this.route.snapshot.paramMap.get('id');
    data: any = {};
    posId2: string;
    tab1Title = JDVars.tab1Title; tab2Title = JDVars.tab2Title;
    tab3Title = JDVars.tab3Title; tab4Title = JDVars.tab4Title;
    tab5Title = JDVars.tab5Title; tab6Title = JDVars.tab6Title;
    tab7Title = JDVars.tab7Title; tab8Title = JDVars.tab8Title;
    tab9Title = JDVars.tab9Title; noData = JDVars.noData;

    pnlHead = " collapsed"; pnlBody = " collapse";

    title1 = JDVars.title1;

    failDataDef = '-- Fail to Fetch Data --';
    comClusOptDef = '-- Select Cluster --';
    funcCatOptDef = '-- Select Category --';
    funcFamOptDef = '-- Select Family --';
    funcDescOptDef = '-- Select Description --';
    comCatOptDef = '-- Select Category --';
    comFuncFamily = '-- Select Family --';
    comFuncDesc = '-- Select Description --';
    comCompOptDef = '-- Select Competency --';
    comCompDefinitionDef: string;
    comLvlOptDef = '-- Select Level --';

    // populate qualification list
    quaList = Array<quaArr>();
    qualification: Qualification = new Qualification();

    // populate functional Competency - job Category
    funcCluster: FuncCluster = new FuncCluster();
    funcClusterList = Array<funcClusterArr>();

    //populate functional Competency - job Family
    funcFam: FuncFam = new FuncFam();
    funcFamList = Array<funcFamArr>();

    //populate functional Competency - job Family Desc
    funcFamDesc: FuncFamDesc = new FuncFamDesc();
    funcFamDescList = Array<funcFamDescArr>();

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
    toUpdTech = false; toUpdAOR = false; toUpdFunc = false;
    toUpdExp = false; toAdvJob = false;
    /* :end Only HCBD Can Update Job Profile */

    //edit page or create page
    canEditPage = false;

    canUpdPosDesc = false;

    constructor(private routers: Router, private _GET_api_Service: GET_Service, 
        private _POST_api_Service: POST_Service, private http: Http,
        private route: ActivatedRoute, private formBuilder: FormBuilder,
        private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        //this.routers.navigate(['job/advertisement-tracking/all']);          
    }

    funcComCat;
    jobInfoCareerForm: FormGroup;
    typeJobPostAct: string;
    jobOptClusterCom = JDVars.jobOptClusterCom;
    ngOnInit() {
        if(this.env === 'prod')
               this.env_prod = true;
            else
               this.env_prod = false;

        //Use one page to create/post and edit
        let type = (this.routers.url).split("/").pop();
        if(type !== 'create'){
            // this.canEditPage = true;

            let subtype = this.routers.url.substring(0, this.routers.url.lastIndexOf('/'));

            this.declareInputField();
            if(subtype === '/admin/job/advertisement/new-career/detail'){
                this.canEditPage = false;
                this.typeJobPostAct = 'post';
            } else {
                this.canEditPage = true;
                this.typeJobPostAct = 'edit';
            }

            this.getJobDetailData();
        } else {
            this.loadFilter([]);
        }
        this.getRequestor();
        this.getApprover();
        this.getJobAdsType();
    }

    jobPurpose: string;
    initInputField(data){
        let jobPurpose = "";
        //OLD   OLD   OLD   OLD   OLD
        try {
            if (data.purpose && (data.purpose.length > 0)) {
                jobPurpose = data.purpose[0].job_purpose;
            }
        }
        catch (e) {
            console.log("[ERROR] Populate Job Details Data: " + e);
        }
        //console.log(data.purpose[0].job_purpose.length);

        this.toUpdPurpose = true; this.toUpdQua = true; this.toUpdTech = true;
        this.toUpdFunc = true; this.toUpdAOR = true;
        this.toUpdExp = true; this.toAdvJob = true;

        // : GHCMDP-497 only job purpose and aor are required to submit advertisement
        // if (data.purpose[0].job_purpose.length<1||data.qualification.length<1||data.technical.length<1||
        // : GHCMDP-529 only job purpose is required to submit advertisement
        // if ( data.purpose[0].job_purpose.length<1|| data.aor.length<1 ){
        if (data.purpose && data.purpose[0] && (data.purpose[0].job_purpose.length < 1) || data.purpose[0] == undefined) {
            this.advDisabled = true; this.showAdvDisableMsg = true;
            this.pnlHead = " "; this.pnlBody = " show";//kalau nak hide this.pnlHead=" "; this.pnlBody=" show";
        } else if (data.profile[0].is_outdated == 1) {
            this.advDisabled = true; this.showAdvDisableMsg = false;this.canEditPage = true; 
            this.pnlHead = " "; this.pnlBody = " show";//kalau nak hide this.pnlHead=" "; this.pnlBody=" show";

            this.toUpdPurpose = false; this.toUpdQua = false; this.toUpdTech = false;
            this.toUpdFunc = false; this.toUpdAOR = false;
            this.toUpdExp = false; this.toAdvJob = false;
        } else {
            this.advDisabled = false; this.showAdvDisableMsg = false;
            this.pnlHead = " collapsed"; this.pnlBody = " collapse";
        }
        this.updPurposeForm.setValue({
            updPurpose: jobPurpose,
            projSkill: '',
            updPurposePosId: data.profile[0].Position_ID
        });
        this.advPosForm.setValue({
            advPosIdx2: data.profile[0].Position_ID,
            advPosRemark: '',
            advPosStartDt: '',
            advPosEndDt: '',
            advPosStartDt2: '',
            advPosEndDt2: '',
            advPosDtRange: '',
            advPosRemarkCheckBox: '',
            advPosRequestor: '',
            advPosApprover: '',
            advPosVacancy: '1',
            advPosJobType: 0
        });

        // :: check user's job role
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        let usrArr = usrRole.split(",");
        //if (usrRole == 'HCBD' || usrRole == 'ADMINHCBO,HCBD') {
        for (let i = 0; i < usrArr.length; i++) {
            if (usrArr[i] === '3') {
                this.goToAdv = true;//  check in LOB or not
            }
            if (usrArr[i] === '3') {
                this.goToNE = true;//  check in LOB or not
            }
        }

        // new: all can update
        this.jobPurpose = data.purpose.length > 0 ? data.purpose[0].job_purpose : '';

        // check advertisement id
        if (data.profile && data.profile[0] && (data.profile[0].adv_id)) {
            this.advId = data.profile[0].adv_id;
        }
    }

    declareInputField(){
        // UPDATE PURPOSE FORM
        this.updPurposeForm = new FormGroup({
            projSkill: new FormControl(null),
            updPurpose: new FormControl(null, [Validators.required, Validators.maxLength(2500)]),//minLength(2)),
            updPurposePosId: new FormControl()
        });

        // UPDATE QUALIFICATION FORM
        this.updQualificationForm = new FormGroup({
            updQuaIdx: new FormControl(null, Validators.required),
            updQuaCat: new FormControl(null, Validators.required),
            updQuaArea: new FormControl(null, Validators.required),
            updQuaSubArea: new FormControl(null, Validators.required),
        });

        // POPULATE QUALIFICATION LIST
        this.quaList.push(new quaArr(1, 'Professional'));
        this.quaList.push(new quaArr(2, 'Education'));
        this.qualification = new Qualification();
        this.qualification.qua = new quaArr(1, '');

        // DELETE QUALIFICATION FORM
        this.delQualificationForm = new FormGroup({
            delQuaIdx: new FormControl(null, Validators.required),
        });

        // UPDATE AOR FORM
        this.updAorForm = new FormGroup({
            updAorIdx: new FormControl(null, Validators.required),
            updAor: new FormControl(null, Validators.required),
            updKeyAct: new FormControl(null, Validators.required),
        });
        // DELETE AOR FORM
        this.delAorForm = new FormGroup({
            delAorIdx: new FormControl(null, Validators.required),
        });

        // UPDATE REQUIREMENT FORM
        this.updReqForm = new FormGroup({
            updReqIdx: new FormControl(null, Validators.required),
            updReqArea: new FormControl(null, Validators.required),
            updReqYear: new FormControl(null, Validators.required),
        });
        // DELETE REQUIREMENT FORM
        this.delReqForm = new FormGroup({
            delReqIdx: new FormControl(null, Validators.required),
        });

        //UPDATE FUNCTIONAL COMPETENCIES FORM
        this.updFuncComForm = new FormGroup({
            updFuncComIdx: new FormControl(null, Validators.required),
            updFuncComClusIdOpt: new FormControl(null, Validators.required),
            updFuncComFamOpt: new FormControl(null, Validators.required),
            updFuncComDescOpt: new FormControl(null, Validators.required)
        });

        // UPDATE TECHNICAL COMPETENCIES FORM        
        this.updTechComForm = new FormGroup({
            updTechComIdx: new FormControl(null, Validators.required),
            updTechComCatOpt: new FormControl(null, Validators.required),
            updTechComComOpt: new FormControl(null, Validators.required),
            updTechComDef: new FormControl(null, Validators.required),
            updTechComLvl: new FormControl(null, Validators.required),
            updTechComLvlHidden: new FormControl(null, Validators.required),
            updTechComClusIdOpt: new FormControl(null, Validators.required),
        });
        // DELETE FUNCTIONAL COMPETENCIES FORM
        this.delFuncComForm = new FormGroup({
            delFuncComIdx: new FormControl(null, Validators.required),
        });

        // DELETE TECHNICAL COMPETENCIES FORM
        this.delTechComForm = new FormGroup({
            delTechComIdx: new FormControl(null, Validators.required),
        });

        // TECHNICAL COMPETENCY
        // POPULATE TECHNICAL COMPETENCY LEVEL
        this.comLvlList = Array<comLvlArr>();
        this.comLvlList.push(new comLvlArr(null, '-- Select Level --'));
        this.comLvlList.push(new comLvlArr(1, 'Fundamental'));
        this.comLvlList.push(new comLvlArr(2, 'Intermediate'));
        this.comLvlList.push(new comLvlArr(3, 'Advanced'));
        this.comLvlList.push(new comLvlArr(4, 'Expert'));

        //populate functional competency job Category
        let jobFcClusAPI = JDVars.jobFcClusAPI;

        let defFuncClus: 1;
        let defFuncClusName: string;

        let funcClusterListSend = this._GET_api_Service.GET_data(jobFcClusAPI);
        this.funcClusterList = Array<funcClusterArr>();
        let retFuncCluster = funcClusterListSend.subscribe(data => {
            this.funcComCat = data;
            if (this.funcComCat.length > 0) {
                this.funcClusterList.push(new funcClusterArr(0, this.funcCatOptDef));
                for (let i = 0; i < this.funcComCat.length; i = i + 1) {
                    this.funcClusterList.push(new funcClusterArr(this.funcComCat[i].CLUSTER_ID, this.funcComCat[i].CLUSTER_NAME));

                }
                this.funcCluster = new FuncCluster();
                this.funcCluster.funcClus = new funcClusterArr(0, this.funcCatOptDef);
            } else {
                this.funcClusterList.push(new funcClusterArr(-1, 'Fail to Fetch Data'));
                this.funcCluster = new FuncCluster();
                this.funcCluster.funcClus = new funcClusterArr(-1, 'Fail to Fetch Data');
            }
        })

        //populate competency Cluster
        let defComClus: 1;
        let defComClusName: string;
        let comClusterListSend = this._GET_api_Service.GET_data(this.jobOptClusterCom);
        this.comClusterList = Array<comClusterArr>();
        let retOptCluster = comClusterListSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.length > 0) {
                this.comClusterList.push(new comClusterArr(this.comClusOptDef));
                for (let j = 0; j < this.dataUpdReq.length; j = j + 1) {
                    let k = j + 1;
                    this.comClusterList.push(new comClusterArr(this.dataUpdReq[j].CLUSTER_ID));
                    if (j == 0) {
                        defComClus = 1;
                        defComClusName = this.dataUpdReq[j].CLUSTER_ID;
                    }
                }
                this.comCluster = new ComCluster();
                this.comCluster.comClus = new comClusterArr(this.comClusOptDef);
            } else {
                this.comClusterList.push(new comClusterArr('Fail to Fetch Data'));
                this.comCluster = new ComCluster();
                this.comCluster.comClus = new comClusterArr('Fail to Fetch Data');
            }
        })
        // ADVERTISEMENT REQUEST / SEND TO APPROVER
        this.advPosForm = new FormGroup({
            advPosIdx2: new FormControl(null, Validators.required),
            advPosRemark: new FormControl(),
            advPosStartDt: new FormControl(),// new FormControl(null, Validators.required),
            advPosEndDt: new FormControl(),// new FormControl(null, Validators.required),
            advPosStartDt2: new FormControl(),// new FormControl(null, Validators.required),
            advPosEndDt2: new FormControl(),// new FormControl(null, Validators.required),
            advPosDtRange: new FormControl(),
            advPosRemarkCheckBox: new FormControl(),
            advPosVacancy: new FormControl(),
            advPosRequestor: new FormControl(),
            advPosApprover: new FormControl(),
            advPosJobType: new FormControl()
        });
    }

    loadingSubmit = false;
    jobProfByIdC = JDVars.jobProfByIdC;
    jobProfByIdU = JDVars.jobProfByIdU;
    onInfoCareerFormSubmit() {
        let dataPost: any = {};
        if(this.jobInfoCareerForm.status == 'VALID'){
            if( this.typeJobPostAct == 'edit') {
                dataPost = {
                    positionId: this.jobInfoCareerForm.get('infoPosId').value,
                    postName: this.jobInfoCareerForm.get('infoPosName').value,
                    company: this.jobInfoCareerForm.get('infoCompany').value,
                    lob: this.jobInfoCareerForm.get('infoLOB').value,
                    division: this.jobInfoCareerForm.get('infoDivision').value,
                    building: this.jobInfoCareerForm.get('infoBuilding').value,
                    city: this.jobInfoCareerForm.get('infoCity').value,
                    region: this.jobInfoCareerForm.get('infoRegion').value,
                    band: this.jobInfoCareerForm.get('infoBand').value,
                    cluster: this.jobInfoCareerForm.get('infoCluster').value,
                    family: this.jobInfoCareerForm.get('infoFamily').value,
                    group: this.jobInfoCareerForm.get('infoEmployeeGroup').value,
                    sub_group: this.jobInfoCareerForm.get('infoEmployeeSubgroup').value,
                    report_to: this.jobInfoCareerForm.get('infoReportToName').value.split(" - ")[0],
                    report_to_name: this.jobInfoCareerForm.get('infoReportToName').value.split(" - ")[1],
                }
            }
            else {
                dataPost = {
                    postName: this.jobInfoCareerForm.get('infoPosName').value,
                    company: this.jobInfoCareerForm.get('infoCompany').value,
                    lob: this.jobInfoCareerForm.get('infoLOB').value,
                    division: this.jobInfoCareerForm.get('infoDivision').value,
                    building: this.jobInfoCareerForm.get('infoBuilding').value,
                    city: this.jobInfoCareerForm.get('infoCity').value,
                    region: this.jobInfoCareerForm.get('infoRegion').value,
                    band: this.jobInfoCareerForm.get('infoBand').value,
                    cluster: this.jobInfoCareerForm.get('infoCluster').value,
                    family: this.jobInfoCareerForm.get('infoFamily').value,
                    group: this.jobInfoCareerForm.get('infoEmployeeGroup').value,
                    sub_group: this.jobInfoCareerForm.get('infoEmployeeSubgroup').value,
                    report_to: this.jobInfoCareerForm.get('infoReportToName').value.split(" - ")[0],
                    report_to_name: this.jobInfoCareerForm.get('infoReportToName').value.split(" - ")[1],
                }
            }
            
            let addInfoCareer = this._POST_api_Service.POST_data(this.typeJobPostAct == 'edit' || this.canEditPage ? this.jobProfByIdU : this.jobProfByIdC, dataPost);
            let ret = addInfoCareer.subscribe(dataRes => {
                // this.routers.navigate(['admin/job/advertisement/new-career/detail', dataRes.length > 0 ? dataRes[0].Position_ID : this.jobInfoCareerForm.get('infoPosId').value]);
                
                if(!this.canEditPage){
                    this.jobInfoCareerForm.patchValue({
                        infoPosId: dataRes[0].Position_ID,
                    });

                    this.routers.navigate(['admin/job/advertisement/new-career/edit', dataRes[0].Position_ID], { queryParams: { note: 1 } });
                
                }

                this.loading = true;
                this.canEditPage = true;
                this.typeJobPostAct = 'edit';

                this.getJobDetailData(dataRes.length > 0 ? dataRes[0].Position_ID : this.jobInfoCareerForm.get('infoPosId').value);
                this.getRequestor();
                this.declareInputField();

                this.loading = false;
                this.loadingSubmit = false;
            },
                error => {
                    console.log('[ERROR + Failed to submit data: ' + error);
                }
            )
        } else {
            let j = this.jobInfoCareerForm;
            if(j.controls['infoPosName'].status == 'INVALID') $('#errInfoPosName').removeClass("m--hide"); else $('#errInfoPosName').addClass("m--hide");
            if(j.controls['infoCompany'].status == 'INVALID') $('#errInfoCompany').removeClass("m--hide"); else $('#errInfoCompany').addClass("m--hide");
            if(j.controls['infoLOB'].status == 'INVALID') $('#errInfoLOB').removeClass("m--hide"); else $('#errInfoLOB').addClass("m--hide");
            if(j.controls['infoDivision'].status == 'INVALID') $('#errInfoDivision').removeClass("m--hide"); else $('#errInfoDivision').addClass("m--hide");
            if(j.controls['infoBuilding'].status == 'INVALID') $('#errInfoBuilding').removeClass("m--hide"); else $('#errInfoBuilding').addClass("m--hide");
            if(j.controls['infoCity'].status == 'INVALID') $('#errInfoCity').removeClass("m--hide"); else $('#errInfoCity').addClass("m--hide");
            if(j.controls['infoRegion'].status == 'INVALID') $('#errInfoRegion').removeClass("m--hide"); else $('#errInfoRegion').addClass("m--hide");
            if(j.controls['infoBand'].status == 'INVALID') $('#errInfoBand').removeClass("m--hide"); else $('#errInfoBand').addClass("m--hide");
            if(j.controls['infoCluster'].status == 'INVALID') $('#errInfoCluster').removeClass("m--hide"); else $('#errInfoCluster').addClass("m--hide");
            if(j.controls['infoFamily'].status == 'INVALID') $('#errInfoFamily').removeClass("m--hide"); else $('#errInfoFamily').addClass("m--hide");
            if(j.controls['infoEmployeeGroup'].status == 'INVALID') $('#errInfoEmployeeGroup').removeClass("m--hide"); else $('#errInfoEmployeeGroup').addClass("m--hide");
            if(j.controls['infoEmployeeSubgroup'].status == 'INVALID') $('#errInfoEmployeeSubgroup').removeClass("m--hide"); else $('#errInfoEmployeeSubgroup').addClass("m--hide");
            if(j.controls['infoReportToName'].status == 'INVALID') $('#errReportToName').removeClass("m--hide"); else $('#errReportToName').addClass("m--hide");
        }

    }

    loadFilter(profile){
        this.loading = false;
        this.getMaster();
        this.jobInfoCareerForm = new FormGroup({
            infoPosId: new FormControl(),
            infoPosName: new FormControl('', Validators.required),
            infoCompany: new FormControl('', Validators.required),
            infoLOB: new FormControl('', Validators.required),
            infoDivision: new FormControl('', Validators.required),
            infoBuilding: new FormControl('', Validators.required),
            infoCity: new FormControl('', Validators.required),
            infoRegion: new FormControl('', Validators.required),
            infoBand: new FormControl('', Validators.required),
            infoCluster: new FormControl('', Validators.required),
            infoFamily: new FormControl(''),
            infoEmployeeGroup: new FormControl('', Validators.required),
            infoEmployeeSubgroup: new FormControl('', Validators.required),
            infoReportToName: new FormControl('', Validators.required)
        });
        this.jobInfoCareerForm.setValue({
            infoPosId: profile.Position_ID != '' ? profile.Position_ID : 0,
            infoPosName: profile.Positions != '' ? profile.Positions : "",
            infoCompany: profile.Company != '' ? profile.Company : "",
            infoLOB: profile.LOB_Desc != '' ? profile.LOB_Desc : "",
            infoDivision: profile.Org_Unit_Department != '' ? profile.Org_Unit_Department : "",
            infoBuilding: profile.Building != '' ? profile.Building : "",
            infoCity: profile.City != '' ? profile.City : "",
            infoRegion: profile.Region_Desc != '' ? profile.Region_Desc : "",
            infoBand: profile.GrMin != '' ? profile.GrMin : "",
            infoCluster: profile.Job_Abbr != '' ? profile.Job_Abbr : "",
            infoFamily: profile.Job != '' ? profile.Job : "",
            infoEmployeeGroup: profile.Employee_group != '' ? profile.Employee_group : "",
            infoEmployeeSubgroup: profile.Employee_subgroup != '' ? profile.Employee_subgroup : "",
            infoReportToName: profile.Holder_Pernr != '' ? profile.Holder_Pernr + ' - ' + profile.Holder_Name : "",
        });

        setTimeout(function() {
            $("input.search").val(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
            $("#reportName").val(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
            this.selectedReportName(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
        }.bind(this), 1000);
    }

    posNameErr = false;
    keyInfoPosName() {
        if (this.jobInfoCareerForm.get('infoPosName').value.length < 1) {
            this.posNameErr = true;
        }
        else {
            this.posNameErr = false;
            $("#errInfoPosName").addClass("m--hide").show();
        }
    }

    getJobDetail(dataID = null) {
        var newPosId = this.route.snapshot.paramMap.get('id');
        if((this.routers.url).split("/").pop() == 'create' && dataID != null){
            newPosId = dataID;
            this.thisPodId = dataID;
        }
        this.posId2 = newPosId;
        let data = {
            positionId: newPosId //this.posId2
        }
        return this._POST_api_Service.POST_data(this.getJobDataAPI, data);
    }

    advDisableMsg = JDVars.advDisableMsg;
    showAdvDisableMsg = false;
    errLoadData = JDVars.errLoadData;
    getJobDetailData(dataID = null) {
        this.getJobDetail(dataID).subscribe(data => {
            this.data = data;
            this.loading = false;

            if(this.routers.url.substring(0, this.routers.url.lastIndexOf('/')) == '/admin/job/advertisement/new-career/detail' || dataID != null){
                this.loadFilter(this.data.profile[0]);
                this.initInputField(this.data);
            } 

            if(this.routers.url.substring(0, this.routers.url.lastIndexOf('/')) == '/admin/job/advertisement/new-career/edit'){
                this.loadFilter(this.data.profile[0]);
                this.initInputField(this.data);

                if(this.route.snapshot.queryParams['note'] == 1){
                    setTimeout(function() {
                        console.log('abc')
                        let element = document.getElementById('purpOn');
                        console.log(element)
                        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                    }.bind(this), 500);
                }
            }
        },
        error => {
            this.showAlert('alertError');
            // this._alertService.error(error);
            this._alertService.error(this.errLoadData);
            console.log('[ERROR] Adv Details: ' + error);
            this.loading = false;
        })

        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase());
        let roleArr = usrRole.split(",");
        for (let i = 0; i < roleArr.length; i++) {
            roleArr[i] = roleArr[i].trim();
        }
        /*
        ** 20181107 - New requirement - all level can update
        ** 
        if ((roleArr.indexOf('3') >= 0) || (roleArr.indexOf('1') >= 0 && roleArr.indexOf('3') >= 0)) {
            this.canUpdPosDesc = true;
        } */
        this.canUpdPosDesc = true;
        /*switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
            case 'HCBD':
            case 'ADMINHCBO,HCBD': this.canUpdPosDesc=true;
            break;
        }*/
    }

    masterListAPI = JDVars.masterList;
    optMasterList; bandDt; buildingDt; cityDt; clusterDt; companyDt;
    divisionDt; familyDt; groupDt; lobDt; regionDt; subgroupDt;
    getMaster() {
        // let comClusterListSend = this._GET_api_Service.GET_data(this.requestorListAPI);
        this._GET_api_Service.GET_data(this.masterListAPI).subscribe(data => {
            this.optMasterList = data;
            this.bandDt = this.optMasterList.band;
            this.buildingDt = this.optMasterList.building;
            this.cityDt = this.optMasterList.city;
            this.clusterDt = this.optMasterList.cluster;
            this.companyDt = this.optMasterList.company;
            this.divisionDt = this.optMasterList.division;
            this.familyDt = this.optMasterList.family;
            this.groupDt = this.optMasterList.group;
            this.lobDt = this.optMasterList.lob;
            this.regionDt = this.optMasterList.region;
            this.subgroupDt = this.optMasterList.sub_group;
        },
            error => console.log('[ERROR - Get Master List] ' + error),
        );
    }

    selReportName: any = '';
    reportNameErr = false;
    selectedReportName(user) {
        if (!user) {
            this.reportNameErr = true;
        }
        else {
            this.reportNameErr = false;
            this.selReportName = user;
            $("#reportName").val(this.selReportName);
        }
    }

    timer = null;loadCtc = false;
    onNameKeyDownRTN(event: any) {
        this.loadCtc = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (event.target.value.length > 2) {
                this.searchUser(event.target.value, 1);
            }
        }, 500);
    }

    reportNameDt: any = [];
    APISearchUser = JDVars.APISearchUser;
    searchUser(name, type) {
        let results = [];
        this._POST_api_Service.POST_data(this.APISearchUser, { text: name }).subscribe(dataRes => {
            if (dataRes.results) {
                if (dataRes.results.length < 1) {
                    console.log("0");
                } else if (dataRes.results.length > 10) {
                    results = dataRes.results.slice(0, 10);
                } else { results = dataRes.results; }

                for (let i = 0; i < results.length; i++) {
                    this.reportNameDt.push(results[i].search);
                }
            }
            this.loadCtc = false;
        },
            error => { console.log('[ERROR: Extraordinaire Project Lead Search User]', error); })
    }

    requestorListAPI = JDVars.requestorList;
    optReq: Requestor = new Requestor();
    optReqList = Array<reqArr>();   
    getRequestor() {
        let comClusterListSend = this._GET_api_Service.GET_data(this.requestorListAPI);
        this._GET_api_Service.GET_data(this.requestorListAPI).subscribe(data => {
            this.optReqList = data;
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
        this.optAppList3.push("External (Career@TM)");
        this.optAppList3.push("Internal (ERA)");
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-career-adv-detail',
            [
                //'assets/js/app.js',
                'assets/js/jobs/job-details-form.js',
                'assets/js/jobs/job-details-alert.js',
                'assets/js/main/bootstrap-select.js'
            ]);
        Dropzone._autoDiscoverFunction();
    }

    // PURPOSE
    // :start update purpose
    updPurposeForm: FormGroup;
    editedPurpose = false;
    updPurposeStyle: string;
    //postUpdatePurposeAPI = this.apiUrl + JDVars.jobUpdPurpose + this.token;
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
                this.pnlHead = " "; this.pnlBody = " show";
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

    // TAGS SKILLSET
    // :start tags skillset
    skillError = false;
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
    // :end tags skillset

    // QUALIFICATION
    // :start get qualification category name
    findQuaName(quaIdx) {
        let myObj = this.quaList.find(x => x.id == quaIdx);
        // if (myObj == null)
        //     myObj['name'] = '';
        return myObj['name'];
    }
    // :start add/update qualification
    updQualificationForm: FormGroup;
    // display add/update form
    updFormQuaTitle: string;
    updateQua(idx, cat, area, subArea) {
        if (idx == 0) {
            this.updFormQuaTitle = 'New ';
        } else {
            this.updFormQuaTitle = 'Update ';
        }
        this.updQualificationForm.setValue({ updQuaIdx: idx, updQuaCat: cat, updQuaArea: area, updQuaSubArea: subArea });
    }
    // submit add/update qualification form
    editedQua = false;
    addQuaStyle: string;
    //postAddQualificationAPI = this.apiUrl + JDVars.jobAddQua + this.token;
    //postUpdateQualificationAPI = this.apiUrl + JDVars.jobUpdQua + this.token;
    quaApi: string;
    dataUpdQua: any = {};
    act: string;
    addQuaMsg: string;
    onQualificationFormSubmit(): void {
        if (this.updQualificationForm.get('updQuaIdx').value == 0) {
            //this.callQuaAdd(this.updQualificationForm.get('updQuaIdx').value,,
            this.quaApi = JDVars.jobAddQua;
            this.dataUpdQua = {
                positionId: this.posId2,
                qual: this.updQualificationForm.get('updQuaCat').value,
                area: this.updQualificationForm.get('updQuaArea').value,
                subArea: this.updQualificationForm.get('updQuaSubArea').value,
            }
            this.act = "Add";
        } else {
            //callQuaUpdate(this.updQualificationForm.get('updQuaIdx').value,this.updQualificationForm.get('updQuaCat').value,
            //this.updQualificationForm.get('updQuaArea').value,this.updQualificationForm.get('updQuaSubArea').value);
            this.quaApi = JDVars.jobUpdQua;
            this.dataUpdQua = {
                qualNo: this.updQualificationForm.get('updQuaIdx').value,
                qual: this.updQualificationForm.get('updQuaCat').value,
                area: this.updQualificationForm.get('updQuaArea').value,
                subArea: this.updQualificationForm.get('updQuaSubArea').value,
            }
            this.act = "Update";
        }
        let updQuaSend = this._POST_api_Service.POST_data(this.quaApi, this.dataUpdQua);

        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataUpdQua = dataQuaRes;
            if (this.dataUpdQua.status == "OK") {
                this.addQuaMsg = 'Successfully ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addQuaMsg = 'Fail to ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-danger ";
            }
            this.editedQua = true;
            setTimeout(function() {
                this.editedQua = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end add/update qualification
    // :start delete qualification
    delQualificationForm: FormGroup;
    // view confirmation
    delQua(idx) {
        this.delQualificationForm.setValue({ delQuaIdx: idx });
    }
    // delete function
    //postDeleteQualificationAPI = this.apiUrl + JDVars.jobDelQua + this.token;
    onDelQualificationFormSubmit(): void {
        this.act = "Delete";
        this.quaApi = JDVars.jobDelQua;
        this.dataUpdQua = {
            qualNo: this.delQualificationForm.get('delQuaIdx').value
        }
        let updQuaSend = this._POST_api_Service.POST_data(this.quaApi, this.dataUpdQua);
        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataUpdQua = dataQuaRes;
            if (this.dataUpdQua.status == "OK") {
                this.addQuaMsg = 'Successfully ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addQuaMsg = 'Fail to ' + this.act + ' Job Qualification';
                this.addQuaStyle = " alert-danger ";
            }
            this.editedQua = true;
            setTimeout(function() {
                this.editedQua = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: delete qualification

    // AOR
    // start: Add/Update AOR
    updAorForm: FormGroup;
    updFormAorTitle: string;
    // display form
    updateAor(idx, aor, aorKey) {
        if (idx == 0) {
            this.updFormAorTitle = 'New ';
        } else {
            this.updFormAorTitle = 'Update ';
        }
        this.updAorForm.setValue({ updAorIdx: idx, updAor: aor, updKeyAct: aorKey });
    }
    editedAor = false;
    updAorStyle: string;
    jobAddAor = JDVars.jobAddAor;
    //postAddAorAPI = this.apiUrl + this.jobAddAor + this.token;
    jobUpdateAor = JDVars.jobUpdAor;
    //postUpdateAorAPI = this.apiUrl + this.jobUpdateAor + this.token;
    aorApi: string;
    addAorMsg: string;
    dataUpdAor: any = {};
    onAorFormSubmit(): void {
        if (this.updAorForm.get('updAorIdx').value == 0) {
            this.aorApi = this.jobAddAor;
            this.dataUpdAor = {
                positionId: this.posId2,
                aor: this.updAorForm.get('updAor').value,
                act: this.updAorForm.get('updKeyAct').value,
            }
            this.act = "Add";
        } else {
            this.aorApi = this.jobUpdateAor;
            this.dataUpdAor = {
                aorNo: this.updAorForm.get('updAorIdx').value,
                aor: this.updAorForm.get('updAor').value,
                act: this.updAorForm.get('updKeyAct').value
            }
            this.act = "Update";
        }

        let updAorSend = this._POST_api_Service.POST_data(this.aorApi, this.dataUpdAor);

        let ret = updAorSend.subscribe(dataAorRes => {
            this.dataUpdAor = dataAorRes;
            if (this.dataUpdAor.status == "OK") {
                this.addAorMsg = 'Successfully ' + this.act + ' Area of Responsibilies';
                this.updAorStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addAorMsg = 'Fail to ' + this.act + ' Area of Responsibilies';
                this.updAorStyle = " alert-danger ";
            }
            this.editedAor = true;
            setTimeout(function() {
                this.editedAor = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: Add/Update AOR
    // end: delete AOR
    delAorForm: FormGroup;
    // open model and set value
    delAor(idx) {
        this.delAorForm.setValue({ delAorIdx: idx });
    }
    jobDeleteAor = JDVars.jobDelAor;
    //postDeleteAorAPI = this.apiUrl + this.jobDeleteAor + this.token;
    onDelAorFormSubmit(): void {
        this.act = "Delete";
        this.aorApi = this.jobDeleteAor;
        this.dataUpdAor = {
            aorNo: this.delAorForm.get('delAorIdx').value
        }
        let updAorSend = this._POST_api_Service.POST_data(this.aorApi, this.dataUpdAor);
        let ret = updAorSend.subscribe(dataAorRes => {
            this.dataUpdAor = dataAorRes;
            if (this.dataUpdAor.status == "OK") {
                this.addAorMsg = 'Successfully ' + this.act + ' Area of Responsibility';
                this.updAorStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addAorMsg = 'Fail to ' + this.act + ' Area of Responsibility';
                this.updAorStyle = " alert-danger ";
            }
            this.editedAor = true;
            setTimeout(function() {
                this.editedAor = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: delete AOR

    // REQUIREMENT/EXPERIENCE
    // start: Add/Update Requirement/Experience
    updReqForm: FormGroup;
    private jobAddReq = JDVars.jobAddExp;
    //private postAddReqAPI = this.apiUrl + this.jobAddReq + this.token;
    private jobUpdateReq = JDVars.jobUpdExp;
    updFormReqTitle: string;
    // display form
    updateReq(idx, req, year) {
        if (idx == 0) {
            this.updFormReqTitle = 'New ';
        } else {
            this.updFormReqTitle = 'Update ';
        }
        this.updReqForm.setValue({ updReqIdx: idx, updReqArea: req, updReqYear: year });

    }
    // submit form
    editedReq = false;
    updReqStyle: string;
    reqApi: string;
    addReqMsg: string;
    dataUpdReq: any = {};
    onReqFormSubmit(): void {
        if (this.updReqForm.get('updReqIdx').value == 0) {
            this.reqApi = this.jobAddReq;//this.postAddReqAPI;
            this.dataUpdReq = {
                positionId: this.posId2,
                area: this.updReqForm.get('updReqArea').value,
                years: this.updReqForm.get('updReqYear').value,
            }
            this.act = "Add";
        } else {
            this.reqApi = this.jobUpdateReq;
            this.dataUpdReq = {
                expNo: this.updReqForm.get('updReqIdx').value,
                area: this.updReqForm.get('updReqArea').value,
                years: this.updReqForm.get('updReqYear').value
            }
            this.act = "Update";
        }

        let updReqSend = this._POST_api_Service.POST_data(this.reqApi, this.dataUpdReq);
        let ret = updReqSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.status == "OK") {
                this.addReqMsg = 'Successfully ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addReqMsg = 'Fail to ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-danger ";
            }
            this.editedReq = true;
            setTimeout(function() {
                this.editedReq = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: Add/Update Requirement/Experience
    // start: Delete Requirement/Experience
    delReqForm: FormGroup;
    // private postUpdateReqAPI = this.apiUrl + this.jobUpdateReq + this.token;
    private jobDeleteReq = JDVars.jobDelExp;
    //private postDeleteReqAPI = this.apiUrl + this.jobDeleteReq + this.token;
    delReq(idx) {
        this.delReqForm.setValue({ delReqIdx: idx });
    }
    onDelReqFormSubmit(): void {
        this.act = "Delete";
        this.reqApi = this.jobDeleteReq;
        this.dataUpdReq = {
            expNo: this.delReqForm.get('delReqIdx').value
        }
        let updReqSend = this._POST_api_Service.POST_data(this.reqApi, this.dataUpdReq);
        let ret = updReqSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.status == "OK") {
                this.addReqMsg = 'Successfully ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addReqMsg = 'Fail to ' + this.act + ' Experience Requirement';
                this.updReqStyle = " alert-danger ";
            }
            this.editedReq = true;
            setTimeout(function() {
                this.editedReq = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: Delete Requirement/Experience

    // FUNCTIONAL COMPETENCIES
    // :Start Func com
    updFuncComForm: FormGroup;
    tglFuncComFam = false; tglFuncComDesc = false; noDescData = false;
    updFuncCom = false;

    // :start tech com
    editedTechCom = false; // Add/Update message display
    // Add/Update Tech Com
    updTechComForm: FormGroup;
    tglTectComCat = false; tglTectComCom = false; tglTectComComDef = false;
    // tglTectComCat = true; tglTectComCom = true; tglTectComComDef = true;
    // Display tech comp list. for unavailable category
    findTecComCat(idx) {
        if ((idx.match(this.comCatOptDef) !== null) || (idx.match('0') !== null)) {
            return 'N/A';
        } else {
            return idx;
        }
    }

    funcChangeUpdCat() {
        this.errLevel2 = true;
        let clusid;
        let clusSel = this.updFuncComForm.get('updFuncComClusIdOpt').value;
        let comIdx = this.updFuncComForm.get('updFuncComIdx').value;

        let index = this.funcClusterList.findIndex(x => x.name == clusSel);

        clusid = this.funcClusterList[index].id;

        if (clusid != 0 && clusSel.match(this.funcCatOptDef) === null) {

            this.populateFcFamily(clusid);

            this.updFuncComForm.setValue({
                updFuncComClusIdOpt: clusSel,
                updFuncComIdx: comIdx,
                updFuncComFamOpt: this.comFuncFamily,
                updFuncComDescOpt: this.comFuncDesc
            })

        }
        else {
            this.tglFuncComFam = false;
            this.tglFuncComDesc = false; this.noDescData = false;
            this.descSelected = false;

            this.updFuncComForm.setValue({ //Reset all form value
                updFuncComClusIdOpt: this.comCatOptDef,
                updFuncComIdx: comIdx,
                updFuncComFamOpt: this.comFuncFamily,
                updFuncComDescOpt: this.comFuncDesc
            })


        }

    }
    jobFcFamilyAPI = JDVars.jobFcFamilyAPI;
    funcFamData;
    populateFcFamily(clusId) {
        this.funcFamList = Array<funcFamArr>();
        let data2 = {
            CLUSTER_ID: clusId
        }
        console.log(this.jobFcFamilyAPI)
        this._POST_api_Service.POST_data(this.jobFcFamilyAPI, data2).subscribe(data => {
            this.funcFamData = data;
            if (this.funcFamData.length > 0) {
                this.tglFuncComFam = true; this.tglFuncComDesc = false;
                this.noDescData = false; this.descSelected = false;

                if (this.funcFamData[0].JF_ID === '0') {
                    this.tglFuncComFam = false;
                }
                this.funcFamList.push(new funcFamArr(0, this.funcFamOptDef));

                for (let j = 0; j < this.funcFamData.length; j = j + 1) {
                    this.funcFamList.push(new funcFamArr(this.funcFamData[j].JF_ID, this.funcFamData[j].JF_NAME));

                }
                this.funcFam = new FuncFam();
                this.funcFam.funcFam = new funcFamArr(0, this.funcFamOptDef);
            }
        })

    }

    // :start populate functional competency on family changed
    funcChangeFamily() {
        this.errLevel2 = true;

        let clusSel = this.updFuncComForm.get('updFuncComClusIdOpt').value;
        let comIdx = this.updFuncComForm.get('updFuncComIdx').value;
        let f_name = this.updFuncComForm.get('updFuncComFamOpt').value;

        let index = this.funcFamList.findIndex(x => x.name == f_name);

        let fam_id = this.funcFamList[index].id;

        if (fam_id != 0 && f_name.match(this.funcFamOptDef) === null) {

            this.populateFcDesc(fam_id);

            this.updFuncComForm.setValue({
                updFuncComClusIdOpt: clusSel,
                updFuncComIdx: comIdx,
                updFuncComFamOpt: f_name,
                updFuncComDescOpt: this.comFuncDesc
            })
        }
        else {
            this.tglFuncComDesc = false; this.noDescData = false;
            this.descSelected = false;

            this.updFuncComForm.setValue({ //Reset all form value
                updFuncComClusIdOpt: clusSel,
                updFuncComIdx: comIdx,
                updFuncComFamOpt: this.comFuncFamily,
                updFuncComDescOpt: this.comFuncDesc
            })
        }

    }

    jobFcFamilyDescAPI = JDVars.jobFcFamilyDescAPI;
    funcFamDescData;
    populateFcDesc(fam_id) {
        this.funcFamDescList = Array<funcFamDescArr>();
        let data2 = {
            JF_ID: fam_id
        }

        this._POST_api_Service.POST_data(this.jobFcFamilyDescAPI, data2).subscribe(data => {
            this.funcFamDescData = data;

            if (this.funcFamDescData.length > 0) {
                this.tglFuncComDesc = true; this.noDescData = false; this.descSelected = false;

                this.funcFamDescList.push(new funcFamDescArr(0, this.funcDescOptDef, ""));

                for (let j = 0; j < this.funcFamDescData.length; j = j + 1) {
                    this.funcFamDescList.push(new funcFamDescArr(
                        this.funcFamDescData[j].COMP_ID,
                        this.funcFamDescData[j].FC_NAME,
                        this.funcFamDescData[j].FC_DEF,
                    ));

                }
                this.funcFamDesc = new FuncFamDesc();
                this.funcFamDesc.funcFamDesc = new funcFamDescArr(0, this.funcFamOptDef, "");
            }
            else {
                this.noDescData = true;
            }
        })
    }

    discription; descSelected = false;
    funcChangeFamilyDesc() {
        let clusSel = this.updFuncComForm.get('updFuncComClusIdOpt').value;
        let comIdx = this.updFuncComForm.get('updFuncComIdx').value;
        let f_name = this.updFuncComForm.get('updFuncComFamOpt').value;
        let desc_name = this.updFuncComForm.get('updFuncComDescOpt').value;

        let index = this.funcFamDescList.findIndex(x => x.name == desc_name);

        let disc_id = this.funcFamDescList[index].id;

        if (disc_id != 0 && f_name.match(this.funcDescOptDef) === null) {
            this.discription = this.funcFamDescList[index].desc;
            this.descSelected = true;
            if (this.tglFuncComFam && this.tglFuncComDesc && this.descSelected && !this.noDescData)
                this.errLevel2 = false;
        }
        else {
            this.descSelected = false;
            this.errLevel2 = true;
        }
    }

    // :start populate category on cluster on changed
    clusChangedUpdCat() {
        this.errLevel = true;
        let clusSel = this.updTechComForm.get('updTechComClusIdOpt').value;
        let comIdx = this.updTechComForm.get('updTechComIdx').value;
        //console.log(clusSel);
        if (clusSel.match(this.comClusOptDef) === null) {
            this.populateCategory(clusSel);
            // {TODO HIDE BALIK YG TAK BERKENAAN} this.tglTectComCat = true;   this.tglTectComCom = false;  this.editedTechCom = false; this.tglTectComComDef = false;            
            this.updTechComForm.setValue({// RESET SEMUA FORM VALUE EXCEPT updTechComClusIdOpt
                updTechComClusIdOpt: clusSel, updTechComIdx: comIdx, updTechComCatOpt: this.comCatOptDef,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef, updTechComLvlHidden: ""
            });
        } else {
            this.tglTectComCat = false; this.tglTectComCom = false; this.tglTectComComDef = false;
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: this.comClusOptDef, updTechComIdx: comIdx, updTechComCatOpt: this.comCatOptDef,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef, updTechComLvlHidden: ""
            });
        }
    }
    jobOptCatTechCom = JDVars.jobOptCatTechCom;
    //getOptCatTechComAPI = this.apiUrl + this.jobOptCatTechCom + this.token;
    populateCategory(clusSel) {
        let currClusId = this.updTechComForm.get('updTechComClusIdOpt').value;
        this.comCatList = Array<comCatArr>();
        let data2 = {
            clusterId: currClusId
        }
        let comCatListSend = this._POST_api_Service.POST_data(this.jobOptCatTechCom, data2);
        let cnC = 1;
        let defComCat: 1;
        let defComCatName: string;
        let retOptCat = comCatListSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.length > 0) {
                this.tglTectComCat = true; this.tglTectComCom = false; this.tglTectComComDef = false;
                if (this.dataUpdReq[0].CATEGORY === '0') {
                    this.tglTectComCat = false;
                }
                this.comCatList.push(new comCatArr(0, this.comCatOptDef));
                for (let j = 0; j < this.dataUpdReq.length; j = j + 1) {
                    if (this.dataUpdReq[j].CATEGORY !== '0') {
                        let k = j + 1;
                        this.comCatList.push(new comCatArr(k, this.dataUpdReq[j].CATEGORY));
                        /* test if (j == 0) {
                            defComCat = 1;
                            defComCatName = this.dataUpdReq[j].CATEGORY;
                        }   */
                        //this.updTechComForm.setValue({ updTechComClusIdOpt: '-- Select Category --' });
                        //this.comCatList=this.comCatArr(0);

                    } else {
                        // {todo} - disable select competency
                        //this.tglTectComCat = false;
                        //this.tglTectComCom = true;
                        //this.populateCategory(currClusId, "0");
                        //this.populateCategory(clusterId, selCat);
                        this.tglTectComCom = true;
                        this.populateCompetency(clusSel, "0");
                    }
                }
                this.comCat = new ComCat();
                this.comCat.comCat = new comCatArr(0, this.comCatOptDef);
                //console.log(this.comCat.comCat.name);
            }
            //else {
            //    this.comClusterList.push(new comCatArr(0, 'Fail to Fetch Data'));
            //}
        })
    }
    // :end populate category on cluster on changed

    // :start populate competency on category on changed
    catChangedUpdCom(this) {
        this.errLevel = true;
        let clusterId = this.updTechComForm.get('updTechComClusIdOpt').value;
        let selCat = this.updTechComForm.get('updTechComCatOpt').value;
        let comIdx = this.updTechComForm.get('updTechComIdx').value;
        //console.log(selCat);
        if (selCat.match(this.comCatOptDef) === null) {
            this.tglTectComCom = true;
            this.populateCompetency(clusterId, selCat);
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: clusterId, updTechComIdx: comIdx, updTechComCatOpt: selCat,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
        } else {
            // {TODO} tutup yg lain    
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: clusterId, updTechComIdx: comIdx, updTechComCatOpt: this.comCatOptDef,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
        }
    }
    jobOptComTechCom = JDVars.jobOptComTechCom;
    // getOptComTechComAPI = this.apiUrl + this.jobOptComTechCom + this.token;
    populateCompetency(clusterId, selCat) {
        //console.log(clusterId);         console.log(selCat);
        this.comComList = Array<comComArr>();
        let data2 = {
            clusterId: clusterId, //this.updTechComForm.get('updTechComClusIdOpt').value,
            categoryId: selCat, //this.updTechComForm.get('updTechComCatOpt').value
        }
        // let comComListSend = this.POSTMethodByAPI(this.getOptComTechComAPI, data2);
        let comComListSend = this._POST_api_Service.POST_data(this.jobOptComTechCom, data2);
        let cnC = 1;
        let defComCom: 1;
        let defComComName: string;
        let retOptCom = comComListSend.subscribe(dataReqRes => {
            this.dataUpdReq = dataReqRes;
            if (this.dataUpdReq.length > 0) {
                this.tglTectComCom = true;
                this.comComList.push(new comComArr(0, this.comCompOptDef));
                for (let j = 0; j < this.dataUpdReq.length; j = j + 1) {
                    let k = j + 1;
                    this.comComList.push(new comComArr(k, this.dataUpdReq[j].COMP_NAME));
                }
                this.comCom = new ComCom();
                this.comCom.comCom = new comComArr(0, this.comCompOptDef);
            } //else {
            //  this.comComList.push(new comComArr(0, 'Fail to Fetch Data'));
            //}
        })
    }
    // :end populate competency on category on changed

    // :start populate competency def & show level on category on changed
    comChangedUpdDef(this) {
        this.errLevel = true;
        let selClus = this.updTechComForm.get('updTechComClusIdOpt').value;
        let selCat = this.updTechComForm.get('updTechComCatOpt').value;
        let selCom = this.updTechComForm.get('updTechComComOpt').value;
        let selComDefinition = this.updTechComForm.get('updTechComDef').value;
        let comIdx = this.updTechComForm.get('updTechComIdx').value;
        if (selCom.match(this.comComDef) === null) {
            //console.log('DEFAULT');            
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: selClus, updTechComIdx: comIdx, updTechComCatOpt: selCat,
                updTechComComOpt: this.comCompOptDef, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
        } else {
            //console.log('NOT DEFAULT');            
            this.updTechComForm.setValue({ // RESET ALL FORM VALUE
                updTechComClusIdOpt: selClus, updTechComIdx: comIdx, updTechComCatOpt: selCat,
                updTechComComOpt: selCom, updTechComDef: "", updTechComLvl: this.comLvlOptDef,
                updTechComLvlHidden: ""
            });
            this.populateComDef(selClus, selCom, selCat);
        }
    }
    jobOptDefTechCom = JDVars.jobOptDefTechCom;
    //getOptDefTechComAPI = this.apiUrl + this.jobOptDefTechCom + this.token;
    populateComDef(selClus, selCom, selCat) {
        if (selCom.match(this.comCompOptDef) !== null) {
            //console.log("DEFAULT");
            //this.tglTectComComDef = false;
        } else {
            if (selCat.match(this.comCatOptDef) !== null) {
                selCat = "0";
            }
            //console.log(selClus);console.log(selCat);console.log(selCom);
            let data2 = {
                clusterId: selClus,
                categoryId: selCat,
                compName: selCom,
            }
            // let comComListSend = this.POSTMethodByAPI(this.getOptDefTechComAPI, data2);
            let comComListSend = this._POST_api_Service.POST_data(this.jobOptDefTechCom, data2);
            let cnC = 1;
            let defComCom: 1;
            let defComComName: string;
            let selLvl = this.updTechComForm.get('updTechComLvl').value;
            if (selLvl.match(this.comLvlOptDef) !== null) {
                selLvl = '';
            }
            let retOptCom = comComListSend.subscribe(dataReqRes => {
                this.dataUpdReq = dataReqRes;
                this.comComDef = "";
                this.tglTectComComDef = true;
                if (this.dataUpdReq.length > 0) {
                    this.updTechComForm.setValue({
                        updTechComDef: this.dataUpdReq[0].COMP_DEF, updTechComIdx: this.updTechComForm.get('updTechComIdx').value,
                        updTechComCatOpt: this.updTechComForm.get('updTechComCatOpt').value, updTechComComOpt: this.updTechComForm.get('updTechComComOpt').value,
                        updTechComClusIdOpt: this.updTechComForm.get('updTechComClusIdOpt').value, updTechComLvl: this.updTechComForm.get('updTechComLvl').value,
                        updTechComLvlHidden: selLvl
                    });
                }
            })
        }
    }
    // :end populate competency def on category on changed

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

    // Submit Add Func Com
    updateFuncCom(idx, fcClusId, fcFamily, fcDesc) {

        this.updFuncComForm.setValue({
            updFuncComClusIdOpt: this.funcCatOptDef,
            updFuncComIdx: idx,
            updFuncComFamOpt: fcFamily,
            updFuncComDescOpt: fcDesc
        })

        this.tglFuncComFam = false; this.tglFuncComDesc = false;
        this.descSelected = false; this.noDescData = false;
    }

    // Submit Add Func Com
    addFuncComMsg: string;
    addFuncComStyle: string;
    dataAddFuncCom: any = {};
    addFuncComAPI = JDVars.jobAddFunc;
    onFuncComFormSubmit() {
        this.act = "Add";
        let positionId = this.thisPodId;
        let compName = this.updFuncComForm.get('updFuncComDescOpt').value;

        let index = this.funcFamDescList.findIndex(x => x.name == compName);
        let compId = this.funcFamDescList[index].id;

        let dataAdd = {
            positionId: positionId,
            compId: compId
        }

        let addFuncCom = this._POST_api_Service.POST_data(this.addFuncComAPI, dataAdd);

        let ret = addFuncCom.subscribe(dataFuncComRes => {
            this.dataAddFuncCom = dataFuncComRes;
            if (this.dataAddFuncCom.status == "OK") {
                this.addFuncComMsg = 'Successfully ' + this.act + ' Functional Competencies';
                this.addFuncComStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addFuncComMsg = 'Fail to ' + this.act + ' Functional Competencies';
                this.addFuncComStyle = " alert-danger ";
            }
            this.updFuncCom = true;
            setTimeout(function() {
                this.updFuncCom = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })

    }

    // Submit Add Tech Com
    updateTechCom(idx, clusId, comCat, comName, comDef, comLvl) {
        let clusIdStr: string;
        if (clusId == 0) {
            clusIdStr = this.comClusOptDef;
        }
        this.updTechComForm.setValue({
            updTechComClusIdOpt: clusIdStr, updTechComIdx: idx,
            updTechComCatOpt: comCat, updTechComComOpt: comName, updTechComDef: comDef,
            updTechComLvl: comLvl, updTechComLvlHidden: comLvl
        });
        this.tglTectComCat = false; this.tglTectComCom = false; this.tglTectComComDef = false;
    }
    // :start submit add tech com
    addTechComStyle: string;
    techComApi: string;
    addTechComMsg: string;
    dataUpdTechCom: any = {};
    private jobAddTechCom = JDVars.jobAddTech;
    //private postAddTechComAPI = this.apiUrl + this.jobAddTechCom + this.token;
    private jobUpdateTechCom = JDVars.jobUpdTech;
    //private postUpdateTechComAPI = this.apiUrl + this.jobUpdateTechCom + this.token;

    onTechComFormSubmit(): void {
        let clusId = this.updTechComForm.get('updTechComClusIdOpt').value;
        let catId = this.updTechComForm.get('updTechComCatOpt').value;
        if (catId.match(this.comCatOptDef) !== null) {
            catId = "0";
        }
        if (this.updTechComForm.get('updTechComIdx').value == 0) {
            this.techComApi = this.jobAddTechCom; // this.postAddTechComAPI;
            this.dataUpdTechCom = {
                positionId: this.posId2,
                clusterId: clusId,
                category: catId,
                compName: this.updTechComForm.get('updTechComComOpt').value,
                compDef: this.updTechComForm.get('updTechComDef').value,
                level: this.updTechComForm.get('updTechComLvl').value,
            }
            this.act = "Add";
        } else {
            this.techComApi = this.jobUpdateTechCom;//this.postUpdateTechComAPI;
            this.dataUpdTechCom = {
                tcNo: this.updTechComForm.get('updTechComIdx').value,
                clusterId: clusId,
                category: catId,
                compName: this.updTechComForm.get('updTechComComOpt').value,
                compDef: this.updTechComForm.get('updTechComDef').value,
                level: this.updTechComForm.get('updTechComLvl').value,
            }
            this.act = "Update";
        }

        //let updTechComSend = this.POSTMethodByAPI(this.techComApi, this.dataUpdTechCom);
        let updTechComSend = this._POST_api_Service.POST_data(this.techComApi, this.dataUpdTechCom);

        let ret = updTechComSend.subscribe(dataTechComRes => {
            this.dataUpdTechCom = dataTechComRes;
            if (this.dataUpdTechCom.status == "OK") {
                this.addTechComMsg = 'Successfully ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addTechComMsg = 'Fail to ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-danger ";
            }
            this.editedTechCom = true;
            setTimeout(function() {
                this.editedTechCom = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // end: submit tech com

    // delete func com
    delFuncComForm: FormGroup;

    delFuncComType;
    delFuncCom(idx, type) {
        this.delFuncComType = type;
        this.delFuncComForm.setValue({ delFuncComIdx: idx });
    }

    private delFuncComAPI = JDVars.jobDelFunc;
    onDelFuncComFormSubmit() {
        this.act = "Delete";
        let postData = {
            id: this.delFuncComForm.get('delFuncComIdx').value
        }


        let postDelFunc = this._POST_api_Service.POST_data(this.delFuncComAPI, postData);

        let ret = postDelFunc.subscribe(dataFuncRes => {
            let res = dataFuncRes;
            if (res.status == "OK") {
                this.addFuncComMsg = 'Successfully ' + this.act + ' Functional Competencies';
                this.addFuncComStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addFuncComMsg = 'Fail to ' + this.act + ' Functional Competencies';
                this.addFuncComStyle = " alert-danger ";
            }
            this.updFuncCom = true;
            setTimeout(function() {
                this.updFuncCom = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })

    }

    // delete tech com
    delTechCom(idx) {
        this.delTechComForm.setValue({ delTechComIdx: idx });
    }
    delTechComForm: FormGroup;
    //private jobDeleteTechCom = '/jobAdv/delJobTechnical';
    private postDeleteTechComAPI = JDVars.jobDelTech; //this.apiUrl + this.jobDeleteTechCom + this.token;
    onDelTechComFormSubmit(): void {
        this.act = "Delete";
        this.reqApi = this.postDeleteTechComAPI;
        this.dataUpdTechCom = {
            tcNo: this.delTechComForm.get('delTechComIdx').value
        }
        // let updTechComSend = this.POSTMethodByAPI(this.reqApi, this.dataUpdTechCom);
        let updTechComSend = this._POST_api_Service.POST_data(this.reqApi, this.dataUpdTechCom);

        let ret = updTechComSend.subscribe(dataTechComRes => {
            this.dataUpdTechCom = dataTechComRes; //dataReqRes;
            if (this.dataUpdTechCom.status == "OK") {
                this.addTechComMsg = 'Successfully ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-success ";
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
            } else {
                this.addTechComMsg = 'Fail to ' + this.act + ' Technical Competencies';
                this.addTechComStyle = " alert-danger ";
            }
            this.editedTechCom = true;
            setTimeout(function() {
                this.editedTechCom = false;
            }.bind(this), 3000); //wait 3 Seconds and hide
        })
    }
    // :end tech com

    // :start HCBD admin send advertisement for approval
    advPosForm: FormGroup;
    //disableSubmitAdv = true;
    errAdvPeriod = false;
    dataAdvPos: any = {};
    advPosMsg: string;
    advPosStyle: string;
    private postAdvertisePositionAPI = JDVars.jobPostAdv;

    disableSubmit() {
        this.disableSubmitAdv = false;
        /*let posStartDt2 = ((document.getElementById("advPosStartDt") as HTMLInputElement).value);
        console.log(posStartDt2);
        this.advPosForm.setValue({
            advPosIdx2: this.advPosForm.get('advPosIdx2').value,
            advPosRemark: this.advPosForm.get('advPosRemark').value,
            advPosStartDt: this.advPosForm.get('advPosStartDt').value,
            advPosEndDt: ((document.getElementById("advPosEndDt") as HTMLInputElement).value),
            advPosStartDt2: ((document.getElementById("advPosStartDt") as HTMLInputElement).value),
            advPosEndDt2: ((document.getElementById("advPosEndDt") as HTMLInputElement).value),
        })*/
    }
    onadvPosFormSubmit(): void {
        let advPosIdx2 = this.advPosForm.get('advPosIdx2').value;
        let posStartDt = this.advPosForm.get('advPosStartDt').value;
        let posEndDt = this.advPosForm.get('advPosEndDt').value;
        let posStartDt2 = '';//((document.getElementById("advPosStartDt") as HTMLInputElement).value); // <HTMLInputElement>document.getElementById("advPosStartDt2");//this.advPosForm.get('advPosStartDt2').value;
        let posEndDt2 = '';//((document.getElementById("advPosEndDt") as HTMLInputElement).value); // <HTMLInputElement>document.getElementById("advPosEndDt2");//this.advPosForm.get('advPosEndDt2').value;        
        let posRemark = this.advPosForm.get('advPosRemark').value;
        let posJobType = this.advPosForm.get('advPosJobType').value;
        let advPosRemarkCheckBox = this.advPosForm.get('advPosRemarkCheckBox').value;
        let generalMsg = ' Advertise Job Position #' + advPosIdx2;
        let advApi = this.postAdvertisePositionAPI;
        let posDtRange = ((document.getElementById("advPosDtRange") as HTMLInputElement).value);

        let advStartDt = posDtRange.substr(3, 2) + "-" + posDtRange.substr(0, 2) + "-" + posDtRange.substr(6, 4);
        let advEndDt = posDtRange.substr(17, 2) + "-" + posDtRange.substr(14, 2) + "-" + posDtRange.substr(20, 4);

        let advPosVacancy = this.advPosForm.get('advPosVacancy').value;
        let advPosRequestorArr = (this.advPosForm.get('advPosRequestor').value).split(" - ");
        let advPosRequestor = advPosRequestorArr[0];
        let advPosApproverArr = (this.advPosForm.get('advPosApprover').value).split(" - ");
        let advPosApprover = advPosApproverArr[0];

        if(posJobType == 'Internal (ERA)')
            posJobType = 1;
        else
            posJobType = 0;

        this.dataAdvPos = {
            position_id: advPosIdx2,
            vacancies: advPosVacancy,
            start: advStartDt, // posStartDt2,
            close: advEndDt, // posEndDt2,
            remark: posRemark,
            requester: advPosRequestor,
            approval: advPosApprover,
            // public: "Y",
            public: 0,
            share: "Y"
        }
        console.log(this.dataAdvPos)

        /**** REMARK SEKEJAP TODO NANTO REMOVE   */
        let updQuaSend = this._POST_api_Service.POST_data(advApi, this.dataAdvPos);
        let ret = updQuaSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            //console.log(this.dataAdvPos.status);
            if (this.dataAdvPos.status == "OK") {
                this.advPosMsg = 'Successfully' + generalMsg;
                this.advPosMsg += ' You will be redirected to Advertisement Tracking page shortly. ';
                this.advPosStyle = ' alert-success ';
                this.getJobDetailData(); // REFRESH DATA WITHOUT LOADING --
                this.editedAdvPos = true;
                setTimeout(function() {
                    this.editedAdvPos = false;
                    // this.routers.navigate(['admin/job/advertisement/new-career']);
                    this.routers.navigate(['admin/job/career-tm/all_0_0_0_0']);
                }.bind(this), 3000); //wait 3 Seconds and hide
                this.advBtnDisplay = false;
            } else {
                this.advPosMsg = 'Fail to ' + generalMsg + ' (Position has been advertised)';
                this.advPosStyle = ' alert-danger  ';
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

    }
    // :end HCBD admin send advertisement for approval */
    showOccMsg = false; advMsgStyle = 'secondary'; apprRemark = false;
    checkOccupied(occ) {
        if (occ == 1) {
            this.showOccMsg = true; this.advMsgStyle = 'warning'; this.apprRemark = true;
        } else {

        }
    }


    cityEnter(profileVals) {
		let index;

		if(profileVals.infoCity.length > 0) {
			index = this.myPostCode.findIndex( item => item.Post_Office.toLowerCase() === profileVals.infoCity.toLowerCase());

			if(index !== -1) {
				this.jobInfoCareerForm.patchValue({ infoRegion: this.myPostCode[index].State });
			}
			// else {
			// 	this.jobInfoCareerForm.patchValue({ state: '' });
			// }
		}
    }

}

