import { IBDVars } from './../idp-batches-detail/idp-batches-detail-vars';
import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { IBVars } from './tc-sessions-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';

import { PagerService } from '../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { AbstractControl } from '@angular/forms';
@Component({
    selector: 'app-tc-sessions',
    templateUrl: 'tc-sessions.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./tc-sessions.component.css']
})
export class TcSessionsComponent implements OnInit {

  loading = true; loading1 = true; errLoadData = IBVars.errLoadData; downloadAllXLS = IBVars.downloadAllXLS;
  ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
  title1 = IBVars.title1; title2 = IBVars.title2; pageSize = IBVars.pageSize; editTCSessionPost = IBVars.editTCSessionPost;
  addAction = IBVars.addAction; updAction = IBVars.updAction; private getTCSessionById = IBVars.getTCSessionById;

   //edit page or create page
   canEditPage = false;
   tab1Title = IBDVars.tab1Title;
   //tcSessionCreate = IBVars.tcSessionCreate;
   tcSessionByIdU = IBVars.tcSessionByIdU;
   loadingSubmit = false;
   updPorposeMsg = IBVars.updPorposeMsg;
    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    sessionList: any[];

    getTCSessionList = IBVars.getTCSessionList;

    isAddData = true;
    TcSessionInfoForm: FormGroup; //IdpBatchInfoForm
    typeTcSessionAct: string; //typeTcSessionAct

    private readonly notifier: NotifierService;

    mySubscription: any;

