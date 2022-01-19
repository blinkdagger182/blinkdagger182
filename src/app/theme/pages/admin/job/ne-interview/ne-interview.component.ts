import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation, Injectable,ElementRef } from '@angular/core';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { PagerService } from '../../job/shared/pager/pager.component';
import { Http, Response, URLSearchParams, HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { nePromoVars } from './ne-interview-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../shared/format-datepicker';


export interface IOption {
    Staff_No: string,
    name: string
}


@Component({
    selector: 'app-ne-interview',
    templateUrl: './ne-interview.component.html',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./ne-interview.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
      ]
})

@Injectable()

export class NEinterviewComponent implements OnInit, AfterViewInit {
    currUsr = JSON.parse(localStorage.getItem('currentUser'));

    lgnName = this.currUsr.body.name;
    lgnRole = this.currUsr.job_name;
    isAdmin = true;
    showUserName = true;
    sessionPg = true;
    viewSession = false;
    crSession = false;
    viewPanel = false;
    viewCandidate = false;
    loading1 = true; loading2 = true; loading3 = true; loading4 = true; loading5 = true;

    tokenExists = false;
    currentUser;
    loading = false; errLoadData = nePromoVars.errLoadData;
    ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
    title1 = nePromoVars.title1; pageSize = nePromoVars.pageSize; APIGetImg = nePromoVars.APIGetImg;
    
    apiUrl: string;
   
    showAdvId = true; showPosId = true; showPosName = true; showCreator = true; showLOB = true; 
    showStatus = true; showDtStart = true; showDtEnd = true; showVenue = true; showVenueType = true; showAct = true; showForm = false;

    data: any = {};
    data2: any = [];
    public term: string;
    styleTypeViewAll: string; styleTypeViewAct: string;
    styleTypeViewEva: string; styleTypeViewIv: string;
    styleTypeViewCom: string; styleTypeViewRev: string;
   
    private allItems: any[];
    
    model: any = {};
    imgOptArrList: any;
    supervisorImg: any;
    userList = [];
   
    filterForm: FormGroup;
    summaryForm : FormGroup;
    ViewApplicantData : FormGroup;
    createSessionfrm: FormGroup;
    addSessionForm: FormGroup;
    editSessionForm: FormGroup;
    addPanelForm: FormGroup;
    editPanelForm: FormGroup;
    editCandidateForm: FormGroup;
    name: string = '';
    addNewForm: FormGroup;
    addSearchForm:FormGroup;
    results: boolean;
    getListLoading = false;
    idx: string;
    descEmptyData = 'For better response, please customize your filter';
    errNoData: '--- No Data ---';

    // FIlter params
    public termAdvId: string;
    public termPosId: string; public termJobTtl: string; public termPosName: string;
    public termLOB: string; public termTtlApp: string; public termStatus: string;
    public termDtStart: string; public termDtEnd: string;
    public termDtStart2: Date; public termDtEnd2: Date;
    public termTtlAppMin: string; public termTtlAppMax: string;
    public termCreator: string;
        
     // pager object
    pager: any = {};
    pagedItems: any[];
    options: IOption[]; 
    selected: IOption[];
    downloadAll = false;

    private readonly notifier: NotifierService;

      
    constructor(
        private pagerService: PagerService,
        private _GET_api_Service: GET_Service, 
        private _POST_api_Service: POST_Service,
        private activeRoute: ActivatedRoute, 
        private routers: Router,
        private datePipe: DatePipe, 
        private _script: ScriptLoaderService,
        private _alertService: AlertService, 
        private cfr: ComponentFactoryResolver,
        private http: Http,
        notifierService: NotifierService,
        ) {
       
        this.getlistInterview();
        this.notifier = notifierService;
        this.getReportFilter();
        this.getlob();
        this.activeRoute.params.subscribe(params => {
            this.selApplicant = params.id;
            this.interviewDetails(this.selApplicant)
           
        });
       
       }
    
    env = GlobalVariable.ENV_NAME;
    env_prod = false;

