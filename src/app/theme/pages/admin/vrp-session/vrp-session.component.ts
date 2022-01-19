import { IBDVars } from './../job/idp-batches-detail/idp-batches-detail-vars';
//import { IBDVars } from './../idp-bavrphes-detail/idp-bavrphes-detail-vars';
import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { IBVars } from './vrp-session-vars';
import { GlobalVariable } from "../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';

import { PagerService } from '../job/shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { AbstractControl } from '@angular/forms';
import { ExcelService } from './excel.service';
@Component({
    selector: 'app-vrp-sessions',
    templateUrl: 'vrp-session.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./vrp-session.component.css']
})
export class VrpSessionComponent implements OnInit {

  loading = true; loading1 = true; errLoadData = IBVars.errLoadData; downloadAllXLS = IBVars.downloadAllXLS;
  ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
  title1 = IBVars.title1; title2 = IBVars.title2; pageSize = IBVars.pageSize; editTCSessionPost = IBVars.editVrpSessionPost;
  addAction = IBVars.addAction; updAction = IBVars.updAction; private getVRPSessionById = IBVars.getVrpSessionById;
  getVrpListByDate = IBVars.getVrpListByDate;

   //edit page or create page
   canEditPage = false;
   tab1Title = "MESRA 2021";
 
   vrpSessionByIdU = IBVars.vrpSessionByIdU;
   loadingSubmit = false;
   updPorposeMsg = IBVars.updPorposeMsg;
    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    sessionList: any[];

    getVRPSessionList = IBVars.getVrpSessionList;

    isAddData = true;
    VrpSessionInfoForm: FormGroup; //IdpBavrphInfoForm
    typeVrpSessionAct: string; //typeVrpSessionAct

    private readonly notifier: NotifierService;
    private readonly exel: ExcelService;
    mySubscription: any;


