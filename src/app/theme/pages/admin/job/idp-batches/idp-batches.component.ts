import { IBDVars } from './../idp-batches-detail/idp-batches-detail-vars';
import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { IBVars } from './idp-batches-vars';
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

@Component({
  selector: 'app-idp-batches',
  templateUrl: './idp-batches.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./idp-batches.component.css']
})
export class IdpBatchesComponent implements OnInit {

  loading = true; errLoadData = IBVars.errLoadData; downloadAllXLS = IBVars.downloadAllXLS;
  ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
  title1 = IBVars.title1; title2 = IBVars.title2; pageSize = IBVars.pageSize; editIdpBatchPost = IBVars.editIdpBatchPost;

    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];

    getIDPBatchList = IBVars.getIDPBatchList;

  filterForm : FormGroup;

  constructor( 
    private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
    private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
    private datePipe: DatePipe, private _script: ScriptLoaderService,
    private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
      this.getReportFilter();
    }

    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/

    showAdvId = true; showPosName = true; showCompany = true; showDepartment = true; showLOB = true;

    data: any = {};
    data2: any = {};

    getReportFilter() {
      type jobPost = {
        idp_id: number, idp_year: string, idp_name: string, idp_start: Date, idp_due: Date, mobility: number, idp_inactive: number
      };
      let myarray: jobPost[] = [];
      this._GET_api_Service.GET_IDP_data(this.getIDPBatchList).subscribe(data => {
          for(let i=0; i<data.length; i++){
              myarray.push({
                idp_id: data[i].idp_id,
                idp_year: data[i].idp_year,
                idp_name: data[i].idp_name,
                idp_start: data[i].idp_start,
                idp_due: data[i].idp_due,
                mobility: data[i].mobility,
                idp_inactive: data[i].idp_inactive,
              });
          }
          this.data2 = myarray;
          this.setPage(1);
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

  setPage(page: number) {
      // get pager object from service
      this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
      // get current page of items
      this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  ngOnInit() {
    this.checkLevel(); 
    this.filterForm = new FormGroup({
        filterLob: new FormControl('', Validators.required),
        filterStatus: new FormControl('', Validators.required),
        filterStart: new FormControl('', Validators.required),
        filterEnd: new FormControl('', Validators.required),
    });
    this.filterForm.setValue({
        filterLob: "",
        filterStatus: "",
        filterStart: moment(moment().startOf('month')).subtract(2, 'months').format('DD-MM-YYYY'),
        filterEnd: moment().format('DD-MM-YYYY'),
    });

  }

  checkLevel() {
    let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
    if ((!/1/i.test(usrRole)) && (!/6/i.test(usrRole))) {
        this.routers.navigate(['/admin/unauthorized']);
        return false;
    }
  }

}
