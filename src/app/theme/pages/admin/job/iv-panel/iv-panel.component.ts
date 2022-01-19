import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { IVPVars } from './iv-panel-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';

// import { PagerService } from '../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PagerService } from '../../job/shared/pager/pager.component';
import { NotifierService } from 'angular-notifier';

export interface IOptionU {
    name: string,
    Staff_No:string
}

//declare let Dropzone: any;  
@Component({
    selector: 'app-iv-panel',
    templateUrl: './iv-panel.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./iv-panel.component.css']
    
})

export class IvPanelComponent implements OnInit {
    pager2: any = {};
    pageSize2 = 20;
    pagedItems2: any[];
    private readonly notifier: NotifierService;
    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        notifierService: NotifierService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) 
        {
            this.notifier = notifierService;
            this.getlob();
                        
        }
        filterForm : FormGroup;
        itvData; 
        descEmptyData2 = 'For better response, please customize your filter';
        loading2 = true;
        loadingRtg = false;
        displayPRating = false;

        selectStaffMult;
        nameStaff: string = '';
    foundStaff: boolean;
    optionsU: IOptionU[];
    selectedU: IOptionU[];

    ngOnInit() {
        this.itvData = [];  
        this.checkLevel();
        this.setPage2(1); 
        this.filterForm = new FormGroup({
            fltrStaff: new FormControl('', Validators.required),
            searchSID: new FormControl('', Validators.required),
            lobFilter: new FormControl('', Validators.required),
        
        });
               
        this.filterForm.setValue({
            fltrStaff: "", 
            searchSID:"",
            lobFilter:'',       
        });
        this.loading2 = false;
        this.submitFilter(1);

    }

    setPage2(page: number) {
        // get pager object from service
        this.pager2 = this.pagerService.getPager(this.itvData.length, page, this.pageSize2);
        // get current page of items
        this.pagedItems2 = this.itvData.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
    }
    
    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/3/i.test(usrRole)) && (!/5/i.test(usrRole))  && (!/8/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }

    // get LOB
    optLobList = [];
    mylob = '';
    getlob() {
         this._GET_api_Service.GET_REC_DATA(IVPVars.getLOBAPI).subscribe(data => {
         
          this.optLobList = data;
          if (data.length === 1) {
              this.mylob = this.optLobList[0].lob;
              this.filterForm.patchValue({ lob: this.mylob });
              console.log('this.optLobList',this.optLobList)
          }    
        //   this.loading = false;  
      }, error => {
          console.log('[ERROR - Fail to get report filters] ' + error);
      });
  }

    submitFilter(type) {
        this.loading2 = true;
             
        if (type === 1) {
            
                let dataPos;

                dataPos = {                   
                    text: this.filterForm.get('fltrStaff').value, 
                    lob: this.filterForm.get('lobFilter').value
                }
                
                this._POST_api_Service.POST_REC_data('/recruitment/admin/getListPanel', dataPos).subscribe(data => {
                    console.log(data)
                    this.itvData = data;
                    if (data.length === 0) {
                        this.descEmptyData2 = 'List is Empty';
                    }
                   
                    this.setPage2(1);
                    this.loading2 = false;
              
                }, error => {
                    this.loading2 = false;
                    console.log('[ERROR] Fail to submit filter' + error);
                });
          
        }

        //reset form
        else if (type === 2) {      
           this.filterForm.setValue({
            fltrStaff: "",
            searchSID: "",
            lobFilter: "",
            });
            
            this.loading2 = false;
            this.selectStaffMult = false;
            this.loadingScName = false;
            this.setPage2(1);
            this.pagedItems2.length=0;            
            this.pager2.pages.length=0;          
            this.itvData = [];                 
        }
    }

    checkRate1(rating, num){
        if(num > rating)
            return false;
        else 
            return true;
    }

    checkRate2(rating, num){
        if(num <= rating)
            return false;
        else
            return true;       
    }

    newRating; 
    hide_btn = false;
    rateChanged = false;
    ratingClicked(index,num){
        this.newRating = num;
        this.ratingData[0].myRating = num;
    }

    updateComnt(id){
        let rate = (<HTMLInputElement>document.getElementById("rate")).value;
        let pos = {
            panelID : id,
            rating : rate
        }

        this._POST_api_Service.POST_REC_data('/recruitment/admin/submitPanelRtg', pos).subscribe(res => {           
            if (res.status === "OK"){
                //console.log("rating ok")             
                this.notifier.notify('success','Success');
                document.getElementById('summary_modal').click();
                this.submitFilter(1);            
            }
        }, error => {
            //console.log("rating error")
            this.notifier.notify('error','Fail to submit rating');
            document.getElementById('summary_modal').click();
            this.submitFilter(1);
        })
        
    }

    ratingData;
    getPanelRating(staffid) {
        this.loadingRtg = true;   
        
        this._GET_api_Service.GET_REC_DATA('/recruitment/admin/getPanelRtgbyID/'+staffid).subscribe(data => {
            //console.log(data)        
            this.loadingRtg = false; 
            this.displayPRating = true;          
            this.ratingData = data;
        }, error => {
            console.log('[ERROR - Fail to get rating for panel '+staffid+' ] ' + error);
            this.loadingRtg = true;
        });      
    }

    getFlStaff(data) {
        this.loadingScName = false;
        this.selectStaffMult = false; 
        // this.filterForm.setValue({fltrStaff:data.name,searchSID:data.Staff_No});
    }
    
    multiSelStaff: any = [];
    dtSearch: any = {};
    dataSearch: any = [];
    loadingScName = false;  
    searchStaff(name) {
        let data = {
            text: name
        }
        //let searchUserSend = this._POST_api_Service.POST_REC_data('/recruitment/admin/searchPanel2', data);
        let searchUserSend = this._POST_api_Service.POST_REC_data('/recruitment/admin/searchPanel2', data);
        let ret = searchUserSend.subscribe(dataRes => {
            this.dtSearch = dataRes;
            this.loadingScName = true;
            if (this.dtSearch.length >= 1) {
                
                if (this.dtSearch.length > 10) {
                    this.dataSearch = this.dtSearch.slice(0, 10);
                }
                else {
                    this.dataSearch = this.dtSearch;
                }
            }
            else{
                this.displayNoResult2 = true;
                //console.log('no result for staff')
            }
                         
        },
            error => {
                console.log('[ERROR + Staff Not Found]', error);
            })
    }

    displayNoResult2 = false;
    onNameKeyUpStaff(event: any) {        
        this.nameStaff = event.target.value;
        this.foundStaff = false;
        this.selectStaffMult = false;

        if (this.nameStaff.length === 0) {
            this.selectStaffMult = false;
            this.loadingScName = false;
        }
        else{
            this.displayNoResult2 = false;
            this.selectStaffMult = true;
            this.loadingScName = true;     
            if (this.multiSelStaff.length < 1 && this.nameStaff.length > 2) {
                this.searchStaff(this.nameStaff);                         
            }
        }           
    }

    resetStaff(){       
        if (this.selectStaffMult === true) {
            //console.log ('close ddwn and reset Staff')
            this.loadingScName = false;
            this.selectStaffMult = false;
            //this.filterForm.patchValue({ fltrStaff: ''});
            this.filterForm.setValue({fltrStaff:'',searchSID:''});
        }
    }

    resetDDVal(){      
        if (this.selectStaffMult === true) {
            //console.log ('reset Staff')
            this.loadingScName = false;
            this.selectStaffMult = false;
            //this.filterForm.patchValue({ fltrStaff: ''});
            this.filterForm.setValue({fltrStaff:'',searchSID:''});
        }
    }

    closeDropdownFilter2() {
        //console.log('close dropdown for Staff')
        this.loadingScName = false;
        this.selectStaffMult = false;       
    }
}