    urlImg = {
        front: GlobalVariable.BASE_API_URL + nePromoVars.APIGetImg,
        key: GlobalVariable.API_KEY,
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
    
     
 
    ngAfterViewInit() {
        this._script.loadScripts('app-iv-session.component',
        [
            'assets/js/superadmin/delete-alert.js',
        ]);
   }

       
    title: string;
    getDeepestTitle:string;
    typeView = [];
    
    ngOnInit() {
        if(this.env === 'prod')
            this.env_prod = true;
        else
            this.env_prod = false;
            
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let type = this.activeRoute.snapshot.paramMap.get('type');
        this.checkLevel();
   
        let node = this.activeRoute.snapshot.queryParams['node'];
        
        this.filterForm = new FormGroup({
            adsIDFilter: new FormControl('', Validators.required),
            advPosTitleFilter: new FormControl('', Validators.required),
            advPosCreatorFilter: new FormControl('', Validators.required),
            lobFilter: new FormControl('', Validators.required),
            statusFilter:  new FormControl('', Validators.required),
                    
        });
      
        this.addNewForm = new FormGroup({
            InvPanelName: new FormControl("", Validators.required),//minLength(2)),
        });

        this.addPanelForm = new FormGroup({
            txtSearchPanel: new FormControl("", Validators.required),
        });


        this.addSessionForm = new FormGroup({
            txtStartDate: new FormControl("", Validators.required),
            txtEndDate: new FormControl("", Validators.required),
            txtVenueType: new FormControl("", Validators.required),
            txtVenue: new FormControl("", Validators.required),
        });

        this.editSessionForm = new FormGroup({
            editStartDate: new FormControl("", Validators.required),
            editEndDate: new FormControl("", Validators.required),
            editVenueType: new FormControl("", Validators.required),
            editVenue: new FormControl("", Validators.required),
        });

        this.editPanelForm = new FormGroup({
            editPnName: new FormControl("", Validators.required),
            editPnPos: new FormControl("", Validators.required),
            editPnLob: new FormControl("", Validators.required),
            editPnRole: new FormControl("", Validators.required),
        });

        this.editCandidateForm = new FormGroup({
            editCnDate: new FormControl("", Validators.required),
            editCnCate: new FormControl("", Validators.required),
        });

        this.addSessionForm.setValue({
            txtStartDate: "",
            txtVenueType: "",
            txtEndDate: "",
            txtVenue: "",
        });

        this.addSearchForm = new FormGroup({
           newSearch: new FormControl()
        });

        this.resetForm();
        this.setPage(1);
        this.data2 = [];
    }

    //Dropdown list
    sessionVenueType = ['Physical', 'Virtual'];
    panelRoleType = ['Head Interview Panel', 'Interview Panel'];
    statusType = ['Create Session', 'In Progress', 'Submitted', 'Started','Completed'];


    //scroll to element
    scrollToElementView(): void {
        let element = document.getElementById('sessionDiv');
         element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    scrollToViewSession(): void {
        let element = document.getElementById('sessionDiv');
         element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }

    //Reset filter
     resetFilter(){
        this.filterForm.setValue({
            adsIDFilter: "",
            advPosTitleFilter: "",
            advPosCreatorFilter: "",
            lobFilter: "",
            statusFilter: "",
        });     
     }
       
    resetPanelForm() {
        this.addPanelForm.setValue({
        txtSearchPanel: "",
      });
     }

    //Reset add session
    resetForm() {
        this.addSessionForm.setValue({
            txtStartDate: "",
            txtVenueType: "",
            txtEndDate: "",
            txtVenue: "",
        });
    }

    //Reset edit Panel form
    resetEditPanelForm() {
        this.editPanelForm.setValue({
            editPnRole: "",
        });
    }

    
    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/1/i.test(usrRole)) && (!/3/i.test(usrRole)) && (!/5/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }
   
	getImgOptCurrent() {
        this._GET_api_Service.GET_Picture('/get/image/' + this.currentUser.body.image_url).subscribe(data => {
            if(data){
                this.imgOptArrList = GlobalVariable.BASE_API_URL + this.APIGetImg + "/" + this.currentUser.body.image_url + "?api_key=" + GlobalVariable.API_KEY;
            }
            
        },
        error => {
            this.imgOptArrList = '0';
            console.log('[ERROR Get Image]' + error); 
        });
    }

     
     // Post Applicant Details
     advertId: any = {};;
     applicantDetails = [];
     panelDetail = [];
     candidateDetail = [];
     applicantSummary = [];
     reportArr = [];
     positionTtl;
     startTime;
         
     interviewDetails(idx){
         let sessionPost = {
             advId: idx
         }

          this.getListLoading = true;
          this._POST_api_Service.POST_IDP_data(nePromoVars.postApplicantDetails, sessionPost).subscribe(dataRes => {
          this.applicantSummary = dataRes.summary;
          this.applicantDetails = dataRes.summary.datasession;
          this.panelDetail = dataRes.summary.datapanel;
          this.candidateDetail = dataRes.summary.datacandidate;
                            
           this.loading = false; 
           this.getListLoading = false;              
           this.crSession = true;
           this.viewSession = true;
           this.viewPanel = true;
           this.viewCandidate = true;
           this.resetForm();
         });

          //postDownloadReport
          this.reportArr = [];
          this._POST_api_Service.POST_IDP_data(nePromoVars.postDownloadReport, sessionPost).subscribe(dataRes => {
          let datadownloadRep: any = {};
              datadownloadRep = dataRes;
              for (let i = 0; i < dataRes.length; i++){
                  this.reportArr = dataRes;
              }
              this.loading = false; 
            
              },
              error => {
                  console.log('[ERROR + User Not Found]', error);
              })
       }

    //NE Promo

    getNEJobDetail(idx) {
        let data = {
            advId: idx
        }
        return this._POST_api_Service.POST_data(nePromoVars.postApplicantDetails, data); //this.POSTMethodByAPI(this.getJobDataAPI, data);
    }
   
    getNEPromoDetailData(idx) {
        this.getNEJobDetail(idx).subscribe(data => {
            this.loading = false;

            this.data = data;
          
        },
        error => {
            this.showAlert('alertError');
            this._alertService.error(this.errLoadData);
            console.log('[ERROR] Adv Details: ' + error);
            this.loading = false;
        })

    }

    //Submit filter
    errorDate = false;
    submitFilter(type){
        this.descEmptyData = 'List is Empty';
        
        let dataPos = {};
       
        if(type === 0){
            dataPos = {
                advId: '',
                postTitle: '',
                advertiser: '',
                lob: '',
                status: '',
            }
        }
        else if(type === 1){
           
            dataPos = {
                advId: this.filterForm.get('adsIDFilter').value,
                postTitle: this.filterForm.get('advPosTitleFilter').value,
                advertiser: this.filterForm.get('advPosCreatorFilter').value=== 'All'|| this.filterForm.get('advPosCreatorFilter').value === null ? '' : this.filterForm.get('advPosCreatorFilter').value,
                lob: this.filterForm.get('lobFilter').value,
                status: this.filterForm.get('statusFilter').value,
            }
         }  
            this.loading = true;
            this.sessionPg = true;
                  
          this._POST_api_Service.POST_IDP_data(nePromoVars.postSearchFilter, dataPos).subscribe(dataRes => {
            let dataSearchArr: any = {};
             dataSearchArr = dataRes;
                                        
            this.loading = false;   
            this.data2 = dataSearchArr;
            this.setPage(1);
            this.loading = false;
            this.viewPanel = true;
            this.viewCandidate = true;
                                            
        }, error => {
            console.log('[ERROR] Fail to submit filter: ' + error);
            if(error == 'Error: 500'){
                this.data2 = [];
                this.setPage(1);
                this.loading = false;
            }
        });
    }  
    
      //Set filter Lob and Advertiser
      filters = {};
      getReportFilter() {
              this.filters= {};
              this._GET_api_Service.GET_IDP_data(nePromoVars.postFilterLobAdv).subscribe(data => {
              this.filters = data;
              this.loading = false;  
           
             }, error => {
              console.log('[ERROR - Fail to get report filters] ' + error);
          });
      }

      optLobList = [];
      mylob = '';
      getlob() {
           this._GET_api_Service.GET_REC_DATA(nePromoVars.getLOBAPI).subscribe(data => {
           
            this.optLobList = data;
            if (data.length === 1) {
                this.mylob = this.optLobList[0].lob;
                this.filterForm.patchValue({ lob: this.mylob });
            }    
            this.loading = false;  
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }
           
   //search panel
    getPanelDetailData = []
    selectPanelName = false;
    getPanelDetail(e) {
        let data = {
            advId: this.selApplicant,
            text: e
        }
      this.selectPanelName = true;
      this._POST_api_Service.POST_IDP_data(nePromoVars.postSearchPanel, data).subscribe(dataRes => {
      this.getPanelDetailData = dataRes;
        });
    }
  
    //get panel detail
    staffnoPanel;
    namePanel;
    idPanel;
    getPanel(pnl) {
      this.selectPanelName = false;
      this.staffnoPanel = pnl.Staff_No;
      this.namePanel = pnl.name;
      this.idPanel = pnl.id;
      this.addPnLoading = false; 
    }

     
  //Add panel
   addPnLoading = false;
    addPanel(){ 
      let dataAddPanel: any = {};
    
      dataAddPanel = {
          advId: this.selApplicant,
          id:this.idPanel,
       }
      
      this.addPnLoading = true; 
      this.loading = true; 
     
      let addUserSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postAddPanel, dataAddPanel);
      let dataAdd: any = {};
      let ret = addUserSend.subscribe(dataRes => {
          dataAdd = dataRes;

          if (dataAdd.status === "OK") {
            this.notifier.notify('success', 'Successful Add New Panel!');
            this.interviewDetails(this.selApplicant);
            // this.submitFilter(1);
            } else {
            this.notifier.notify('error', 'Error - Cannot add duplicate panel!');
        }
          this.loading = false; 
          this.addPnLoading = false; 
         },
          error => {
              console.log('[ERROR + User Not Found: ' + error);
         }) 
    }
        
     
    // Get List Applicant
    applicantList = [];
    getlistInterview() {
        
        this.loading = true; 
        this.getListLoading = false;
        this._GET_api_Service.GET_IDP_data(nePromoVars.getListApplicant).subscribe(data => {
            this.applicantList = data;
            this.setPage(1);
            this.loading = false; 
        });
    }

     // Set page
    
    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

   
    //Select name
    selApplicant: any = {};
   
    selectedAppName(applId) {
        this.selApplicant = applId;
        this.interviewDetails(this.selApplicant);
     }

           
    //Select Panel for delete
       selPanel: any = {};
        selectInvPanel(panelId) {
            this.selPanel = panelId;
            this.delPanel();
        }   

    //Delete Panel
      delPanelLoading = false;
      delPanel(){
        let data = {
            advId: this.selApplicant,
            panelId: this.selPanel
        }
       
        this.delPanelLoading = true;
        this.loading = true; 
        let delUserSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postDeletePanel, data);
        let dataDel: any = {};
        let ret = delUserSend.subscribe(dataRes => {
            dataDel = dataRes;
            if (dataDel.status === "OK") {
                this.notifier.notify('success', 'Successfully Delete Panel !');
                this.interviewDetails(this.selApplicant);
           
            } else {
                this.notifier.notify('error', 'Error - Fail to delete Panel !');
            }
            this.delPanelLoading = false;
            this.loading = false; 
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
        }

      //Select Panel staff
      showPanelDialog = false;
      selectPnId: any = {};
      selectNamePn;
      selectPosPn;
      selectLobPn;
      selectRolePn;
     
      selectPanel(pnId) {
          this.selectPnId = pnId.panel_id;
          this.selectNamePn = pnId.name;
          this.selectPosPn = pnId.post_Desc;
          this.selectLobPn = pnId.lob;
          this.selectRolePn = pnId.rolename;
       
          this.showPanelDialog = true;
            $('#editPanelRole').click();
            this.loading = false;
        }   
     
    //Edit Panel
 
     editPanel(){ 
        let dataEditPnPost: any = {};
      
        dataEditPnPost = {
            sessionId: this.selApplicant,
            panelId: this.selectPnId
        }
        this.loading = true; 
       
        let editPnSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postEditPanel, dataEditPnPost);
        let dataEditPn: any = {};
        let ret = editPnSend.subscribe(dataRes => {
            dataEditPn = dataRes;
            
            if (dataEditPn.status === 0) {
                this.notifier.notify('success', 'Successfully edit Panel Role!');
                this.interviewDetails(this.selApplicant);
                this.submitFilter(1);
             } else {
                this.notifier.notify('error', 'Error - Duplicate Head Panel!');
            }
            this.loading = false; 
            
            },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
           }) 
         }
         
   
    //Select Candidate
    showCandidateDialog = false;
    selectCnId;
    selectCnName;
    selectCnPos;
    selectCnCate;
    selectCnDate;
    nameCate;
    selectIntDate;
   
    selectCandidate(cn) {
        this.selectCnId = cn.Staff_No;
        this.selectCnName = cn.Name;
        this.selectCnPos = cn.post_desc;
        this.selectCnCate = cn.criteria;

        if(this.selectCnCate == "null"){
            this.nameCate = "In Progress";
        }else if(this.selectCnCate == "0"){
            this.nameCate = "lateral";
        }else if(this.selectCnCate == "1"){
        this.nameCate = "Promotion";
        }else if(this.selectCnCate == "2"){
        this.nameCate = "Does Not Meet Promotion Criteria";
        }
       
        this.selectCnDate = cn.start_time;
        this.selectIntDate = cn.interviewDate;

        this.showCandidateDialog = true;
          $('#editCandidate').click();
          this.loading = false;
     }   

      
    // Edit Candidate DateAndTime
    selCandEd: any = {};
    editCandidate(){
      
     let candIntDt = ((document.getElementById("editCnDate") as HTMLInputElement).value); 

      let dataPostCandidate = {
            advId: this.selApplicant,
            staffId: this.selectCnId,
            iv_date: candIntDt,
       }
      this.loading = true; 
      this._POST_api_Service.POST_IDP_data(nePromoVars.postEditCandidate, dataPostCandidate).subscribe(dataRes => {
        let dataEdCandArr: any = {};
            dataEdCandArr = dataRes;

           if (dataEdCandArr.status === 0) {
                this.notifier.notify('success', 'Successfully Edit Date & Time!');
                this.interviewDetails(this.selApplicant);
                this.submitFilter(1);
            } else {
                this.notifier.notify('error', 'Error - Fail: Date & time should not be less or more than Interview date!');
            }
            this.loading = false;  
        
        },
          error => {
              console.log('[ERROR + User Not Found]', error);
          })
      }



    //To set Candidate Absent (old)
    
     selCandAbs: any = {};
     candidateAbsent(candId){
        this.selCandAbs = candId;
       let dataCandidate = {
            appId: candId
        }
      
       this.loading = true; 
       let absCandSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postAbsentCandidate, dataCandidate);
       let dataAbsCand: any = {};
       let ret = absCandSend.subscribe(dataRes => {
            dataAbsCand = dataRes;
            if (dataAbsCand.status === "OK") {
                this.notifier.notify('success', 'Successfully Set Status Absent!');
                this.interviewDetails(this.selApplicant);
                this.submitFilter(1);
                this.loading = false; 
            } else {
                this.notifier.notify('error', 'Error - Fail to set Status Absent!');
            }
           
            this.loading = false; 
           
         },
           error => {
               console.log('[ERROR + User Not Found]', error);
           })
           return;
   }


