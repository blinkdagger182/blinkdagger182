import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { IBVars } from './mapsne-session-vars';

import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';

import { PagerService } from '../../../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { AbstractControl } from '@angular/forms';
import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { ThemePalette } from '@angular/material/core';
import { stringify } from '@angular/core/src/util';
import { ICustomValidatorHost } from 'ng2-semantic-ui/dist';

export interface Target {
  name: string;
  selected: boolean;
  color: ThemePalette;
  subtargets?: Target[];
}

@Component({
  selector: 'mapsne-session',
  templateUrl: './mapsne-session.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mapsne-session.component.css']
})
export class MapsneSessionComponent implements OnInit {

  target: Target = {
    name: 'All',
    selected: false,
    color: 'primary',
    subtargets: [
      { name: 'TM Group Exec', selected: false, color: 'primary' },
      { name: 'TM Group Non-Exec', selected: false, color: 'accent' },
      { name: 'Include & Exclude', selected: false, color: 'warn' }
    ]
  };

  allSelect: boolean = false;

  updateAllComplete() {
    this.allSelect = this.target.subtargets != null && this.target.subtargets.every(t => t.selected);
  }

  someComplete(): boolean {

    if (this.target.subtargets == null) {
      return false;
    }
    return this.target.subtargets.filter(t => t.selected).length > 0 && !this.allSelect;
  }

  setAll(selected: boolean) {
    this.allSelect = selected;
    if (this.target.subtargets == null) {
      return;
    }
    this.target.subtargets.forEach(t => t.selected = selected);
  }

  showMainContent = true; loading = true; loading1 = true; errLoadData = IBVars.errLoadData; downloadAllXLS = IBVars.downloadAllXLS;
  ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
  title1 = IBVars.title1; title2 = IBVars.title2; pageSize = IBVars.pageSize; addAction = IBVars.addAction; updAction = IBVars.updAction; private getmapsnesessionById = IBVars.getMAPSNESessionById;

  //edit page or create page
  canEditPage = false;
  //tab1Title = IBVars.tab1Title;
  mapsnesessionCreate = IBVars.MAPSNESessionCreate;
  mapsnesessionByIdU = IBVars.MAPSNESessionByIdU;
  loadingSubmit = false;
  updPorposeMsg = IBVars.updPorposeMsg;
  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  sessionList: any[];

  getmapsnesessionList = IBVars.getMAPSNESessionList;

  isAddData = true;
  mapsnesessionInfoForm: FormGroup; //IdpBatchInfoForm
  typemapsnesessionAct: string; //typemapsnesessionAct

  private readonly notifier: NotifierService;

  mySubscription: any;

