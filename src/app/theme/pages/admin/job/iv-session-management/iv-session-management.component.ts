import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, Injectable,ElementRef } from '@angular/core';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { PagerService } from '../../job/shared/pager/pager.component';
import { Http, Response, URLSearchParams, HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IVSMVars } from './iv-session-management-vars';
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


export interface IOption {
    Staff_No: string,
    name: string
}


@Component({
    selector: 'app-iv-session-management',
    templateUrl: './iv-session-management.component.html',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['./iv-session-management.component.css'],
})

@Injectable()

export class IvSessionManagementComponent implements OnInit {
    currUsr = JSON.parse(localStorage.getItem('currentUser'));

    lgnName = this.currUsr.body.name;
    lgnRole = this.currUsr.job_name;
    isAdmin = true;
       
    viewPanel = false;
       
    currentUser;
    loading = false; errLoadData = IVSMVars.errLoadData;
    ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
   
    apiUrl: string;
   
    // showAdvId = true; showAcion=true;
    showPosId = true; showPosName = true; showCreator = true; showLOB = true; showActive=true;
    showStatus = true; showDtStart = true; showDtEnd = true; showVenue = true; showVenueType = true; showAct = true; showForm = false;

    data: any = {};
    
    public term: string;
    styleTypeViewAll: string; styleTypeViewAct: string;
    styleTypeViewEva: string; styleTypeViewIv: string;
    styleTypeViewCom: string; styleTypeViewRev: string;
   
    private allItems: any[];
    
    model: any = {};
    imgOptArrList: any;
      
    filterForm: FormGroup;
    activatePanelForm: FormGroup;
    summaryForm : FormGroup;
    ViewApplicantData : FormGroup;
    activateSessionForm: FormGroup;
    changePanelForm: FormGroup;
    name: string = '';
    addNewForm: FormGroup;
    addSearchForm:FormGroup;
    results: boolean;
    getListLoading = false;
    displaySession = false;
    showInActivate : boolean;
    showActivate : boolean;
    descEmptyData = 'For better response, please customize your filter';
    data2: any = [];
        
     // pager object
    pager: any = {};
    pagedItems: any[];
    options: IOption[]; 
    selected: IOption[];

    pageSize = IVSMVars.pageSize;
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
        
