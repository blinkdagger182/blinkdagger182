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

import { IBDVars } from './idp-batches-detail-vars';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../shared/format-datepicker';

import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
declare let Dropzone: any;
@Component({
  selector: 'app-idp-batches-detail',
  templateUrl: './idp-batches-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./idp-batches-detail.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
  })

@Injectable()
export class IdpBatchesDetailComponent implements OnInit, AfterViewInit {


  //env = GlobalVariable.ENV_NAME;
  //env_prod = false;
  
  loading = true;

 //edit page or create page
  canEditPage = false;
  title1 = IBDVars.title1;
  tab1Title = IBDVars.tab1Title;
  idpBatchByIdC = IBDVars.idpBatchByIdC;
  idpBatchByIdU = IBDVars.idpBatchByIdU;
  loadingSubmit = false;
  updPorposeMsg = IBDVars.updPorposeMsg;

  private getIDPBatchDataAPI = IBDVars.idpBatchById;

  thisPodId = this.route.snapshot.paramMap.get('id');
  data: any = {};

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
}

  ngAfterViewInit() {
    this._script.loadScripts('app-idp-batches-detail',
        [
            //'assets/js/app.js',
            //'assets/js/jobs/job-details-form.js',
            //'assets/js/jobs/job-details-alert.js',
            'assets/js/main/bootstrap-select.js',
        ]);
    Dropzone._autoDiscoverFunction();
}

  onIdpBatchInfoFormSubmit() {

    console.log(this.IdpBatchInfoForm)

      let dataPost: any = {};
      if (this.IdpBatchInfoForm.status == 'VALID'){
          if (this.typeIDPBatchAct == 'edit') {
              dataPost = {
                  idp_id: this.IdpBatchInfoForm.get('infoIdpId').value,
                  idp_year: this.IdpBatchInfoForm.get('infoIdpYear').value,
                  idp_name: this.IdpBatchInfoForm.get('infoIdpName').value,
                  idp_start: this.IdpBatchInfoForm.get('infoIdpStart').value,
                  idp_due: this.IdpBatchInfoForm.get('infoIdpDue').value,
                  mobility: this.IdpBatchInfoForm.get('infoMobility').value,
                  idp_cmpl_start: this.IdpBatchInfoForm.get('infoIdpCompStart').value,
                  idp_cmpl_due: this.IdpBatchInfoForm.get('infoIdpCompDue').value
              }
          }
          else {
              dataPost = {
                  idp_year: this.IdpBatchInfoForm.get('infoIdpYear').value,
                  idp_name: this.IdpBatchInfoForm.get('infoIdpName').value,
                  idp_start: this.IdpBatchInfoForm.get('infoIdpStart').value,
                  idp_due: this.IdpBatchInfoForm.get('infoIdpDue').value,
                  mobility: this.IdpBatchInfoForm.get('infoMobility').value,
                  idp_cmpl_start: this.IdpBatchInfoForm.get('infoIdpCompStart').value,
                  idp_cmpl_due: this.IdpBatchInfoForm.get('infoIdpCompDue').value
              }
          }
          dataPost = JSON.stringify(dataPost);
          console.log(dataPost);
          let addInfoCareer = this._POST_api_Service.POST_IDP_data(this.typeIDPBatchAct == 'edit' || this.canEditPage ? this.idpBatchByIdU : this.idpBatchByIdC, dataPost);
          let ret = addInfoCareer.subscribe(dataRes => {
              console.log(dataRes)
              if (dataRes.status === 'OK') window.history.back();

              // this.routers.navigate(['admin/job/advertisement/new-career/detail', dataRes.length > 0 ? dataRes[0].Position_ID : this.IdpBatchInfoForm.get('infoPosId').value]);

              if(!this.canEditPage){
                  //this.IdpBatchInfoForm.patchValue({
                  //  infoIdpId: dataRes.idp_id,
                  //});
                  this.updPorposeMsg = 'Successfully added new batch';
                  this.routers.navigate(['admin/job/idp-batches/edit', dataRes.idp_id]);
              
              }
              else
              {
                this.updPorposeMsg = 'Successfully updated batch';
                this.routers.navigate(['admin/job/idp-batches/edit', dataRes.idp_id]);
              }

              this.loading = true;
              this.canEditPage = true;
              this.typeIDPBatchAct = 'edit';

              //this.getJobDetailData(dataRes.length > 0 ? dataRes[0].Position_ID : this.IdpBatchInfoForm.get('infoIdpId').value);
              //this.getRequestor();
              //this.declareInputField();

              this.loading = false;
              this.loadingSubmit = false;
          },
              error => {
                  console.log('[ERROR + Failed to submit data: ' + error);
              }
          )
      } else {
          let j = this.IdpBatchInfoForm;
          if(j.controls['infoIdpYear'].status == 'INVALID') $('#errInfoIdpYear').removeClass("m--hide"); else $('#errInfoIdpYear').addClass("m--hide");
          if(j.controls['infoIdpName'].status == 'INVALID') $('#errInfoIdpName').removeClass("m--hide"); else $('#errInfoIdpName').addClass("m--hide");
          if(j.controls['infoIdpStart'].status == 'INVALID') $('#errInfoIdpStart').removeClass("m--hide"); else $('#errInfoIdpStart').addClass("m--hide");
          if(j.controls['infoIdpDue'].status == 'INVALID') $('#errInfoIdpDue').removeClass("m--hide"); else $('#errInfoIdpDue').addClass("m--hide");
          if(j.controls['infoMobility'].status == 'INVALID') $('#errInfoMobility').removeClass("m--hide"); else $('#errInfoMobility').addClass("m--hide");
          if(j.controls['infoIdpCompStart'].status == 'INVALID') $('#errinfoIdpCompStart').removeClass("m--hide"); else $('#errinfoIdpCompStart').addClass("m--hide");
          if(j.controls['infoIdpCompDue'].status == 'INVALID') $('#errinfoIdpCompDue').removeClass("m--hide"); else $('#errinfoIdpCompDue').addClass("m--hide");
      }

  }

    constructor(private routers: Router, private _GET_api_Service: GET_Service, 
        private _POST_api_Service: POST_Service, private http: Http,
        private route: ActivatedRoute, private formBuilder: FormBuilder,
        private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        //this.routers.navigate(['job/advertisement-tracking/all']);          
    }

    funcComCat;
    IdpBatchInfoForm: FormGroup;
    typeIDPBatchAct = '';

    ngOnInit() {
        let type = (this.routers.url).split("/").pop();
        if (type === 'create') {
            this.loadFilter([]);
        } else {
            let subtype = this.routers.url.substring(0, this.routers.url.lastIndexOf('/'));

            if(subtype === '/admin/job/idp-batches/detail'){
                this.canEditPage = false;
                this.typeIDPBatchAct = 'post';
            } else {
                this.canEditPage = true;
                this.typeIDPBatchAct = 'edit';
            }
            this.getIdpBatchDetailData();
        }

        this.IdpBatchInfoForm = new FormGroup({
            infoIdpId: new FormControl(0, Validators.required),
            infoIdpYear: new FormControl('', Validators.required),
            infoIdpName: new FormControl('', Validators.required),
            infoIdpStart: new FormControl('', Validators.required),
            infoIdpDue: new FormControl('', Validators.required),
            infoMobility: new FormControl('', Validators.required),
            infoIdpCompStart: new FormControl('', Validators.required),
            infoIdpCompDue: new FormControl('', Validators.required),
        
        });
    }

    loadFilter(data){
        this.loading = true;

        if (this.typeIDPBatchAct === 'edit') {

            this.IdpBatchInfoForm.patchValue({
                infoIdpId: data.idp_id,
                infoIdpYear: data.idp_year,
                infoIdpName: data.idp_name,
                infoIdpStart: data.idp_start,
                infoIdpDue: data.idp_due,
                infoMobility: data.mobility,
                infoIdpCompStart: data.idp_cmpl_start,
                infoIdpCompDue: data.idp_cmpl_due
            });

            

            this.loading = false;
        } else { 
            this.loading = false;
        }
    }

    getIdpBatchDetail(dataID = null) {
        var newBatchId = this.route.snapshot.paramMap.get('id');
        if((this.routers.url).split("/").pop() == 'create' && dataID != null){
            newBatchId = dataID;
            this.thisPodId = dataID;
        }
        return this._GET_api_Service.GET_IDP_data(this.getIDPBatchDataAPI + newBatchId);
    }
	
    errLoadData = IBDVars.errLoadData;
	
    getIdpBatchDetailData(dataID = null) {
        this.getIdpBatchDetail(dataID).subscribe(data => {
            this.data = data;
            this.loading = false;

            if(this.routers.url.substring(0, this.routers.url.lastIndexOf('/')) == '/admin/job/idp-batches/detail' || dataID != null){
                this.loadFilter(this.data[0]);
                //this.initInputField(this.data);
            } 

            if(this.routers.url.substring(0, this.routers.url.lastIndexOf('/')) == '/admin/job/idp-batches/edit'){
                this.loadFilter(this.data[0]);
                //this.initInputField(this.data);

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

        //this.canUpdPosDesc = true;

    }

}