  constructor(
    private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
    private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
    private datePipe: DatePipe, private _script: ScriptLoaderService, notifierService: NotifierService,
    private _alertService: AlertService, private cfr: ComponentFactoryResolver) {

    this.notifier = notifierService;
    this.notifier.getConfig().behaviour.autoHide = 5000;

    this.routers.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.routers.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.routers.navigated = false;

        window.scrollTo(0, 0);
      }
    });
  }

  ShowHideButton() {
    this.showMainContent = this.showMainContent ? false : true;
  }

  apiUrl: string;
  /*usrLoginLvl = GlobalVariable.USER_LEVEL;
  usrLoginRole=GlobalVariable.USER_ROLE;
  usrLoginToken=GlobalVariable.USER_TOKEN;*/

  //showAdvId = true; showPosName = true; showCompany = true; showDepartment = true; showLOB = true;

  data: any = {};
  data2: any = {};

  getReportFilter() {
    type mapsnesession = {
      m_id: number, m_year: number, m_name: string, s_date_goalstg: Date, e_date_endyear: Date
    };
    let myarray: mapsnesession[] = [];
    this._GET_api_Service.GET_MAPS_data(this.getmapsnesessionList).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        myarray.push({
          m_id: data[i].id,
          m_year: data[i].year,
          m_name: data[i].name,
          s_date_goalstg: data[i].s_date_goalstg,
          e_date_endyear: data[i].e_date_endyear
        });
      }
      this.data2 = myarray;
      this.setSessionList();
      this.loading = false;
    }, error => {
      console.log('[ERROR - Fail to get report filters] ' + error);
    });
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
      //window.location.reload();//have to put this because backdrop not disap

    }
  }

  setSessionList() {
    this.sessionList = this.data2.slice();
  }

  //Error Display
  isError: any = false;
  localErrMsg: Array<string> = [];
  isValidDate: any;
  isEmpty(date: string){ //JIMAN MINOR CODE CHANGES
    return date == "------------" || date === "1970-01-01";
  }

  ngOnInit() {
    //this.syncTokenMaps();
    this.getReportFilter();
    this.checkLevel();
    $('.modal-backdrop').remove();

    function yearRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 2000 || control.value > 2099)) {
        return { 'yearRange': true };
      }
      return null;
    }

    this.mapsnesessionInfoForm = new FormGroup({
      info_id: new FormControl(),
      info_m_year: new FormControl('', Validators.required),
      info_m_name: new FormControl('', Validators.required),
      info_s_date_goalstg: new FormControl('', Validators.required),
      info_e_date_goalstg: new FormControl('', Validators.required),
      info_s_date_midyear: new FormControl('', Validators.required),
      info_e_date_midyear: new FormControl('', Validators.required),
      info_s_date_endyear: new FormControl('', Validators.required),
      info_e_date_endyear: new FormControl('', Validators.required),
      info_date_pub_stage: new FormControl('', /*Validators.required*/)//JIMAN MINOR CODE CHANGE HERE
    });

  }

  // token for MAPS
  syncTokenMaps() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let req = {
      staff_id: currentUser.userid,
      u_token: currentUser.token
    }

    this._POST_api_Service.POST_MAPS_data('/maps/facilitate/sync_token', req).subscribe(res => {
      if (res.status === 'OK') {//Do nothing
      }
    }, error => {
      console.log('[ERROR] cannot get token ' + error);
    })
  }

  

  validateDates(sGoalstgDate: string, eGoalstgDate: string, sMidyearDate: string, eMidyearDate: string, sEndyearDate: string, eEndyearDate: string/*, PublishDate: string*/) {
    this.isValidDate = true;
    this.localErrMsg = [];

//  JIMAN MAJOR CODE CHANGES START HERE
    let sGDate= this.isEmpty(sGoalstgDate);
    let eGDate= this.isEmpty(eGoalstgDate);
    let sMDate= this.isEmpty(sMidyearDate);
    let eMDate= this.isEmpty(eMidyearDate);
    let sEDate= this.isEmpty(sEndyearDate);
    let eEDate= this.isEmpty(eEndyearDate);
    //let PDate= this.isEmpty(PublishDate);

    //console.log(sGoalstgDate, " ", eGoalstgDate, " ", sMidyearDate, " ", eMidyearDate, " ", sEndyearDate, " ", eEndyearDate, " ", PublishDate)
    if ((sGDate || eGDate || sMDate || eMDate || sEDate || eEDate /*|| PDate*/)) {
      //this.error={isError:true,errorMessage:'All Start date and end date are required.'};
      this.isValidDate = false;
      this.localErrMsg.push('All start dates and end dates are required.');
    }
      
    if ((!sGDate && !sMDate) && ((sGoalstgDate) > (sMidyearDate))) {
      //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
      this.isValidDate = false;
      this.localErrMsg.push('Goal Setting start date should be before Mid Year start date.');
    }

    if ((!sGDate && !sEDate) && ((sGoalstgDate) > (sEndyearDate))) {
      //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
      this.isValidDate = false;
      this.localErrMsg.push('Goal Setting start date should be before End Year start date.');
    }

    if ((!sMDate && !sEDate) && ((sMidyearDate) > (sEndyearDate))) {
      //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
      this.isValidDate = false;
      this.localErrMsg.push('Mid Year start date should be before End Year start date.');
    }

    if ((!sGDate && !eGDate) && ((sGoalstgDate) > (eGoalstgDate))) {
      //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
      this.isValidDate = false;
      this.localErrMsg.push('Goal Setting start date should be before Goal Setting end date.');
    }

    if ((!sMDate && !eMDate) && ((sMidyearDate) > (eMidyearDate))) {
      //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
      this.isValidDate = false;
      this.localErrMsg.push('Mid Year start date should be before Mid Year end date.');
    }

    if ((!sEDate && !eEDate) && ((sEndyearDate) > (eEndyearDate))) {
      //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
      this.isValidDate = false;
      this.localErrMsg.push('End Year start date should be before End Year end date.');
    }

    // JIMAN MAJOR CODE CHANGES END HERE

//  PREVIOUS CODE
    // if ((sGoalstgDate == null || eGoalstgDate == null || sMidyearDate == null || eMidyearDate == null || sEndyearDate == null || eEndyearDate == null || PublishDate == null)) {
    //   //this.error={isError:true,errorMessage:'All Start date and end date are required.'};
    //   this.isValidDate = false;
    //   this.localErrMsg.push('All Start date and End date are required.');
    // }
    // else {
    //   if ((sGoalstgDate != null && eGoalstgDate != null) && ((sGoalstgDate) > (sMidyearDate) || (sGoalstgDate) > (sEndyearDate))) {
    //   //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
    //   this.isValidDate = false;
    //   this.localErrMsg.push('Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.');
    //   }
    

    //   if ((sGoalstgDate != null && eGoalstgDate != null) && ((sMidyearDate) > (sEndyearDate))) {
    //     //this.error={isError:true,errorMessage:'Goal Setting Start Date should not greater than Mid Year Start date / Year End Start Date.'};
    //     this.isValidDate = false;
    //     this.localErrMsg.push('Mid Year Start date should not greater than Year End Start Date.');
    //   }
    // }

    if (!this.isValidDate) { this.isError = true; };


    return this.isValidDate;
  }

  modalTitle = '';

  openAddModal(option, dataId) {

    this.typemapsnesessionAct = '';

    this.updPorposeMsg = '';

    if (option === 'add') {
      this.isAddData = true;
      this.typemapsnesessionAct = 'add';
    }
    else {
      this.isAddData = false;
      this.typemapsnesessionAct = 'edit';
    }

    if (this.isAddData) {
      this.modalTitle = this.addAction;
    }
    else {
      this.modalTitle = this.updAction;
    }

    if (option !== 'add') {

      this.canEditPage = true;
      this.typemapsnesessionAct = 'edit';
      this.getmapsnesessionDetailData(dataId);
      this.loading1 = true;
    } else {
      this.canEditPage = true;
      this.typemapsnesessionAct = 'add';
      this.loadFilter([]);

    }

    this.canEditPage = true;
    this.ShowHideButton();

  }

  getmapsnesessionDetail(dataID) {
    var batchId = dataID;
    return this._GET_api_Service.GET_MAPS_data(this.getmapsnesessionById + batchId);
  }

  rmErr() {
    $('#errInfoSpStart').addClass("m--hide");
    $('#errInfoSupCalEnd').addClass("m--hide");
  };

  getmapsnesessionDetailData(dataID = null) {
    this.getmapsnesessionDetail(dataID).subscribe(dataRes => {
      this.data = dataRes;

      this.loadFilter(this.data[0]);
    },
      error => {
        this.showAlert('alertError XYZ');
        // this._alertService.error(error);
        this._alertService.error(this.errLoadData);
        console.log('[ERROR] Adv Details: ' + error);

      })

    let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase());
    let roleArr = usrRole.split(",");
    for (let i = 0; i < roleArr.length; i++) {
      roleArr[i] = roleArr[i].trim();
    }

  }

  loadFilter(data) {

    //this.getMaster();
    this.rmErr();
    let tmp_id: 0;
    let tmp_year: '';
    let tmp_name: '';
    let tmp_s_date_goalstg: '';
    let tmp_e_date_goalstg: '';
    let tmp_s_date_midyear: '';
    let tmp_e_date_midyear: '';
    let tmp_s_date_endyear: '';
    let tmp_e_date_endyear: '';
    let tmp_date_pub_stage: ''; //JIMAN MINOR CODE CHANGE HERE

    var datePipe = new DatePipe("en-US");

    if (this.typemapsnesessionAct === 'edit') {
      tmp_id = data.id;
      tmp_year = data.year;
      tmp_name = data.name;
      tmp_s_date_goalstg = data.s_date_goalstg;
      tmp_e_date_goalstg = data.e_date_goalstg;
      tmp_s_date_midyear = data.s_date_midyear;
      tmp_e_date_midyear = data.e_date_midyear;
      tmp_s_date_endyear = data.s_date_endyear;
      tmp_e_date_endyear = data.e_date_endyear;
      //JIMAN MINOR CODE CHANGE HERE
      if (data.date_pub_stage === "1970-01-01T00:00:00.000Z")
        tmp_date_pub_stage = '';
      else
        tmp_date_pub_stage = data.date_pub_stage;
       
    }
    else {
      tmp_id = 0;
      tmp_year = '';
      tmp_name = '';
      tmp_s_date_goalstg = '';
      tmp_e_date_goalstg = '';
      tmp_s_date_midyear = '';
      tmp_e_date_midyear = '';
      tmp_s_date_endyear = '';
      tmp_e_date_endyear = '';
      tmp_date_pub_stage = ''; //JIMAN MINOR CODE CHANGE HERE
    }


    this.mapsnesessionInfoForm.setValue({

      info_id: tmp_id != 0 ? data.id : 0,
      info_m_year: tmp_year != '' ? data.year : '',
      info_m_name: tmp_name != '' ? data.name : '',
      info_s_date_goalstg: tmp_s_date_goalstg != '' ? this.datePipe.transform(data.s_date_goalstg, 'yyyy-MM-dd') : '',
      info_e_date_goalstg: tmp_e_date_goalstg != '' ? this.datePipe.transform(data.e_date_goalstg, 'yyyy-MM-dd') : '',
      info_s_date_midyear: tmp_s_date_midyear != '' ? this.datePipe.transform(data.s_date_midyear, 'yyyy-MM-dd') : '',
      info_e_date_midyear: tmp_e_date_midyear != '' ? this.datePipe.transform(data.e_date_midyear, 'yyyy-MM-dd') : '',
      info_s_date_endyear: tmp_s_date_endyear != '' ? this.datePipe.transform(data.s_date_endyear, 'yyyy-MM-dd') : '',
      info_e_date_endyear: tmp_e_date_endyear != '' ? this.datePipe.transform(data.e_date_endyear, 'yyyy-MM-dd') : '',
      info_date_pub_stage: tmp_date_pub_stage != '' ? this.datePipe.transform(data.date_pub_stage, 'yyyy-MM-dd') : '', //JIMAN MINOR CODE CHANGE HERE
    });

    this.loading1 = false;
  }

  reformatDateString(s) {
    var b = s.split(/\D/);
    return b.reverse().join('-');
  }

  onmapsnesessionInfoFormSubmit() {
    let dataPost: any = {};
    let apiURL: string;

    let sdate_goalstg = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_s_date_goalstg').value).toLocaleDateString('en-GB'));
    let edate_goalstg = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_e_date_goalstg').value).toLocaleDateString('en-GB'));
    let sdate_midyear = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_s_date_midyear').value).toLocaleDateString('en-GB'));
    let edate_midyear = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_e_date_midyear').value).toLocaleDateString('en-GB'));
    let sdate_endyear = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_s_date_endyear').value).toLocaleDateString('en-GB'));
    let edate_endyear = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_e_date_endyear').value).toLocaleDateString('en-GB'));
    let date_pubstage = this.reformatDateString(new Date(this.mapsnesessionInfoForm.get('info_date_pub_stage').value).toLocaleDateString('en-GB'));//JIMAN MINOR CODE CHANGE HERE
    apiURL = '';
    console.log(date_pubstage, " ", this.mapsnesessionInfoForm.status);
    this.isValidDate = this.validateDates(sdate_goalstg, edate_goalstg, sdate_midyear, edate_midyear, sdate_endyear, edate_endyear/*, date_pubstage*/);//JIMAN MINOR CODE CHANGE HERE

    if (this.isValidDate && this.mapsnesessionInfoForm.status == 'VALID') {

      if (this.typemapsnesessionAct == 'edit') {
        apiURL = this.mapsnesessionByIdU;
        dataPost = {
          id: this.mapsnesessionInfoForm.get('info_id').value,
          year: this.mapsnesessionInfoForm.get('info_m_year').value,
          name: this.mapsnesessionInfoForm.get('info_m_name').value,
          sdate_goalstg: sdate_goalstg,
          edate_goalstg: edate_goalstg,
          sdate_midyear: sdate_midyear,
          edate_midyear: edate_midyear,
          sdate_endyear: sdate_endyear,
          edate_endyear: edate_endyear,
          date_pubstage: date_pubstage,//JIMAN MINOR CODE CHANGE HERE
        }
      }
      else {
        apiURL = this.mapsnesessionCreate;
        dataPost = {
          year: this.mapsnesessionInfoForm.get('info_m_year').value,
          name: this.mapsnesessionInfoForm.get('info_m_name').value,
          sdate_goalstg: sdate_goalstg,
          edate_goalstg: edate_goalstg,
          sdate_midyear: sdate_midyear,
          edate_midyear: edate_midyear,
          sdate_endyear: sdate_endyear,
          edate_endyear: edate_endyear,
          date_pubstage: date_pubstage,//JIMAN MINOR CODE CHANGE HERE
        }
      }

      dataPost = JSON.stringify(dataPost);
      console.log('data post' + dataPost);
      let addInfoTalentClass = this._POST_api_Service.POST_MAPS_data(apiURL, dataPost);

      let dataResUp: any = {};

      let status: any;

      let ret = addInfoTalentClass.subscribe(dataRes => {
        dataResUp = dataRes;

        console.log('response: ' + JSON.stringify(dataResUp));
        console.log('apiURL: ' + apiURL);
        if (dataResUp.status !== null && dataResUp.status !== undefined) {
          status = dataResUp.status;
        } else {
          status = '';
        }

        if (this.typemapsnesessionAct != 'edit') {
          //this.mapsnesessionInfoForm.patchValue({
          //  infoMId: dataRes.tc_id,
          //});

          if (status === 'OK') {
            //this.routers.navigate(['admin/job/mapsnesession']);
            this.notifier.notify('success', 'Successfully Added');
          }
          else if (status === 'Error') {
            this.notifier.notify('error', dataResUp.msg);
          }
          else {
            this.notifier.notify('error', 'Please fill up all field in correct format!!');
          }

          this.typemapsnesessionAct = 'add';

        }
        else {

          if (status === 'OK') {
            //this.updPorposeMsg = 'Successfully Updated';

            this.notifier.notify('success', 'Successfully Updated');
            //this.routers.navigate(['/admin/job/mapsnesession']);
          }
          else if (status === 'Error') {
            this.notifier.notify('error', dataResUp.msg);
          }
          else {
            this.notifier.notify('error', 'Please fill up all field in correct format!!');
          }

          this.typemapsnesessionAct = 'edit';

        }


        this.canEditPage = true;

        //this.getJobDetailData(dataRes.length > 0 ? dataRes[0].Position_ID : this.mapsnesessionInfoForm.get('infoMId').value);
        //this.getRequestor();
        //this.declareInputField();

        this.loadingSubmit = false;
      },
        error => {
          console.log('[ERROR + Failed to submit data: ' + error);
        }
      )
    } else {
      let j = this.mapsnesessionInfoForm;
      if (j.controls['info_m_year'].status == 'INVALID') $('#err_info_m_year').removeClass("m--hide"); else $('#err_info_m_year').addClass("m--hide");
      if (j.controls['info_m_name'].status == 'INVALID') $('#err_info_m_name').removeClass("m--hide"); else $('#err_info_m_name').addClass("m--hide");
      if (j.controls['info_s_date_goalstg'].status == 'INVALID') $('#err_info_s_date_goalstg').removeClass("m--hide"); else $('#err_info_s_date_goalstg').addClass("m--hide");
      if (j.controls['info_e_date_goalstg'].status == 'INVALID') $('#err_info_e_date_goalstg').removeClass("m--hide"); else $('#err_info_e_date_goalstg').addClass("m--hide");
      if (j.controls['info_s_date_midyear'].status == 'INVALID') $('#err_info_s_date_midyear').removeClass("m--hide"); else $('#err_info_s_date_midyear').addClass("m--hide");
      if (j.controls['info_e_date_midyear'].status == 'INVALID') $('#err_info_e_date_midyear').removeClass("m--hide"); else $('#err_info_e_date_midyear').addClass("m--hide");
      if (j.controls['info_s_date_endyear'].status == 'INVALID') $('#err_info_s_date_endyear').removeClass("m--hide"); else $('#err_info_s_date_endyear').addClass("m--hide");
      if (j.controls['info_e_date_endyear'].status == 'INVALID') $('#err_info_e_date_endyear').removeClass("m--hide"); else $('#err_info_e_date_endyear').addClass("m--hide");
      if (j.controls['info_date_pub_stage'].status == 'INVALID') $('#err_info_date_pub_stage').removeClass("m--hide"); else $('#err_info_date_pub_stage').addClass("m--hide");//JIMAN MINOR CODE CHANGE HERE
    }

  }


  checkLevel() {
    let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
    if (!/9/i.test(usrRole)) {
      this.routers.navigate(['/admin/unauthorized']);
      return false;
    }
  }
}