   //To set Candidate Attend and Absent
  
   selCandAtt: any = {};
   candidateAttend(candIdAtt){
      this.selCandAtt = candIdAtt;
     let dataCand = {
        advId: this.selApplicant,
        candidateId: candIdAtt
      }
         
     this.loading = true; 
     let attCandSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postActiveCandidate, dataCand);
     let dataAttCand: any = {};
     let ret = attCandSend.subscribe(dataRes => {
        dataAttCand = dataRes;
          if (dataAttCand.status === "OK") {
              this.notifier.notify('success', 'Successful!');
              this.interviewDetails(this.selApplicant);
              this.submitFilter(1);
          } else {
              this.notifier.notify('error', 'Error - Fail to set Status!');
          }
          this.loading = false; 
        },
         error => {
             console.log('[ERROR + User Not Found]', error);
         })
         return;
     }

        
    //Add Session
    
    addSession(){
        let dataAddPost: any = {};
               
            dataAddPost = {
                advId: this.selApplicant,
                iv_start:this.addSessionForm.get('txtStartDate').value,
                iv_end:this.addSessionForm.get('txtEndDate').value,
                venue_type: this.addSessionForm.get('txtVenueType').value,
                venue: this.addSessionForm.get('txtVenue').value,
            }

        this.loading = true; 
        let addUserSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postAddSession, dataAddPost);
        let dataAdd: any = {};
        let ret = addUserSend.subscribe(dataRes => {
            dataAdd = dataRes;
            if (dataAdd.status === 0) {
                this.notifier.notify('success', 'Successfully Create Session!');
                this.interviewDetails(this.selApplicant);
                this.submitFilter(1);
             } else if (dataAdd.status === -1){
                this.notifier.notify('error', 'Error: Start Date shall not less than Current date OR End Date/Time shall not less than Start Date/Time!');
            }
            this.resetForm();
            this.loading = false; 
            
            },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
           }) 
       }
       

    //Edit Session
   
    editSession(){
        
        let dataEditPost: any = {};
        let sesStartDt = ((document.getElementById("editStartDate") as HTMLInputElement).value); 
        let sesEndDt = ((document.getElementById("editEndDate") as HTMLInputElement).value); 
        
        dataEditPost = {
            advId: this.selApplicant,
            iv_start:sesStartDt,
            iv_end:sesEndDt,
            venue_type: this.editSessionForm.get('editVenueType').value,
            venue: this.editSessionForm.get('editVenue').value,
        }
            this.loading = true; 
            let EditSesSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postEditSession, dataEditPost);
            let dataEdit: any = {};
            let ret = EditSesSend.subscribe(dataRes => {
                dataEdit = dataRes;
                if (dataEdit.status === 0) {
                    this.notifier.notify('success', 'Successfully Edit Session!');
                    this.interviewDetails(this.selApplicant);
                    this.submitFilter(1);
                   
                } else if (dataEdit.status === -1) {
                    this.notifier.notify('error', 'Error: please check Date/Time!');
                }
                this.resetForm();
                this.loading = false; 
               
                },
                error => {
                    console.log('[ERROR + User Not Found: ' + error);
               }) 
             }    
 

    // Save as Draft
    interviewStatusName;
    saveDraft() {
        let posData = {      
            advId: this.selApplicant,
        }
        
        this._POST_api_Service.POST_IDP_data(nePromoVars.postSaveDraft, posData).subscribe(dataRes => {
            let dataSaveDraftArr: any = {};
                dataSaveDraftArr = dataRes;
                if (dataSaveDraftArr.status === "OK") {
                    this.interviewStatusName = "Draft";
                    $('#saveAsDraftModal').click();
                    this.notifier.notify('success', 'Record Successfully Save As Draft!');
                    this.submitFilter(1);
                } else {
                    this.notifier.notify('error', 'Error - Fail to Save As Draft !');
                }
                this.loading = false;       
                },
                error => {
                    console.log('[ERROR + User Not Found]', error);
                })
                return;
        }
   


    //Submit To HR
   loadingSubmit = false;
   submitToHR(){
      
     let dataSubmit = {
        advId: this.selApplicant,
     }
      
     this.loading = true; 
     this.loadingSubmit = true;
     let submitSend = this._POST_api_Service.POST_IDP_data(nePromoVars.postSubmit, dataSubmit);
     let dataSubmitArr: any = {};
     let ret = submitSend.subscribe(dataRes => {
        dataSubmitArr = dataRes;
          if (dataSubmitArr.status === 0) {
              this.notifier.notify('success', 'Record Successfully updated!');
              this.submitFilter(1);
              this.interviewDetails(this.selApplicant);
          } else {
              this.notifier.notify('error', 'Error - Fail to Submit - No Head Panel !');
        }
          this.loading = false; 
          this.loadingSubmit = false;
        },
         error => {
             console.log('[ERROR + User Not Found]', error);
         })
         return;
     }

     //Download Report
     downloadReport() {
        this.downloadAll = true;
        var csvData = this.ConvertToCSV(this.reportArr);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type:  'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Interview_Session_' + dateToday + '.csv';
        a.click();
        this.downloadAll = false;
        return 'success';
      }
    
      downloadCSV = true;
      ConvertToCSV(objArray) {
          var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
          var str = ''; var row = "";
    
          for (var index in objArray[0]) {
              if ((index !== 'st_date2') && (index !== 'end_date2')) {
                  row += index + ',';//Now convert each value to string and comma-separated
              }
          }
          row = row.slice(0, -1);
          //append Label row with line break
          str += row + '\r\n';
    
          for (var i = 0; i < array.length; i++) {
              var line = '';
              for (var index in array[i]) {
                  if (line != '') line += ','
                  //line += '"' + array[i][index] + '"';
                  if ((index !== 'st_date2') && (index !== 'end_date2')) {
                      line += '"' + array[i][index] + '"';
                  }
              }
              str += line + '\r\n';
          }
          return str;
      }
}  

     