        this.getReportFilter()
        this.notifier = notifierService;
        this.getlob();
    }

    env = GlobalVariable.ENV_NAME;
    env_prod = false;

    ngOnInit() {
        if(this.env === 'prod')
            this.env_prod = true;
        else
            this.env_prod = false;

            this.checkLevel();

            this.filterForm = new FormGroup({
                adsIDFilter: new FormControl('', Validators.required),
                advPosTitleFilter: new FormControl('', Validators.required),
                advPosCreatorFilter: new FormControl('', Validators.required),
                lobFilter: new FormControl('', Validators.required),
                statusFilter: new FormControl('', Validators.required),
            });

            this.changePanelForm = new FormGroup({
                newPanelTxt: new FormControl('', Validators.required),
             });

            this.activatePanelForm = new FormGroup({
                chgHead: new FormControl('', Validators.required),
                chgPanel1: new FormControl('', Validators.required),
                chgPanel2: new FormControl('', Validators.required),
            });

            this.activateSessionForm= new FormGroup({
               
            });

            this.setPage(1);
            this.data2 = [];
    }

    resetFilter(){
        this.filterForm.setValue({
            adsIDFilter: "",
            advPosTitleFilter: "",
            advPosCreatorFilter: "",
            lobFilter: "",
            statusFilter: "",
        });     
     }

     resetChangePnlBox(){
        this.changePanelForm.setValue({
            newPanelTxt: "",
        });     
     }

     // 1- Admin, 2-Head HCBD, 3- HCBD (Advertiser), 5-HCBO
     checkLevel() {
        let userRole = JSON.parse(localStorage.getItem('currentUser')).job_role;
        if (userRole) {
          let roleArr = userRole.split(",");
          for (let i = 0; i < roleArr.length; i++) {
            if ((roleArr[i] === '1') || (roleArr[i] === '5') || (roleArr[i] === '3')){
                this.showActivate = true;
               }
                   
            if (roleArr[i] === '2') {
                this.showActivate = false;
               }
            }
        }
    }

    //Submit filter
    errorDate = false;
    newStatus = [];
    submitFilter(type){
        this.descEmptyData = 'List is Empty';
        this.loading = true; 
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
                advertiser: this.filterForm.get('advPosCreatorFilter').value,
                lob: this.filterForm.get('lobFilter').value,
                status: this.filterForm.get('statusFilter').value,
            }
         }  
        this.newStatus = [];
        this.loading = true;

          this._POST_api_Service.POST_IDP_data(IVSMVars.postSearchFilter, dataPos).subscribe(dataRes => {
            let dataSearchArr: any = {};
             dataSearchArr = dataRes;
             for (let i = 0; i < dataRes.filter.length; i++){
                this.newStatus = dataRes.filter(t=>t.currentStatus == 'Started' || t.currentStatus == 'Submitted');
             }
                                  
            this.loading = false;   
            this.data2 = this.newStatus;
            this.setPage(1);
                                  
        }, error => {
            console.log('[ERROR] Fail to submit filter: ' + error);
            if(error == 'Error: 500'){
                this.data2 = [];
                this.setPage(1);
                this.loading = false;
            }
        });
      }  

    //Set Filter Lob and Advertiser 
    filters = {};
    getReportFilter() {
            this.filters= {};
            this._GET_api_Service.GET_IDP_data(IVSMVars.postFilterLobAdv).subscribe(data => {
            this.filters = data;
            this.loading = false;  
            }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }

    optLobList = [];
    mylob = '';
    getlob() {
         this._GET_api_Service.GET_REC_DATA(IVSMVars.getLOBAPI).subscribe(data => {
         
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

     //scroll to element

     scrolltoPanel() {
        document.querySelector('#viewChangePanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
     }

     scrollToElement(): void {
       let element = document.getElementById('viewChangePanel');
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    statusType = ['Submitted', 'Started'];

   
      //Select name
        selApplicant: any = {};
        selectedAppName(applId) {
            this.selApplicant = applId;
            this.sessionDetails();
            this.loading = false; 
               
        }

       // Post Session Details
       advertId: any = {};;
       sessionDetArr = [];
       candidateDetail = [];
       candidateArr = [];
       sessionArr = [];
       applicantSummary = [];
       panelLoading = false;
       panelArr = [];
       reportArr = [];
       apikey;
       globalburl; 

       sessionDetails(){
        this.apikey = GlobalVariable.API_KEY;
        this.globalburl =  GlobalVariable.BASE_API_URL;

           let sessionPost = {
               advId: this.selApplicant
           }

            this.getListLoading = true;
            this.panelLoading = true;
            this.viewPanel = true;
            this.candidateArr = [];
            this._POST_api_Service.POST_IDP_data(IVSMVars.postAllPanelCandidate, sessionPost).subscribe(dataRes => {
            this.applicantSummary = dataRes;
            this.sessionDetArr = dataRes.datasession;
            this.candidateDetail = dataRes.datacandidate;
            let listCandidate = dataRes.datacandidate;
            this.panelLoading = false;  
            this.displaySession = true;       
              
            // List of panel and candidate
            this.candidateArr = [];
               
            for (let i= 0; i < listCandidate.length; i++) {
               
                   let ImgCan = GlobalVariable.BASE_API_URL + '/get/image' + "/" + listCandidate[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
                                     
                   this._GET_api_Service.GET_PictureByUrl(ImgCan).subscribe(data => {                        
                       if (data) {
                           this.candidateArr.push({
                               staffName: listCandidate[i].staffName, 
                               image_url: ImgCan,
                               applicantId:listCandidate[i].applicantId,
                               panels:listCandidate[i].panels,
                        });
                        
                        }
                       else {
                           this.candidateArr.push({
                               image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                               staffName: listCandidate[i].staffName, 
                               applicantId:listCandidate[i].applicantId,
                               panels:listCandidate[i].panels,
                          });
                       }
                    
                   },err => {
                       this.candidateArr.push({
                           image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                           staffName: listCandidate[i].staffName, 
                           applicantId:listCandidate[i].applicantId,
                           panels:listCandidate[i].panels,
                        
                           });
                       });
                   }
                });

                //postDownloadReport
                this.reportArr = [];
                this._POST_api_Service.POST_IDP_data(IVSMVars.postDownload, sessionPost).subscribe(dataRes => {
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

             
    //Select panel

    selpanelName;
    selpanelID;
    selpanelPid;
    selectedPanel(pnName, cnId, pnPId) {
        this.selpanelName = pnName;
        this.selpanelID = cnId;
        this.selpanelPid = pnPId;
        $('#changePanelModal').click();
        this.loading = false;
     }


      //Activate Panel
 
      actPanelId: any = {};
      actCanid: any = {};
     
      activatePanel(pnlid, canid){ 
          this.actPanelId = pnlid;
          this.actCanid = canid;
         
          let dataActPnPost: any = {};
        
          dataActPnPost = {
            
              advId: this.selApplicant,
              candidateId: canid,
              panelId: pnlid,
          }
          this.loading = true; 
         
          let activePnSend = this._POST_api_Service.POST_IDP_data(IVSMVars.postActivatePanel, dataActPnPost);
          let dataActPn: any = {};
          let ret = activePnSend.subscribe(dataRes => {
            dataActPn = dataRes;
              if (dataActPn.status === "OK" ) {
                  this.notifier.notify('success', 'Successfully set Active/InActive Panel!');
                  this.submitFilter(1);
                  this.sessionDetails();
               
               } else {
                  this.notifier.notify('error', 'Error - set Active/InActive Panel!');
              }
              this.loading = false; 
             
              },
              error => {
                  console.log('[ERROR + User Not Found: ' + error);
             }) 
        }

     //Search Panel
     dataSearch: any = {};
     newPanel: any = [];
     selIdPanel: any = [];
     searchData = false;
     loadingDataSearch = false;
     
     onNameKeyUp1(event: any) {
         this.name = event.target.value;
         this.results = false;
 
         if (this.name.length > 1) {
             this.searchUser(this.name);
             this.loadingDataSearch = true;
        }
     }
 
    
    addSelectedPn = false;
    searchUser(name) {
    let data = {
        advId: this.selApplicant,
        pid: this.selpanelPid,
        text: name
    }
   
    let searchUserSend = this._POST_api_Service.POST_IDP_data(IVSMVars.postSearchPanel, data);
    let ret = searchUserSend.subscribe(dataRes => {
        let listpaneldata = dataRes;
        this.newPanel = dataRes;
        this.selIdPanel = dataRes[0].id;
        let list = this.newPanel.filter(x => x.name === name)[0];
        this.results = false;
        this.addSelectedPn = true;
        this.loadingDataSearch = false;

        if (this.dataSearch.results) {
            if (this.dataSearch.results.length > 10) {
                this.newPanel = this.dataSearch.results.slice(0, 10);
            }
            else {
                this.newPanel = this.dataSearch.results;
            }
          }  
         
         },
        error => {
            console.log('[ERROR + User Not Found]', error);
        })
      }
 
    //select PanelID & CandidateID
    selOldPanelId: any = {};
    selCanId: any = {};
    selectDetailID(selpnId, selcanId){
        this.selOldPanelId = selpnId;
        this.selCanId = selcanId;
     }

       
    //Change Panel
    selNewPanelId: any = {};
    changePanel(){ 

        let dataChgPnPost: any = {};
      
        dataChgPnPost = {
            panelID: this.selOldPanelId,
            candidateID: this.selCanId,
            newPanelID: this.selIdPanel,
            advId: this.selApplicant,
            pid: this.selpanelPid,
        }
        this.loading = true; 
        let chgPnSend = this._POST_api_Service.POST_IDP_data(IVSMVars.postReplacePanel, dataChgPnPost);
        let dataChgPn: any = {};
        let ret = chgPnSend.subscribe(dataRes => {
            dataChgPn = dataRes;
            if (dataChgPn.status === "OK") {
                this.notifier.notify('success', 'Successfully change Panel!');
                this.submitFilter(1);
                this.sessionDetails();
             } else {
                this.notifier.notify('error', 'Error - Change Panel!');
            }
            this.loading = false; 
            
            },
            error => {
                console.log('[ERROR + User Not Found: ' + error);
           }) 
         }


     //Select session

     selSessionId: any = {};
     selectedSession() {
        $('#activateSessionModal').click();
         this.loading = false;
    }

    //To activate Session
  
   setNo: number;
   activateSes(actId){
      this.setNo = actId;

      let dataSession = {
        advId: this.selApplicant,
        activate: actId
      }
         
     this.loading = true; 
     let setActiveSend = this._POST_api_Service.POST_IDP_data(IVSMVars.postActivateSessionNew, dataSession);
     let dataisActive: any = {};
     let ret = setActiveSend.subscribe(dataRes => {
        dataisActive = dataRes;
          if (dataisActive.status === 0) {
              this.notifier.notify('success', 'Successfully activate Session!');
              this.submitFilter(1);
              this.sessionDetails();
            } else if (dataisActive.status === -1){
              this.notifier.notify('error', 'Error - Fail to activate session. No original Head panel!');
          }
       
          this.loading = false; 
        },
         error => {
             console.log('[ERROR + User Not Found]', error);
         })
         return;
     }

        
       // Set page
       setPage(page: number) {
          // get pager object from service
          this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
          // get current page of items
          this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
      }

      //Download Report
      downloadSessionManData() {
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
        a.download = 'Session_Management_' + dateToday + '.csv';
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