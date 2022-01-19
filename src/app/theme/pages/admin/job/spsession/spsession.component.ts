import { IBDVars } from './../idp-batches-detail/idp-batches-detail-vars';
import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { IBVars } from './spsession-vars';
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
    selector: 'spsession',
    templateUrl: 'spsession.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['spsession.component.css']
})
export class SpsessionComponent implements OnInit {

  loading = true; loading1 = true; errLoadData = IBVars.errLoadData; downloadAllXLS = IBVars.downloadAllXLS;
  ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
  title1 = IBVars.title1; title2 = IBVars.title2; pageSize = IBVars.pageSize; editSPSessionPost = IBVars.editSPSessionPost;
  addAction = IBVars.addAction; updAction = IBVars.updAction; private getSPSessionById = IBVars.getSPSessionById;

   //edit page or create page
   canEditPage = false;
   tab1Title = IBDVars.tab1Title;
   //spSessionCreate = IBVars.spSessionCreate;
   spSessionByIdU = IBVars.spSessionByIdU;
   loadingSubmit = false;
   updPorposeMsg = IBVars.updPorposeMsg;
    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    sessionList: any[];

    getSPSessionList = IBVars.getSPSessionList;

    isAddData = true;
    SpSessionInfoForm: FormGroup; //IdpBatchInfoForm
    typeSpSessionAct: string; //typeSpSessionAct

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
      type spSession = {
        sp_id: number, sp_start: Date, sp_sup_cal_end: Date
      };
      let myarray: spSession[] = [];
      this._GET_api_Service.GET_SP_DATA(this.getSPSessionList).subscribe(data => {
          for(let i=0; i<data.length; i++){
              myarray.push({
                sp_id: data[i].batch_id,
                sp_start: data[i].start_date,
                sp_sup_cal_end: data[i].leader_expireDt
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

    this.SpSessionInfoForm = new FormGroup({
      infoSpId: new FormControl(),
      infoSpStart: new FormControl('', Validators.required),
      infoSupCalEnd: new FormControl('', Validators.required)
    });

  }

  modalTitle = '';

  openAddModal( option, dataId) {

    this.updPorposeMsg = '';

        if(option === 'add') 
        {
          this.isAddData = true;
          this.typeSpSessionAct = 'add';
        }
        else 
        {
          this.isAddData = false;
          this.typeSpSessionAct = 'edit';
        }

        if (this.isAddData){ 
          this.modalTitle = this.addAction;
        }
        else { 
          this.modalTitle = this.updAction;
        }

        if(option !== 'add'){
        
          this.canEditPage = true;
          this.typeSpSessionAct = 'edit';
          this.getSPSessionDetailData(dataId);
          this.loading1 = true;
        } else {
          this.canEditPage = true;
          this.typeSpSessionAct = 'add';
          this.loadFilter([]);

        }
     
        
  }

  getSpSessionDetail(dataID) {
    var batchId = dataID;
    return this._GET_api_Service.GET_SP_DATA(this.getSPSessionById + batchId);
  }

rmErr(){
$('#errInfoSpStart').addClass("m--hide");
$('#errInfoSupCalEnd').addClass("m--hide");
};

  getSPSessionDetailData(dataID = null) {
    this.getSpSessionDetail(dataID).subscribe(data => {
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
  let tmpTcStart: '';
  let tmpSupCalEnd: '';


  var datePipe=new DatePipe("en-US");

  if(this.typeSpSessionAct === 'edit'){
      tmpIpdId = data.batch_id;
      tmpTcStart = data.start_date;
      tmpSupCalEnd = data.leader_expireDt;
  }
  else{
      tmpIpdId = 0;
      tmpTcStart = '';
      tmpSupCalEnd = '';
  }

  this.SpSessionInfoForm.setValue({

      infoSpId: tmpIpdId != 0 ? data.batch_id : 0,
      infoSpStart: tmpTcStart != '' ? this.datePipe.transform(data.start_date, 'yyyy-MM-dd') : '',
      infoSupCalEnd: tmpSupCalEnd != '' ? this.datePipe.transform(data.leader_expireDt, 'yyyy-MM-dd') : '',
  });

  this.loading1 = false;
}



onSpSessionInfoFormSubmit() {
  let dataPost: any = {};
  if(this.SpSessionInfoForm.status == 'VALID'){
      if(this.typeSpSessionAct == 'edit') {
          dataPost = {
              sp_id: this.SpSessionInfoForm.get('infoSpId').value,
              sp_start: this.SpSessionInfoForm.get('infoSpStart').value,
              sup_cal_end: this.SpSessionInfoForm.get('infoSupCalEnd').value,
          }
      }
      else {
          dataPost = {
              sp_id: 0,
              sp_start: this.SpSessionInfoForm.get('infoSpStart').value,
              sup_cal_end: this.SpSessionInfoForm.get('infoSupCalEnd').value,
          }
      }
      dataPost = JSON.stringify(dataPost);
      console.log('data post' + dataPost);
      let addInfoTalentClass = this._POST_api_Service.POST_SP_data(this.spSessionByIdU, dataPost);
          
          let dataResUp: any = {};
      
          let ret = addInfoTalentClass.subscribe(dataRes => {
            dataResUp = dataRes;

          if(this.typeSpSessionAct != 'edit'){
              //this.SpSessionInfoForm.patchValue({
              //  infoSpId: dataRes.tc_id,
              //});

            if (dataResUp.message === 'Success') {
              this.updPorposeMsg = 'Successfully Added';
              this.routers.navigate(['admin/job/spsession']);
            } 
            else if (dataResUp.message === 'start_date') {

              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check session start date. ';
              //this.routers.navigate(['admin/job/spsession']);
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'sup_exp_date') {

              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check session leader expired date.';
              //this.routers.navigate(['admin/job/spsession']);
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'duplicate') {

              this.updPorposeMsg = dataResUp.status + ': Cannot add! Please check session start date and leader expired date. Duplicate record detected.';
              //this.routers.navigate(['admin/job/spsession']);
              console.log(dataResUp);
            }
          
          }
          else
          {

            if (dataResUp.message === 'Success') {
              this.updPorposeMsg = 'Successfully Updated';
              this.routers.navigate(['admin/job/spsession']);
            } 
            else if (dataResUp.message === 'start_date') {

              this.updPorposeMsg = dataResUp.status + ': Cannot update! Please check session start date. ';
              //this.routers.navigate(['admin/job/spsession']);
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'sup_exp_date') {

              this.updPorposeMsg = dataResUp.status + ': Cannot update! Please check session leader expired date.';
              //this.routers.navigate(['admin/job/spsession']);
              console.log(dataResUp);
            }
            else if (dataResUp.message === 'duplicate') {

              this.updPorposeMsg = dataResUp.status + ': Cannot update! Please check session start date and leader expired date. Duplicate record detected.';
              //this.routers.navigate(['admin/job/spsession']);
              console.log(dataResUp);
            }

          }


          this.canEditPage = true;
          this.typeSpSessionAct = 'edit';

          //this.getJobDetailData(dataRes.length > 0 ? dataRes[0].Position_ID : this.SpSessionInfoForm.get('infoSpId').value);
          //this.getRequestor();
          //this.declareInputField();

          this.loadingSubmit = false;
      },
          error => {
              console.log('[ERROR + Failed to submit data: ' + error);
          }
      )
  } else {
      let j = this.SpSessionInfoForm;
      if(j.controls['infoSpStart'].status == 'INVALID') $('#errInfoSpStart').removeClass("m--hide"); else $('#errInfoSpStart').addClass("m--hide");
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