  constructor( 
    private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
    private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
    private datePipe: DatePipe, private _script: ScriptLoaderService,
    private _alertService: AlertService, private cfr: ComponentFactoryResolver,
    notifierService: NotifierService,private excelService: ExcelService,) {

      this.getSessionList(); 

      this.notifier = notifierService;
      this.exel = excelService;
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
    //data3: any = {};
    getSessionList() {
      type vrpSession = {
        vrp_id: number, vrp_year: string, vrp_start: Date, vrp_end: Date, vrp_exit_date_1: Date,
        vrp_exit_date_2: Date, vrp_exit_date_3: Date, vrp_batch: number
      };
      let myarray: vrpSession[] = [];
      this._GET_api_Service.GET_VRP_data(this.getVRPSessionList).subscribe(data => {
          for(let i=0; i<data.length; i++){
              myarray.push({
                vrp_id: data[i].id,
                vrp_year: data[i].year,
                vrp_start: data[i].start_date,
                vrp_end: data[i].end_date,
                vrp_exit_date_1: data[i].exit_date_1,
                vrp_exit_date_2: data[i].exit_date_2,
                vrp_exit_date_3: data[i].exit_date_3,
                vrp_batch: data[i].batch
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

    this.VrpSessionInfoForm = new FormGroup({
      infoVrpId: new FormControl(),
      infoVrpYear: new FormControl('', [Validators.required, yearRangeValidator]),
      infoVrpStart: new FormControl('', Validators.required),
      infoVrpEnd: new FormControl('', Validators.required),
      infoVrpExit1: new FormControl('', Validators.required),
      infoVrpExit2: new FormControl('', Validators.required),
      infoVrpExit3: new FormControl('', Validators.required)
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
          this.typeVrpSessionAct = 'edit';
        }

        if (this.isAddData) 
        this.modalTitle = this.addAction;
        else this.modalTitle = this.updAction;

        if(option !== 'add'){
        
          this.canEditPage = true;
          this.typeVrpSessionAct = 'edit';
          this.getVRPSessionDetailData(dataId);
          this.loading1 = true;
        } 
        else
        {
          this.canEditPage = true;
          this.typeVrpSessionAct = 'add';
          this.loadFilter([]);
        }
     
        
  }

  getVrpSessionDetail(dataID) {
    var cycleId = dataID;
    return this._GET_api_Service.GET_VRP_data(this.getVRPSessionById + cycleId);
  }

rmErr(){
$('#errInfoVrpYear').addClass("m--hide");
$('#errInfoVrpStart').addClass("m--hide");
$('#errInfoVrpEnd').addClass("m--hide");
$('#errinfoVrpExit1').addClass("m--hide");
$('#errinfoVrpExit2').addClass("m--hide");
$('#errinfoVrpExit3').addClass("m--hide");
};

  getVRPSessionDetailData(dataID = null) {
    this.getVrpSessionDetail(dataID).subscribe(data => {
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
  let tmpVrpId = 0;
  let tmpVrpYear: '';
  let tmpVrpStart: '';
  let tmpVrpEnd: '';
  let tmpVrpExit1: '';
  let tmpVrpExit2: '';
  let tmpVrpExit3: '';
  var datePipe=new DatePipe("en-US");

  if(this.typeVrpSessionAct === 'edit'){
      tmpVrpId = data.id;
      tmpVrpYear = data.year;
      tmpVrpStart = data.start_date;
      tmpVrpEnd = data.end_date;
      tmpVrpExit1 = data.exit_date_1;
      tmpVrpExit2 = data.exit_date_2;
      tmpVrpExit3 = data.exit_date_3;
  }
  else{
      tmpVrpId = 0;
      tmpVrpYear ='';
      tmpVrpStart = '';
      tmpVrpEnd = '';
      tmpVrpExit1 = '';
      tmpVrpExit2 = '';
      tmpVrpExit3 = '';
  }

  this.VrpSessionInfoForm.setValue({

      infoVrpId: tmpVrpId != 0 ? data.id : 0,
      infoVrpYear: tmpVrpYear != '' ? data.year : '',
      infoVrpStart: tmpVrpStart != '' ? this.datePipe.transform(data.start_date, 'yyyy-MM-dd') : '',
      infoVrpEnd: tmpVrpEnd != '' ? this.datePipe.transform(data.end_date, 'yyyy-MM-dd') : '',
      infoVrpExit1: tmpVrpExit1 != '' ? this.datePipe.transform(data.exit_date_1, 'yyyy-MM-dd') : '',
      infoVrpExit2: tmpVrpExit2 != '' ? this.datePipe.transform(data.exit_date_2, 'yyyy-MM-dd') : '',
      infoVrpExit3: tmpVrpExit3 != '' ? this.datePipe.transform(data.exit_date_3, 'yyyy-MM-dd') : '',
  });

  //setTimeout(function() {
  //    $("input.search").val(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
  //    $("#reportName").val(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
  //    this.selectedReportName(profile.Holder_Pernr + ' - ' + profile.Holder_Name);
  //}.bind(this), 1000);
  this.loading1 = false;
}

updBatchStatus(dataID) {
    var cycleId = dataID;

    this._GET_api_Service.GET_VRP_data('/vrp/admin/upd_session_status/' + cycleId).subscribe(data => {
      this.notifier.notify('success', 'Successfully notify users !');
      this.loading = false;
  }, error => {
    this.notifier.notify('error', 'Error - Cannot notify users !');
      console.log('[ERROR - Fail to notify users] ' + error);
  });                

  }

    // Edit Status offer
  statusUpdate: any = []; 
  
  IsCalling:boolean=false
  generateExcel(batch) {
    this.loading = true;
    this.IsCalling=true;

    let dataPost: any = {};

    let checkpoint = 0;
    let dataStatusPos: any = {};

    let todayDate = new Date();
    let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
    let filename = 'Cessation_Retirement_Form_Mass_'+ dateToday +'.xlsx';
    dataStatusPos = {
      Filename        : filename,
      Batch           : batch
      }

    dataPost = {
      Batch            : batch
  }

    type cessationList = {
      count: number, lob: string, pernr: string, name: string, newIC: string,
      empsgroup: string, sub_area: string, action: string, action_reason: string,
      effective_date: Date, hold_income: string, effective_month: string, 
      ref_no: string

    };
    let myarray: cessationList[] = [];
        this._POST_api_Service.POST_VRP_data(this.getVrpListByDate, dataPost).subscribe(data => {
            for(let i=0; i<data.length; i++){
                myarray.push({
                  count: i+1,
                  lob: data[i].lob_desc,
                  pernr: data[i].pers_no,
                  name: data[i].name,
                  newIC: data[i].new_ic_no,
                  empsgroup: data[i].empsgroup,
                  sub_area: data[i].perssubarea_desc,
                  action: 'Retirement',
                  action_reason: data[i].batch_name,
                  effective_date: data[i].choice_of_date,
                  hold_income: 'No',
                  effective_month: '',
                  ref_no: data[i].ref_no,
                });
            }
            
            this.exel.generateExcel(myarray, filename);

            this._POST_api_Service.POST_VRP_data(IBVars.postUpdateStatus, dataStatusPos).subscribe(data => {
              this.statusUpdate = data;
             
              if (this.statusUpdate.status === 0) {
                //this.notifier.notify('success', 'Successfully Downloaded!');
                checkpoint = 1;
               } else {
                //this.notifier.notify('error', 'Error - Fail to edit Status - 1!');
                checkpoint = 0;
              }
        
             },
              error => {
                  console.log('[ERROR + User Not Found 1: ' + error);
             });
             

        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });



    this.loading = false;
    this.IsCalling=false;  
  }

onVrpSessionInfoFormSubmit() {
  let dataPost: any = {};
  let Idu = this.VrpSessionInfoForm.get('infoVrpId').value;
  let dateStart = this.VrpSessionInfoForm.get('infoVrpStart').value;
  let dateEnd = this.VrpSessionInfoForm.get('infoVrpEnd').value;
  let dateExit1 = this.VrpSessionInfoForm.get('infoVrpExit1').value;
  let dateExit2 = this.VrpSessionInfoForm.get('infoVrpExit2').value;
  let dateExit3 = this.VrpSessionInfoForm.get('infoVrpExit3').value;

  if(this.VrpSessionInfoForm.status == 'VALID'){
      if(this.typeVrpSessionAct === 'edit') {
          dataPost = {
              id: Idu,
              year: this.VrpSessionInfoForm.get('infoVrpYear').value,
              start_date: dateStart,
              end_date: dateEnd,
              exit_date_1: dateExit1,
              exit_date_2: dateExit2,
              exit_date_3: dateExit3,
          }
      }
      else {
          dataPost = {
              id: 0,
              year: this.VrpSessionInfoForm.get('infoVrpYear').value,
              start_date: dateStart,
              end_date: dateEnd,
              exit_date_1: dateExit1,
              exit_date_2: dateExit2,
              exit_date_3: dateExit3,
          }
      }

      dataPost = JSON.stringify(dataPost);
      console.log(dataPost);
      let addInfoTalentClass = this._POST_api_Service.POST_VRP_data(this.vrpSessionByIdU, dataPost);
          
          let dataResUp: any = {};

          let ret = addInfoTalentClass.subscribe(dataRes => {
            dataResUp = dataRes;
          if(this.typeVrpSessionAct !== 'edit'){
              //this.VrpSessionInfoForm.patchValue({
              //  infoVrpId: dataRes.vrp_id,
              //});

              if (dataResUp.message === 'Success') {
                console.log(dataResUp);
                this.updPorposeMsg = 'Successfully Added';
                this.routers.navigate(['admin/vrp-batches']);
              } 
              else if (dataResUp.message === 'Overlap') {
  
                this.updPorposeMsg = dataResUp.status + ': Cannot add! Overlap with other session. ';
                console.log(dataResUp);
              }
              else if (dataResUp.message === 'DuplicateYear') {
  
                this.updPorposeMsg = dataResUp.status + ': Cannot add! Session with same year exists. ';
                console.log(dataResUp);
              }
              else{
  
                this.updPorposeMsg = dataResUp.status + ': '+ dataResUp.message + '.';
                console.log(dataResUp);
              }
          
          }
          else
          {

            if (dataResUp.message === 'Success') {
              console.log(dataResUp);
              this.updPorposeMsg = 'Successfully Updated';
              this.routers.navigate(['admin/vrp-batches']);
            } 
            else if (dataResUp.message === 'Overlap') {

              this.updPorposeMsg = dataResUp.status + ': Cannot Update! Overlap with other session. ';
              console.log(dataResUp);
            }
            else{

              this.updPorposeMsg = dataResUp.status + ': '+ dataResUp.message + '.';
              console.log(dataResUp);
            }

          }


          this.canEditPage = true;

          this.loadingSubmit = false;
      },
          error => {
              console.log('[ERROR + Failed to submit data: ' + error);
          }
      )
  } else {
      let j = this.VrpSessionInfoForm;
      if(j.controls['infoVrpYear'].status == 'INVALID') $('#errInfoVrpYear').removeClass("m--hide"); else $('#errInfoVrpYear').addClass("m--hide");
      if(j.controls['infoVrpStart'].status == 'INVALID') $('#errInfoVrpStart').removeClass("m--hide"); else $('#errInfoVrpStart').addClass("m--hide");
      if(j.controls['infoVrpEnd'].status == 'INVALID') $('#errInfoVrpEnd').removeClass("m--hide"); else $('#errInfoVrpEnd').addClass("m--hide");
      if(j.controls['infoVrpExit1'].status == 'INVALID') $('#errinfoVrpExit1').removeClass("m--hide"); else $('#errinfoVrpExit1').addClass("m--hide");
      if(j.controls['infoVrpExit2'].status == 'INVALID') $('#errinfoVrpExit2').removeClass("m--hide"); else $('#errinfoVrpExit2').addClass("m--hide");
      if(j.controls['infoVrpExit3'].status == 'INVALID') $('#errinfoVrpExit3').removeClass("m--hide"); else $('#errinfoVrpExit3').addClass("m--hide");
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