  constructor( 
    private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
    private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
    private datePipe: DatePipe, private _script: ScriptLoaderService,
    private _alertService: AlertService, private cfr: ComponentFactoryResolver) {

      this.getReportFilter(); 


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


    
    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/

    //showAdvId = true; showPosName = true; showCompany = true; showDepartment = true; showLOB = true;

    data: any = {};
    data2: any = {};

    getReportFilter() {
      type tcSession = {
        tc_id: number, tc_year: string, tc_name: string, tc_start: Date, tc_end: Date, tc_sup_cal_end: Date
      };
      let myarray: tcSession[] = [];
      this._GET_api_Service.GET_TC_DATA(this.getTCSessionList).subscribe(data => {
          for(let i=0; i<data.length; i++){
              myarray.push({
                tc_id: data[i].id,
                tc_year: data[i].year,
                tc_name: data[i].name,
                tc_start: data[i].start_date,
                tc_end: data[i].end_date,
                tc_sup_cal_end: data[i].sup_cal_end_date
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

  ngOnInit() {
    this.checkLevel(); 
    $('.modal-backdrop').remove();

    function yearRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
      if (control.value !== undefined && (isNaN(control.value) || control.value < 2000 || control.value > 2099)) {
          return { 'yearRange': true };
      }
      return null;
    }

    this.TcSessionInfoForm = new FormGroup({
      infoTcId: new FormControl(),
      infoTcYear: new FormControl('', [Validators.required, yearRangeValidator]),
      infoTcName: new FormControl('', Validators.required),
      infoTcStart: new FormControl('', Validators.required),
      infoTcEnd: new FormControl('', Validators.required),
      infoSupCalEnd: new FormControl('', Validators.required)
    });

  }

  modalTitle = '';

  openAddModal( option, dataId) {

    this.updPorposeMsg = '';

        if(option === 'add') 
        {
          this.isAddData = true;
        }
        else 
        {
          this.isAddData = false;
          this.typeTcSessionAct = 'edit';
        }

        if (this.isAddData) 
        this.modalTitle = this.addAction;
        else this.modalTitle = this.updAction;

        if(option !== 'add'){
        
          this.canEditPage = true;
          this.typeTcSessionAct = 'edit';
          this.getTCSessionDetailData(dataId);
          this.loading1 = true;
        } else {
          this.canEditPage = true;
          this.typeTcSessionAct = 'add';
          this.loadFilter([]);

        }
     
        
  }

  getTcSessionDetail(dataID) {
    var cycleId = dataID;
    return this._GET_api_Service.GET_TC_DATA(this.getTCSessionById + cycleId);
  }

rmErr(){
$('#errInfoTcYear').addClass("m--hide");
$('#errInfoTcName').addClass("m--hide");
$('#errInfoTcStart').addClass("m--hide");
$('#errInfoTcEnd').addClass("m--hide");
$('#errInfoSupCalEnd').addClass("m--hide");
};

  getTCSessionDetailData(dataID = null) {
    this.getTcSessionDetail(dataID).subscribe(data => {
        this.data = data;

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

loadFilter(data){

  //this.getMaster();
  this.rmErr();
  let tmpIpdId = 0;
  let tmpTcYear: '';
  let tmpTcName: '';
  let tmpTcStart: '';
  let tmpTcEnd: '';
  let tmpSupCalEnd: '';


  var datePipe=new DatePipe("en-US");

  if(this.typeTcSessionAct === 'edit'){
      tmpIpdId = data.id;
      tmpTcYear = data.year;
      tmpTcName = data.name;
      tmpTcStart = data.start_date;
      tmpTcEnd = data.end_date;
      tmpSupCalEnd = data.sup_cal_end_date;
  }
  else{
      tmpIpdId = 0;
      tmpTcYear ='';
      tmpTcName =  '';
      tmpTcStart = '';
      tmpTcEnd = '';
      tmpSupCalEnd = '';
  }

  this.TcSessionInfoForm.setValue({

      infoTcId: tmpIpdId != 0 ? data.id : 0,
      infoTcYear: tmpTcYear != '' ? data.year : '',
      infoTcName: tmpTcName != '' ? data.name : '',
      infoTcStart: tmpTcStart != '' ? this.datePipe.transform(data.start_date, 'yyyy-MM-dd') : '',
      infoTcEnd: tmpTcEnd != '' ? this.datePipe.transform(data.end_date, 'yyyy-MM-dd') : '',
      infoSupCalEnd: tmpSupCalEnd != '' ? this.datePipe.transform(data.sup_cal_end_date, 'yyyy-MM-dd') : '',
  });

  //setTimeout(function() {
  //    $("input.search").val(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
  //    $("#reportName").val(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
  //    this.selectedReportName(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
  //}.bind(this), 1000);
  this.loading1 = false;
}



onTcSessionInfoFormSubmit() {
  let dataPost: any = {};

  let dateStart = this.TcSessionInfoForm.get('infoTcStart').value;
  let dateEnd = this.TcSessionInfoForm.get('infoTcEnd').value;
  let dateSREnd = this.TcSessionInfoForm.get('infoSupCalEnd').value;

  if(this.TcSessionInfoForm.status == 'VALID'){
      if(this.typeTcSessionAct == 'edit') {
          dataPost = {
              tc_id: this.TcSessionInfoForm.get('infoTcId').value,
              tc_year: this.TcSessionInfoForm.get('infoTcYear').value,
              tc_name: this.TcSessionInfoForm.get('infoTcName').value,
              tc_start: dateStart,
              tc_end: dateEnd,
              sup_cal_end: dateSREnd,
          }
      }
      else {
          dataPost = {
              tc_id: 0,
              tc_year: this.TcSessionInfoForm.get('infoTcYear').value,
              tc_name: this.TcSessionInfoForm.get('infoTcName').value,
              tc_start: dateStart,
              tc_end: dateEnd,
              sup_cal_end: dateSREnd,
          }
      }

      dataPost = JSON.stringify(dataPost);
      //console.log(dataPost);
      let addInfoTalentClass = this._POST_api_Service.POST_TC_data(this.tcSessionByIdU, dataPost);
          
          let dataResUp: any = {};

          let ret = addInfoTalentClass.subscribe(dataRes => {
            dataResUp = dataRes;
          if(this.typeTcSessionAct != 'edit'){
              //this.TcSessionInfoForm.patchValue({
              //  infoTcId: dataRes.tc_id,
              //});

              if (dataResUp.message === 'Success') {
                console.log(dataResUp);
                this.updPorposeMsg = 'Successfully Added';
                this.routers.navigate(['admin/job/tc-sessions']);
              } 
              else if (dataResUp.message === 'start_date') {
  
                this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check Start date. ';
                console.log(dataResUp);
              }
              else if (dataResUp.message === 'sup_exp_date') {
  
                this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check Supervisor Review End Date.';
                console.log(dataResUp);
              }
              else if (dataResUp.message === 'duplicate') {
  
                this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check Start date and Supervisor Review End Date. Duplicate record detected.';
                console.log(dataResUp);
              }
              else if (dataResUp.message === 'duplicate_year') {
  
                this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check year. Duplicate record detected.';
                console.log(dataResUp);
              }
          
          }
          else
          {

            if (dataResUp.message === 'Success') {
              console.log(dataResUp);
              this.updPorposeMsg = 'Successfully updated';
              this.routers.navigate(['admin/job/tc-sessions']);
            }
            else if (dataResUp.message === 'start_date') {
  
              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check Start date. ';
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'sup_exp_date') {

              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check Supervisor Review End Date.';
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'duplicate') {

              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check Start date and Supervisor Review End Date. Duplicate record detected.';
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'duplicate_year') {

              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check year. Duplicate record detected.';
              //this.routers.navigate(['admin/job/tc-sessions']);
              console.log(dataResUp);
            }

          }


          this.canEditPage = true;
          this.typeTcSessionAct = 'edit';

          //this.getJobDetailData(dataRes.length > 0 ? dataRes[0].Position_ID : this.TcSessionInfoForm.get('infoTcId').value);
          //this.getRequestor();
          //this.declareInputField();

          this.loadingSubmit = false;
      },
          error => {
              console.log('[ERROR + Failed to submit data: ' + error);
          }
      )
  } else {
      let j = this.TcSessionInfoForm;
      if(j.controls['infoTcYear'].status == 'INVALID') $('#errInfoTcYear').removeClass("m--hide"); else $('#errInfoTcYear').addClass("m--hide");
      if(j.controls['infoTcName'].status == 'INVALID') $('#errInfoTcName').removeClass("m--hide"); else $('#errInfoTcName').addClass("m--hide");
      if(j.controls['infoTcStart'].status == 'INVALID') $('#errInfoTcStart').removeClass("m--hide"); else $('#errInfoTcStart').addClass("m--hide");
      if(j.controls['infoTcEnd'].status == 'INVALID') $('#errInfoTcEnd').removeClass("m--hide"); else $('#errInfoTcEnd').addClass("m--hide");
      if(j.controls['infoSupCalEnd'].status == 'INVALID') $('#errInfoSupCalEnd').removeClass("m--hide"); else $('#errInfoSupCalEnd').addClass("m--hide");
  }

}


  checkLevel() {
    let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
    if ((!/1/i.test(usrRole)) && (!/6/i.test(usrRole))) {
        this.routers.navigate(['/admin/unauthorized']);
        return false;
    }
  }

}
