import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation, Injectable,ElementRef, ViewChild, SecurityContext } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
import { PagerService } from '../job/shared/pager/pager.component';
import { Http } from '@angular/http';
import { hrcVars, News } from './hrcomm-tracking-vars';
import { GlobalVariable } from "../../../../../environments/environment";
import { ImageService } from './imageService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as jspdf from 'jspdf';
//import * as html2canvas from 'html2canvas';

export interface IOption {
  Staff_No: string,
  name: string
}

@Component({
  selector: 'app-hrcomm',
  templateUrl: './hrcomm.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./hrcomm.component.css']
})

@Injectable()
export class HrcommComponent implements OnInit, AfterViewInit {
  htmlString_eng: string = '';
  htmlString_mal: string = '';
  quillEditorRef: any;
  quillConfig = { toolbar: [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction
  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'], // remove formatting button
  ['link'], // link
  //['image'], // image, video
  ],
  //imageResize: true // for image resize
  };

  quillConfigNull = {
    "modules": {
        "toolbar": false
    }
  };


  onContentChangedEng = (event) => {
   this.htmlString_eng = event.html;
  }

  onContentChangedMal = (event) => {
    this.htmlString_mal = event.html;
   }

  initialValues: any;
  initialValuesAdd: any;
  initialValuesEdit: any;
  newsList: News[]=[];
  MalVer: boolean = false;
  EngVer: boolean = false;
  editId: number = 0;
  editorCreated(quill: any) {}
  ErrorMsg: string = '';
  loading = false;
  // infoLoading = true;
  // infoLoading1 = false;
  // infoLoading2 = false;
  errLoadData = hrcVars.errLoadData;
  title1 = hrcVars.title1; 
  title2;
  pageSize = hrcVars.pageSize; 
  APIGetImg = hrcVars.APIGetImg;
  isSelChxbox:boolean = false;
  attachList;
  apiUrl: string;
  filterYear:FormGroup;
  delConfirmFLForm:FormGroup;
  deleteComForm:FormGroup;
  deleteAttachForm:FormGroup;
 
  data: any = {};
  data2: any = [];
  commDetailsInfo; commLocationInfo; commEmpGroupInfo;

  month = new Date().getMonth() + 1;
  monthList = [
    { Value: 1, Text: 'Jan' },
    { Value: 2, Text: 'Feb' },
    { Value: 3, Text: 'Mar' },
    { Value: 4, Text: 'Apr' },
    { Value: 5, Text: 'May' },
    { Value: 6, Text: 'June' },
    { Value: 7, Text: 'July' },
    { Value: 8, Text: 'Aug' },
    { Value: 9, Text: 'Sep' },
    { Value: 10, Text: 'Oct' },
    { Value: 11, Text: 'Nov' },
    { Value: 12, Text: 'Dec' }
];

year = new Date().getFullYear();
yearList = [];


filterForm: FormGroup; //
commAddForm: FormGroup; //
commEditForm: FormGroup; //
// submitForm: FormGroup; 
newCategoryForm: FormGroup;
newCommTypeForm: FormGroup;
  showFltr = true;
  showAdd  = false;
  showEdit = false;
  showPrev = false;
  
  bodyimg = '';
  thumbnail = '';
  notifyMsg: string;
  //bodyImgFiles;
  bodyImgMalayFiles: any[] = [];
  bodyImgEnglishFiles: any[] = [];
  thumbImgFiles: any[] = [];

  descEmptyData = 'For better response, please customize your filter';
   
           
  // pager object
 pager: any = {};
 pagedItems: any[];
 options: IOption[]; 
 selected: IOption[];
 downloadAll = false;
 no:any =1;

 dropdownLocSettings: any = {};
 dropdownBndSettings: any = {};
 closeDropdownSelection=false;
 disabled=false;
 checked=false;
 
 showMalayTab = true;
 showEnglishTab = false;
 showLoc = false;
 showMyComment: boolean = true;

 //Barchart
  viewCate: any[] = [780, 400];
  view: any[] = [500, 400];
  monthCat: any[];
  monthCatYr: any[];
  graphMulti: any[];
  graphSubMulti: any[];
  graphShowCate: any[];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showLegendCate: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  legendTitleEvent: string = 'Viewer Response';
 
  colorScheme = {
    domain: ['#5AA454', '#388EE9', '#09EBEE', '#C020D0', '#FED825']
  };

  colorScheme1 = {
    domain: ['#F55301']
  };

  colorSlide = 'primary';
  
 
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
    private imageService: ImageService,
    private sanitizer: DomSanitizer,)
    { 

      this.notifier = notifierService;
     }
   
  ngAfterViewInit() {
      this._script.loadScripts('app-hrcomm.component',
      [
          'assets/js/superadmin/delete-alert.js',
      ]);
  }

  ngOnInit() {

    this.dropdownLocSettings = {
      singleSelection: false,
      idField: 'location',
      textField: 'location',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: this.closeDropdownSelection
  };

  this.dropdownBndSettings = {
    singleSelection: false,
    idField: 'empl_group',
    textField: 'empl_group',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    closeDropDownOnSelection: this.closeDropdownSelection
};

   
    this.checkLevel();

    this.title1 = 'HR Comm - Comm. List';
    this.title2 = 'HR Comm - REPORT';

    for (var i = 2020; i <= this.year; i++) {
      this.yearList.push(i);
    }

    this.filterForm = new FormGroup({
      fltrGroup: new FormControl('', Validators.required),
      fltrCategory: new FormControl('', Validators.required),
      fltrLocation: new FormControl('', Validators.required),
      fltrYear: new FormControl('', Validators.required),
      fltrMonth: new FormControl('', Validators.required),
    });

    this.commAddForm = new FormGroup({
      addSubjectInput: new FormControl('', Validators.required),
      fgAddDivMal: new FormGroup({
        addBodyTextInputMal: new FormControl(''),
        fileAddBodyImgMal: new FormControl('')
      }),
      fgAddDivEng: new FormGroup({
        addBodyTextInputEng: new FormControl(''),
        fileAddBodyImgEng: new FormControl('')
      }),
      addHyperLinkInput: new FormControl(''),
      addGroupInput: new FormControl('', Validators.required),
      addCategoryInput: new FormControl('', Validators.required),
      addSubcategoryInput: new FormControl('', Validators.required),
      addCommTypeInput: new FormControl('', Validators.required),
      addPublishDateInput: new FormControl('', Validators.required),
      thumbnailAddInput: new FormControl('', Validators.required),
      addLocationInput: new FormControl('', Validators.required),
      addTrgtGroupInput: new FormControl('', Validators.required),
      addTagInput: new FormControl(''),
     
    });

    this.initialValuesAdd = this.commAddForm.value;

    this.commEditForm = new FormGroup({
      editIdInput: new FormControl('', Validators.required),
      editSubjectInput: new FormControl('', Validators.required),
      editBodyTextInputMal: new FormControl('', Validators.required),
      editBodyTextInputEng: new FormControl('', Validators.required),
      editHyperLinkInput: new FormControl(''),
      editGroupInput: new FormControl('', Validators.required),
      editCategoryInput: new FormControl('', Validators.required),
      editSubcategoryInput: new FormControl('', Validators.required),
      editCommTypeInput: new FormControl('', Validators.required),
      editPublishDateInput: new FormControl('', Validators.required),
      thumbnailEditInput: new FormControl('', Validators.required),
      editLocationInput: new FormControl('', Validators.required),
      editTrgtGroupInput: new FormControl('', Validators.required),
      editTagInput: new FormControl(''),
    });

    this.getGroup();
    this.getCategory();
    this.getLocation();
    this.getCommType();
    this.getTarget();
    this.getReportHr();
    this.filterForm.controls['fltrYear'].setValue(this.year, {onlySelf: true});
    this.filterForm.controls['fltrMonth'].setValue(this.month, {onlySelf: true});
  
    this.initialValues = this.filterForm.value;

    this.filterYear = new FormGroup({
      txtboxYear: new FormControl(this.year, Validators.required),
    });

    this.newCategoryForm = new FormGroup({
      addNewCate: new FormControl('', Validators.required),
      addDescCate: new FormControl('', Validators.required),
    });

    this.newCommTypeForm = new FormGroup({
      addNewCommType: new FormControl('', Validators.required),
      addDescCommType: new FormControl('', Validators.required),
    });

    this.deleteComForm = new FormGroup({});

    this.deleteAttachForm = new FormGroup({});

    
  }

    // Set page
    
  setPage(page: number) {
      // get pager object from service
      this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
      // get current page of items
      this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getStat(status: number){

    if(status == 2) return true;
    else return false;

  }

  sanatizeUrl(generatedImageUrl): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(generatedImageUrl);
  }

//Submit filter
errorDate = false;
reportArr = [];
dataDownload: any = {};

submitFilter(type){
  this.loading = true;
  
      type newsData = {
        noItem, id, subject, image_url, from_group, category, location, publish_date, status,totalLike, from
    };

    this.descEmptyData = 'List is Empty';
    
    let dataPos = {};

    this.newsList = [];

    let subImg: string;
    let newsArray:newsData[] = [];

    if(type === 0){
        dataPos = {
          txtkeyword  : '',
          group_id    : '',
          category_id : '',
          location    : '',
          month       : '',
          year        : '',
        }
    }
    else if(type === 1){

      let node = this.activeRoute.snapshot.queryParams['node'];
                                
        dataPos = {
            txtkeyword  : '',
            group_id    : this.filterForm.get('fltrGroup').value === null || this.filterForm.get('fltrGroup').value === '' ? '0': this.filterForm.get('fltrGroup').value,
            category_id : this.filterForm.get('fltrCategory').value === null || this.filterForm.get('fltrCategory').value === '' ? '0': this.filterForm.get('fltrCategory').value,
            location    : this.filterForm.get('fltrLocation').value === null || this.filterForm.get('fltrLocation').value === '' ? '' : this.filterForm.get('fltrLocation').value,
            month       : this.filterForm.get('fltrMonth').value,
            year        : this.filterForm.get('fltrYear').value,
        }
      }
      // console.log(' dataPosFilter', dataPos)
      
      this._POST_api_Service.POST_HRC_data(hrcVars.postCommListAPI, dataPos).subscribe(dataRes => {
        let dataSearchArr: any = {};
          dataSearchArr = dataRes;
        
          // console.log(' filterdata', dataSearchArr)
         
          for (let i= 0; i < dataSearchArr.length; i++) {
            
            subImg = GlobalVariable.BASE_IDP_URL + '/hrc/get/image' + "/" + dataSearchArr[i].thumb + '?api_key=' + GlobalVariable.API_KEY;
            
            let imgSend = this._GET_api_Service.GET_PictureByUrl(subImg);
  
            imgSend.subscribe(pictureResults => {

                subImg = subImg;

            }, (errEx) => {
              console.log('get_comm error : -'+ errEx)
              subImg = '../../../../../assets/app/media/img/misc/No-image-available.png';
            });

              if (dataRes) {
                  newsArray.push({
                      noItem: i+1,
                      id: dataSearchArr[i].id,
                      subject: dataSearchArr[i].subject,
                      image_url: subImg,
                      from_group: dataSearchArr[i].group,
                      category: dataSearchArr[i].category,
                      location: dataSearchArr[i].location,
                      publish_date: dataSearchArr[i].publish_date,
                      status: dataSearchArr[i].status,
                      totalLike: dataSearchArr[i].likenewscount,
                      from: 'dataRes'  
                    });
              }
          }
          this.data2 = newsArray;
          this.setPage(1);
          this.loading = false;
        
                                                                
    }, error => {
        console.log('[ERROR] Fail to submit filter: ' + error);
        if(error == 'Error: 500'){
            this.data2 = [];
            this.setPage(1);
            this.loading = false;
        }
    });

    // For Download CSV based on year
    let postYear: any = {};
    postYear={
      year : this.filterForm.get('fltrYear').value,
      }
      this._POST_api_Service.POST_HRC_data(hrcVars.postDwnReport, postYear).subscribe(res => {
      this.dataDownload = res;
    });
    }


  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  groupList = [];
  getGroup() {
      
      this.loading = true; 
      this._GET_api_Service.GET_HRC_data('/hrc/admin/group/get').subscribe(data => {
          this.groupList = data;
          this.loading = false; 
        }, error => {
          console.log('[ERROR] Fetch data get group ' + error);
      });
  }

  catList = [];
  getCategory() {
      
      this.loading = true; 
      this._GET_api_Service.GET_HRC_data('/hrc/admin/category/get').subscribe(data => {
          this.catList = data;
          this.loading = false; 
          
      });
  }


  getAttachment(dataId: any) {

    this.loading = true; 
    this._GET_api_Service.GET_HRC_data('/hrc/admin/attach/getlist/'+dataId).subscribe(data => {
        if(data) this.attachList = data
        else this.attachList = [];
        this.loading = false;
         
    });
  }

  attachFile: File[] = [];
  isOkSize = true;
  onSelectAttach(event) {
    this.attachFile = [];
    this.attachFile.push(...event.addedFiles);

    this.validateFileSize();
  }

  validateFileSize() {
    this.isOkSize = true;
    if(this.attachFile.length > 0) {
      let fSize: any = ((this.attachFile[0].size/1024)/1024).toFixed(4); // MB
        if(fSize > 2) {
          this.isOkSize = false;
        }
    }
  }
  onRemoveAttach(event) {
    this.attachFile.splice(this.attachFile.indexOf(event), 1);
    this.validateFileSize();
  }

  clearAttach() {
    this.attachFile = [];
    this.isOkSize = true;
  }

  attachSaving = false;
  uploadAttach(_commID) {

    if((this.attachList.length + this.attachFile.length) > 3)
    {
      this.notifier.notify('error', 'Cannot upload more than 3 files for each comm !');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
    else if(this.attachFile.length < 1){
      this.notifier.notify('error', 'Only can upload pdf file and file size not more than 2 mb !');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
    else 
    {
        for (var _i = 0; _i < this.attachFile.length; _i++) {
          this.Uploadhelp(_commID,_i)
        }
    
        this.notifier.notify('success', 'Successfully Upload !');
        window.scrollTo({top: 0, behavior: 'smooth'});
      
    }
  }

  Uploadhelp(commID, i){

    this.attachFile[i];

    this.attachSaving = true;
    // console.log(this.attachFile)

    let api = hrcVars.postCommAttachUploadAPI;

    let form_Data = new FormData();
    form_Data.append('hrcommAttach', this.attachFile[i], this.attachFile[i].name.toLowerCase());
    form_Data.append('hrcommID', commID);

    this._POST_api_Service.POST_CommImage(api, form_Data).subscribe(res => {
      let resp : any = res;
      this.attachFile = [];
      this.getAttachment(commID);

      this.attachSaving = false;

    },
    err => {
      this.attachSaving = false;
      //this.notifier.notify('error', "Failed to upload your attachment.");
      //window.scrollTo({top: 0, behavior: 'smooth'});
      console.log('[ERROR] Failed to upload attach: ' + err);
    });

  }

  openPDF(attachHash) {
		console.log('attachHash : ' +attachHash)

		let apiKey = this._GET_api_Service.baseApiKey;
		let api = GlobalVariable.BASE_IDP_URL + '/hrc/get/image/' +attachHash + '?api_key=' + GlobalVariable.API_KEY;
		
		this._GET_api_Service.GET_PictureByUrl(api).subscribe(data => {  
			if(data){
				let attachUrl = api;
				window.open(attachUrl);
			} 
			
		}, err => {
			console.log("Error - File not available")
		})
	}

  getFilename(filepathname){
  
    let filename = filepathname.replace(/^.*[\\\/]/, '');

    return filename;
  }


  /*toggle(itemId,iCurrStat){
    if(iCurrStat === 1) console.log("1 --> 2")
    else console.log("2 --> 1");
  }*/

  locationList = [];
  getLocation() {
    
      this.showLoc = true;
      this.loading = true; 
      this._GET_api_Service.GET_HRC_data('/hrc/admin/location/get').subscribe(data => {
          this.locationList = data;
          this.loading = false; 
          this.showLoc = false;
      });
  }

  commTypeList = [];
  getCommType() {
      
      this.loading = true; 
      this._GET_api_Service.GET_HRC_data('/hrc/admin/type/get').subscribe(data => {
          this.commTypeList = data;
          this.loading = false; 
      });
  }

  empgrpList = [];
  getTarget() {
      this.loading = true; 
      this._GET_api_Service.GET_HRC_data('/hrc/admin/target/get').subscribe(data => {
          this.empgrpList = data;
          this.loading = false; 
      });
  }

  openAddModal(){

    this.title1 = 'HR Comm - Add New Comm.';

    this.htmlString_eng = ''; // added on 09112021 by burhan
    this.htmlString_mal = ''; // added on 09112021 by burhan

    this.commAddForm.reset(this.initialValuesAdd);
    
    this.imgMalURL = '';
    this.imgEngURL = '';
    this.imgThumbURL = '';

    this.showAdd = true;
    this.showEdit = false;
    this.showFltr = false;
   }

  addNewSubmit() {

      this.loading = true;
      
      let subject       = this.commAddForm.get('addSubjectInput').value;
      let html_ms       = this.htmlString_mal;
      let html_en       = this.htmlString_eng;
      let group_id      = this.commAddForm.get('addGroupInput').value;
      let category_id   = this.commAddForm.get('addCategoryInput').value;
      let sub_category  = this.commAddForm.get('addSubcategoryInput').value;
      let news_type_id  = this.commAddForm.get('addCommTypeInput').value;
      let xpublish_date = this.commAddForm.get('addPublishDateInput').value;
      // let publish_date  = xpublish_date == 0 ? null: this.commAddForm.get('addPublishDateInput').value.split("T")[0].split('-').join('/');
      let publish_date  = xpublish_date == 0 ? null: this.commAddForm.get('addPublishDateInput').value;
      let xhyperlink     = this.commAddForm.get('addHyperLinkInput').value;
      let hyper_link     = xhyperlink == '' ? null: this.commAddForm.get('addHyperLinkInput').value;

      let dataAddPost: any = {};

      if(subject == '' || subject == null){

        this.ErrorMsg = 'Please fill subject!!!';
        this.loading = false;
        return;
      } 

      if(this.bodyImgMalayFiles.length == 0 && this.bodyImgEnglishFiles.length  == 0){

        this.ErrorMsg = 'Please upload Body Image!!!';
        this.loading = false;
        return;
      }
     
     if(group_id == ''){

        this.ErrorMsg = 'Please select group!!!';
        this.loading = false;
        return;
      }

      if(category_id == ''){

        this.ErrorMsg = 'Please select category!!!';
        this.loading = false;
        return;
      }

      if(sub_category == ''){

        this.ErrorMsg = 'Please select subcategory!!!';
        this.loading = false;
        return;
      }

      if(news_type_id == ''){

        this.ErrorMsg = 'Please select comm type!!!';
        this.loading = false;
        return;
      }

      if(publish_date == '' || publish_date == null){

        this.ErrorMsg = 'Please select publish date!!!';
        this.loading = false;
        return;
      }

      let loc = this.commAddForm.get('addLocationInput').value.toString();
      if(loc == ''){
        this.ErrorMsg = 'Please select location!!!';
        this.loading = false;
        return;
      }
           
      let band = this.commAddForm.get('addTrgtGroupInput').value.toString();
      if(band == ''){
        this.ErrorMsg = 'Please select band!!!';
        this.loading = false;
        return;
      }

      if(this.thumbImgFiles.length == 0){

        this.ErrorMsg = 'Please upload thumbnail!!!';
        this.loading = false;
        return;
      }

      dataAddPost = {
        subject       : subject,
        html_ms       : html_ms,
        html_en       : html_en,
        group_id      : group_id,
        category_id   : category_id,
        sub_category  : sub_category,
        news_type_id  : news_type_id,
        publish_date  : publish_date,
        hyper_link    : hyper_link,
      }

      let addCommSend = this._POST_api_Service.POST_HRC_data(hrcVars.postCommAddAPI, dataAddPost);

      const wait = ms => new Promise(resolve => setTimeout(resolve, ms)); 

      let dataCommAdd: any = {};
      let ret = addCommSend.subscribe(dataRes => {
        dataCommAdd = dataRes;
              
          if (dataCommAdd.status == 0) {

            let newsid = dataCommAdd.newsid;

            if(this.bodyImgMalayFiles.length > 0) wait(this.postCommBodyImg(newsid,hrcVars.postCommBodyImgAddAPI)).then(() => this.insTargetLocation(newsid, loc)); 
            else this.insTargetLocation(newsid, loc);

            if(this.bodyImgEnglishFiles.length > 0) wait(this.postCommBodyImgEng(newsid,hrcVars.postCommBodyEngImgAddAPI)).then(() => this.insTargetEmployee(newsid, band));
            else this.insTargetEmployee(newsid, band);

            wait(this.postThumbnail(newsid,hrcVars.postCommThumbImgAddAPI)).then(() => 
            
              setTimeout(function() {
                  this.notifier.notify('success', 'Successfully Add New Comm !');
                  this.openEditModal(newsid);
                  this.submitFilter(1);
              }.bind(this), 4000)
            
            );


          } else{

              this.notifier.notify('error', 'Error! '+ dataCommAdd.msg);
              this.loading = false;
             }

          this.ErrorMsg = '';
          //this.commAddForm.reset(); 
          //this.loading = false;
      },
          error => {
              console.log('[ERROR + User Not Found: ' + error);
              this.loading = false;

          }
      )

  }

  //Publish/Unpublish
  
  toggle(eID, stats){

    let newstats: number;
    let dataPublishPost: any = {};
    (stats === 2) ? newstats = 1 : newstats = 2;

    dataPublishPost = {
      commId  : eID,
      opt     : newstats,
    }
    // console.log('dataPublishPost',dataPublishPost)
    let pubCommSend = this._POST_api_Service.POST_HRC_data(hrcVars.postCommPublishAPI, dataPublishPost);
    
    let dataCommPub: any = {};
    let ret = pubCommSend.subscribe(dataRes => {
      dataCommPub = dataRes;

        if (dataCommPub.status == 0) {
            if(newstats > 1){
                  this.notifier.notify('success', 'Successfully Publish!');
            }
            else {
                    this.notifier.notify('success', 'Successfully unpublish!');
            }

            this.submitFilter(1);
        } else{

            this.notifier.notify('error', 'Error! '+ dataCommPub.msg);
            
           }

        this.ErrorMsg = '';
    },
        error => {
            console.log('[ERROR: ' + error);

        }
    )

  }

  editSubmit(eID:number) {

    this.loading = true;
    
    let subject       = this.commEditForm.get('editSubjectInput').value;
    let html_ms       = this.htmlString_mal;
    let html_en       = this.htmlString_eng;
    let group_id      = this.commEditForm.get('editGroupInput').value;
    let category_id   = this.commEditForm.get('editCategoryInput').value;
    let sub_category  = this.commEditForm.get('editSubcategoryInput').value;
    let news_type_id  = this.commEditForm.get('editCommTypeInput').value;
    let xpublish_date = this.commEditForm.get('editPublishDateInput').value;
    // let publish_date  = xpublish_date == 0 ? null: this.commEditForm.get('editPublishDateInput').value.split("T")[0].split('-').join('/');
    let publish_date  = this.commEditForm.get('editPublishDateInput').value;
    let xhyperlink     = this.commEditForm.get('editHyperLinkInput').value;
    let hyper_link     = xhyperlink == '' ? null: this.commEditForm.get('editHyperLinkInput').value;

    let dataEditPost: any = {};

    if(subject == '' || subject == null){

      this.ErrorMsg = 'Please fill subject!!!';
      this.loading = false;
      return;
    } 

    if(group_id == ''){

      this.ErrorMsg = 'Please select group!!!';
      this.loading = false;
      return;
    }

    if(category_id == ''){

      this.ErrorMsg = 'Please select category!!!';
      this.loading = false;
      return;
    }

    if(sub_category == ''){

      this.ErrorMsg = 'Please select subcategory!!!';
      this.loading = false;
      return;
    }

    if(news_type_id == ''){

      this.ErrorMsg = 'Please select news type!!!';
      this.loading = false;
      return;
    }

    if(publish_date == '' || publish_date == null){

      this.ErrorMsg = 'Please select publish date!!!';
      this.loading = false;
      return;
    }

    let loc = this.commEditForm.get('editLocationInput').value.join().toString();
    if(loc == ''){

      this.ErrorMsg = 'Please select location!!!';
      this.loading = false;
      return;
    }

    let band = this.commEditForm.get('editTrgtGroupInput').value.join().toString();
    if(band == ''){

      this.ErrorMsg = 'Please select band!!!';
      this.loading = false;
      return;
    }
   
     
    dataEditPost = {
      commId        : eID,
      subject       : subject,
      html_ms       : html_ms,
      html_en       : html_en,
      group_id      : group_id,
      category_id   : category_id,
      sub_category  : sub_category,
      news_type_id  : news_type_id,
      publish_date  : publish_date,
      hyper_link    : hyper_link,
    }

    // console.log('dataEditPost' , dataEditPost);

    let editCommSend = this._POST_api_Service.POST_HRC_data(hrcVars.postCommEditAPI, dataEditPost);

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms)); 

    let dataCommEdit: any = {};
    let ret = editCommSend.subscribe(dataRes => {
      dataCommEdit = dataRes;
     
        if (dataCommEdit.status == 0) {

          let newsid = dataCommEdit.newsid;

          // let loc = this.commEditForm.get('editLocationInput').value.join().toString();

          // let band = this.commEditForm.get('editTrgtGroupInput').value.join().toString();
         
          this.insTargetLocation(eID, loc);

          wait(this.insTargetEmployee(eID, band)).then(() => 
          
            setTimeout(function() {
                this.notifier.notify('success', 'Successfully Edit Comm !');
                this.openEditModal(eID);
                this.submitFilter(1);
              
            }.bind(this), 4000)
          
          );

        } else{

            this.notifier.notify('error', 'Error! ');
            this.loading = false;
           }

        this.ErrorMsg = '';
       
        //this.commEditForm.reset(); 
        //this.loading = false;
    },
        error => {
            console.log('[ERROR: ' + error);
            this.loading = false;

        }
    )

}


  insTargetLocation(commID: number, Loc: string){

    let dataPost: any = {};
      
    dataPost = {
      commId       : commID,
      location     : Loc,
    }

    let addCommSend = this._POST_api_Service.POST_HRC_data('/hrc/admin/comm/location/add', dataPost);

    let dataCommAdd: any = {};
    let ret = addCommSend.subscribe(dataRes => {
        dataCommAdd = dataRes;

          if (dataCommAdd.status != 0) {
            console.log('[ERROR: Add Location '+ dataCommAdd.message);
          }

    },
        error => {
            console.log('[ERROR: Add Location: ' + error);
            this.loading = false;

        }
    )

  }

  insTargetEmployee(commID: number, Trgt: string){

    let dataPost: any = {};
      
    dataPost = {
      commId      : commID,
      Target      : Trgt,
    }

    let addCommSend = this._POST_api_Service.POST_HRC_data('/hrc/admin/comm/target/add', dataPost);

    let dataCommAdd: any = {};
    let ret = addCommSend.subscribe(dataRes => {
        dataCommAdd = dataRes;

          if (dataCommAdd.status != 0) {
            console.log('[ERROR: Add Location '+ dataCommAdd.message);
          }

    },
        error => {
            console.log('[ERROR: Add Location: ' + error);
            this.loading = false;

        }
    )

  }

  openEditModal(eId){

    this.loading = true;
    this.showEdit = true;
    this.showFltr = false;

      this.title1 = 'HR Comm - Edit Comm. # ' + eId;

      this.editId = eId;

      this.getHrcDetailData(eId);
  }

  //Selected Attachment Id for deletion
    selDeleteAttId;
    selCommId;
    showDeleteAttDialog= false;
    selectedAttachment(dId: number,commId:number){
      this.selDeleteAttId = dId;
      this.selCommId = commId;

      this.showDeleteAttDialog = true;
      $('#delAttachment').click();
      this.loading = false;
    }

    //Delete Attachment
    openDelAttachModal(){

      this.loading = true;
      let dataCommDel: any = {};
      this._GET_api_Service.GET_HRC_data('/hrc/admin/attach/delete/' +this.selDeleteAttId).subscribe(data => {
          dataCommDel = data;

          if (dataCommDel.status == 0) {
              this.notifier.notify('success', 'Successfully delete attachment !');
              this.getAttachment(this.selCommId);
              this.loading = false;
          } else{

              this.notifier.notify('error', 'Error! '+ dataCommDel.msg);
              this.loading = false;
          }

          this.ErrorMsg = '';

      });
  }

  //Selected Comm Id for Deletion
  selectComm;
  showDeleteDialog = false;
  selItemDel(selId){
    this.selectComm = selId;

    this.showDeleteDialog = true;
    $('#delComm').click();
    this.loading = false;
  }

  delCommModal(){

    this.loading = true;
    let dataCommDel: any = {};
    this._GET_api_Service.GET_HRC_data('/hrc/admin/comm/delete/'+this.selectComm).subscribe(data => {
        dataCommDel = data;

        if (dataCommDel.status == 0) {
            this.notifier.notify('success', 'Successfully delete comm!');
            this.submitFilter(1);
          } else{
            this.notifier.notify('error', 'Error! '+ dataCommDel.msg);
        }

        this.ErrorMsg = '';
        this.loading = false;
    });

}

  target_location:string[] = [];
  target_band:string[] = [];

  onItemSelectLoc(item: any) {
    //this.target_location.push(item);
    console.log('onItem Select', item);
    console.log('location after select new location', this.commAddForm.get('addLocationInput').value);
  }

  onItemDeSelectLoc(item: any) {
    ////this.target_location = //this.target_location.filter(obj => obj !== item);
    console.log('onItem De-Select', item);
    console.log('onItem after DeSelect', this.commAddForm.get('addLocationInput').value
    );
  }

  onSelectAllLoc(items: any) {
    console.log(items);
  }

  resetFilterForm(){
    this.filterForm.reset(this.initialValues);
    this.filterForm.controls['fltrYear'].setValue(this.year, {onlySelf: true});
    this.filterForm.controls['fltrMonth'].setValue(this.month, {onlySelf: true});
  }

  publishDate; 
  hyperlinkComm;
  getHrcDetailData(dataId: any) {
    
    let dataPosDetails = {};

    dataPosDetails = {
      comm_id : dataId,
    }
        this.prevLoading = true;
        this._POST_api_Service.POST_HRC_data(hrcVars.postCommDetailListAPI, dataPosDetails).subscribe(dataResDet => {
          let data = dataResDet;
          this.publishDate = dataResDet[0].publish_date;
          this.hyperlinkComm = dataResDet[0].hyper_link;
            
          this.loadFilter(data[0]);

          this.getAttachment(dataId);    
          
          this.showAdd = false;
          this.prevLoading = false;
                                                                           
      }, error => {
          console.log('[ERROR] Fail to submit filter: ' + error);
          if(error == 'Error: 500'){
              this.commDetailsInfo = [];

              this.showAdd = false;
              this.loading = false;
                        
          }
      });

  }


  view_subject:string;
  view_bodyHtmlMal:string;
  view_bodyHtmlEng:string;
  view_category:string;
  view_sub_category:string;
  view_location:string;
  view_publish_date:string;
  view_hyper:string;
  loadFilter(data) {

    this.view_subject='';
    this.view_bodyHtmlMal ='';
    this.view_bodyHtmlEng ='';
    this.target_location = [];
    this.view_hyper = '';
    this.malRealURL = '#';
    this.engRealURL = '#';
       
    this.commEditForm.controls['editIdInput'].setValue(data.id, {onlySelf: true});
    this.commEditForm.controls['editSubjectInput'].setValue(data.subject, {onlySelf: true});
    this.view_subject = data.subject;
    this.getBodyImageMal(data.bodyImage_mal);
    this.getBodyImageEng(data.bodyImage_eng);
    this.view_location = data.location;
    this.target_location = data.location.split(',');
    this.target_band = data.target_empl.split(',');
    this.commEditForm.controls['editBodyTextInputMal'].setValue(data.html_mal, {onlySelf: true});
    this.commEditForm.controls['editBodyTextInputEng'].setValue(data.html_eng, {onlySelf: true});
    this.view_bodyHtmlMal = data.html_mal;
    this.view_bodyHtmlEng= data.html_eng;
    this.commEditForm.controls['editGroupInput'].setValue(data.group_id, {onlySelf: true});
    this.commEditForm.controls['editCategoryInput'].setValue(data.category_id, {onlySelf: true});
    this.view_category = data.category;
    this.commEditForm.controls['editSubcategoryInput'].setValue(data.sub_category, {onlySelf: true});
    this.view_sub_category = data.sub_category;
    this.commEditForm.controls['editCommTypeInput'].setValue(data.news_type_id, {onlySelf: true});
    this.view_publish_date = this.datePipe.transform(data.publish_date, 'dd-MM-yyyy h:mma')
    this.commEditForm.controls['editPublishDateInput'].setValue(this.view_publish_date, {onlySelf: true});
    this.getThumbImage(data.thumb);
    this.htmlString_eng = data.html_eng;
    this.htmlString_mal = data.html_mal;
    this.view_hyper = data.hyper_link;
    if(this.view_hyper != null || this.view_hyper != ''){
      this.malRealURL = this.view_hyper;
      this.engRealURL = this.view_hyper;
    }else{

      this.malRealURL = null;
      this.engRealURL = null;
    }    
    this.loading = false;
  }

  getBodyImageMal(image_url) {
    let subImg = '';
    subImg = GlobalVariable.BASE_IDP_URL + '/hrc/get/image' + "/" + image_url + '?api_key=' + GlobalVariable.API_KEY;
            
    let imgSend = this._GET_api_Service.GET_PictureByUrl(subImg);

      imgSend.subscribe(pictureResults => {
          
          if(pictureResults) this.imgMalURL = subImg;
          this.MalVer = true;

      }, (errEx) => {

          console.log('get_comm error : -'+ errEx)
          this.imgMalURL = '../../../../../assets/app/media/img/misc/No-image-available.png';
          this.MalVer = false;
      });
  }

  getBodyImageEng(image_url) {
    let subImg = '';
    subImg = GlobalVariable.BASE_IDP_URL + '/hrc/get/image' + "/" + image_url + '?api_key=' + GlobalVariable.API_KEY;
            
    let imgSend = this._GET_api_Service.GET_PictureByUrl(subImg);

      imgSend.subscribe(pictureResults => {
          
          if(pictureResults) this.imgEngURL = subImg;
          this.EngVer = true;

      }, (errEx) => {

        console.log('get_comm error : -'+ errEx)
        this.imgEngURL = '../../../../../assets/app/media/img/misc/No-image-available.png';
        this.EngVer = false;
      });
  }

  getThumbImage(image_url) {
    let subImg = '';
    subImg = GlobalVariable.BASE_IDP_URL + '/hrc/get/image' + "/" + image_url + '?api_key=' + GlobalVariable.API_KEY;
            
    let imgSend = this._GET_api_Service.GET_PictureByUrl(subImg);

      imgSend.subscribe(pictureResults => {
          
          if(pictureResults) this.imgThumbURL = subImg;
      }, (errEx) => {

        console.log('get_comm error : -'+ errEx)
        this.imgThumbURL = '../../../../../assets/app/media/img/misc/No-image-available.png';
      });
  }

      // back to search table
      backToSearchTableAdd() {
        this.title1 = 'HR Comm - Comm. List';
        this.showAdd = false;
        this.showFltr = true;
        this.imgURL = '';
        this.imgThumbURL = '';
        
        this.htmlString_eng = ''; // added on 09112021 by burhan
        this.htmlString_mal = ''; // added on 09112021 by burhan

      }

      // back to search table
      backToSearchTableEdit() {
        this.title1 = 'HR Comm - Comm. List';
        this.showEdit = false;
        this.showFltr = true;
        this.imgURL = '';
        this.imgThumbURL = '';

        this.htmlString_eng = ''; // added on 09112021 by burhan
        this.htmlString_mal = ''; // added on 09112021 by burhan
        
      }

      // back to search table
      backToSearchTable() {
        this.title1 = 'HR Comm - Comm. List';
        this.showAdd = false;
        this.showEdit = false;
        this.showPrev = false;
        this.showFltr = true;
        this.imgURL = '';
        this.imgThumbURL = '';
      
        this.htmlString_eng = ''; // added on 09112021 by burhan
        this.htmlString_mal = ''; // added on 09112021 by burhan

       }

      backToEdit(){
        this.showEdit = true;
        this.showPrev = false;
        this.showFltr = false;
      }

      openPrevModal(){
        //this.showEdit = false;
        this.showPrev = true;
        //this.showFltr = false;
      }


  public imagePath;
  imgURL: any;
  imgMalURL: any;
  imgEngURL: any;
  
  malRealURL: any;
  engRealURL: any; 
  public messageImg: string;

  public imageThumbPath; 
  imgThumbURL: any;
  public messageImgThumb: string;
   
  previewMalay(event) {
    if (event.target.files && event.target.files.length === 0){
    this.messageImg = "Only images are supported.";
    return;
    }
 
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageImg = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgMalURL = reader.result; 
    }

    this.bodyImgMalayFiles = event.target.files; 
  }
  
  previewEditMalay(event,eID) {
    if (event.target.files && event.target.files.length === 0){
    this.messageImg = "Only images are supported.";
    return;
    }
 
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageImg = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgMalURL = reader.result; 
    }

    this.bodyImgMalayFiles = event.target.files;
    
    this.postCommBodyImg(eID,hrcVars.postCommBodyImgAddAPI);
  }

  previewEnglish(event) {
    if (event.target.files && event.target.files.length === 0){
    this.messageImg = "Only images are supported.";
    return;
    }
 
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageImg = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgEngURL = reader.result; 
    }

    this.bodyImgEnglishFiles = event.target.files; 
  }

  previewEditEnglish(event,eID) {
    if (event.target.files && event.target.files.length === 0){
    this.messageImg = "Only images are supported.";
    return;
    }
 
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageImg = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgEngURL = reader.result; 
    }

    this.bodyImgEnglishFiles = event.target.files;
    
    this.postCommBodyImgEng(eID,hrcVars.postCommBodyEngImgAddAPI);
  }

  previewThumb(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageImgThumb = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imageThumbPath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgThumbURL = reader.result; 
    }

    this.thumbImgFiles = files; 
  }

  previewEditThumb(event,eID) {
    if (event.target.files && event.target.files.length === 0){
      this.messageImgThumb = "Only images are supported.";
      return;
      }
   
      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.messageImgThumb = "Only images are supported.";
        return;
      }
   
      var reader = new FileReader();
      this.imageThumbPath = event.target.files;
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
        this.imgThumbURL = reader.result; 
      }
  
    this.thumbImgFiles = event.target.files;
    
    this.postThumbnail(eID,hrcVars.postCommThumbImgAddAPI);
  }

  postCommBodyImg(commID, api){
        
    let form_Data = new FormData();
    form_Data.append('hrcommImg', this.bodyImgMalayFiles[0], this.bodyImgMalayFiles[0].name.toLowerCase());
    form_Data.append('hrcommID', commID);

    this._POST_api_Service.POST_CommImage(api, form_Data).subscribe(res => {

        this.bodyimg = '';
        this.bodyImgMalayFiles = [];

    }, err=>{
        this.bodyimg = '';
        this.bodyImgMalayFiles = [];
        this.notifyMsg = "Failed to Upload the Malay Body Image";
        // this.notifier.notify('error', this.notifyMsg);
    })
 }

postCommBodyImgEng(commID, api){
        
  let form_Data = new FormData();
  form_Data.append('hrcommImg', this.bodyImgEnglishFiles[0], this.bodyImgEnglishFiles[0].name.toLowerCase());
  form_Data.append('hrcommID', commID);

  this._POST_api_Service.POST_CommImage(api, form_Data).subscribe(res => {

      this.bodyimg = '';
      this.bodyImgEnglishFiles = [];

  }, err=>{
      this.bodyimg = '';
      this.bodyImgEnglishFiles = [];
      this.notifyMsg = "Failed to Upload the English Body Image";
      // this.notifier.notify('error', this.notifyMsg);
  })

}

  postThumbnail(commID, api){
        
    let form_Data = new FormData();
    form_Data.append('hrcommImg', this.thumbImgFiles[0], this.thumbImgFiles[0].name.toLowerCase());
    form_Data.append('hrcommID', commID);
    //  console.log('orm_Data',form_Data)
    this._POST_api_Service.POST_CommImage(api, form_Data).subscribe(res => {

        this.thumbnail = '';
        this.thumbImgFiles = [];
        // console.log('res',res)
    }, err=>{
        this.thumbnail = '';
        this.thumbImgFiles = [];
        this.notifyMsg = "Failed to Upload the Thumbnail";
        // this.notifier.notify('error', this.notifyMsg);
    })

}

  checkLevel() {
    let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);

    if (     
        (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/3/i.test(usrRole)) &&
        (!/4/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/6/i.test(usrRole)) 
    ) {
        this.routers.navigate(['/admin/unauthorized']);
        return false;
    }
}


//Open View Admin
openAdminVModal(eId){

  this.loading = true;
  this.showEdit = false;
  this.showFltr = true;
  this.getHrcDetailData(eId);
  this.viewReport(eId);
  }

ann_default_imgUrl = 'http://placehold.it/600x400?text=ERA';
getUrlImage(hashImg) {        
  //let imgUrl = GlobalVariable.BASE_IDP_URL + "/hrc/get/image/" + hashImg+ "/?api_key=" + GlobalVariable.API_KEY;
  if(hashImg){
      return GlobalVariable.BASE_IDP_URL + hrcVars.getAnnImg  + hashImg + "/?api_key=" + GlobalVariable.API_KEY;
  } else {
      return this.ann_default_imgUrl;
  }
}

    commAttachment;
    view_list_attachment
    getCommAttachment(id) {        
        
        let getCommDetail = hrcVars.getCommAttachment+id;
        // console.log(getCommDetail);
        this._GET_api_Service.GET_HRC_data(getCommDetail).subscribe(data => {   
            if(data.length>0){
                this.commAttachment = data;
                for (var i = 0; i < this.commAttachment.length; i++) {
                    this.commAttachment[i].filename = this.commAttachment[i].image_url.substring(this.commAttachment[i].image_url.lastIndexOf('/')+1);
                    this.commAttachment[i].url_attachment = this.getUrlImage(this.commAttachment[i].image_hash);    
                }
                this.view_list_attachment = this.commAttachment;
                console.log('commAttachment',this.commAttachment);
            } else {                
                console.log('No data attachment');
                this.view_list_attachment = [];
            }
        }, error => {
            console.log('[ERROR] Fetch data attachment ' + error);
        })   
    }   


  //************************************
  //          HR-Comm Report
 // ************************************

 dtCategory; dtType; dtViewer;
 dttotAnnounce; dttotViewer;
 loadingReport= false;
newReportYr = [];
submitYear(type){
    this.descEmptyData = 'List is Empty';
    let dataPos = {};
   
    if(type === 1){
       
        dataPos = {
            year: this.filterYear.get('txtboxYear').value,
        }
     }  
    this.newReportYr = [];
    this.showRepByYear = true;
    
      this._POST_api_Service.POST_IDP_data(hrcVars.postFilterYear, dataPos).subscribe(dataRes => {
        let dtYear: any = {};
          dtYear = dataRes;
          this.dtCategory = dataRes.category;
          this.dtType = dataRes.type;
          this.dtViewer = dataRes.countviewer[0];
          this.dttotAnnounce = dataRes.countAnnoucement;
          this.dttotViewer = dataRes.countviewer[0].count_access + dataRes.countviewer[0].count_comment 
                           + dataRes.countviewer[0].count_like  + dataRes.countviewer[0].count_share
                           + dataRes.countviewer[0].count_view;
          this.monthCatYr = dataRes.countAnctMonth.map(countAnctMonth => 
            ({name:countAnctMonth.month, value:countAnctMonth.count}));

          this.graphShowCate = dataRes.graphmonthviewer.map(group => {
            group.series = group.series.map(dataCatYr => {
              dataCatYr.name === null || dataCatYr.name === ''; 
              dataCatYr.value=== null || dataCatYr.value === '';
              return dataCatYr;
            })
            return group;
          })
         
          this.loading = false;   
          this.showRepCurrYear = false;
          this.showRepByYear = true;
        
                                   
    }, error => {
        console.log('[ERROR] Fail to submit year: ' + error);
        if(error == 'Error: 500'){
           this.loading = false;
        }
    });
  }  


  // Display Announcement for current year
 
  reportTotal = [];
  reportTotalCat;
  reportTotalType; 
  reportYear; viewCount;
  viewer; totAnnounce;
  totViewer= 0;
  showRepCurrYear = false;
  showRepByYear = false;

  getReportHr() {
      this.loading = true; 
      this._GET_api_Service.GET_HRC_data(hrcVars.getReport).subscribe(data => {
          this.reportTotal = data;
          this.showRepCurrYear = true;
          this.showRepByYear = false;
          this.reportTotalCat = data.category;
          this.reportTotalType = data.type;
          this.reportYear = data.year;
        
          this.viewer = data.viewerResponse[0];
          this.viewCount = data.countviewer[0];
          this.totAnnounce = data.countAnnoucement;
          this.totViewer = data.countviewer[0].count_access + data.countviewer[0].count_comment 
                           + data.countviewer[0].count_like  + data.countviewer[0].count_share
                           + data.countviewer[0].count_view;
          this.monthCat = data.countAnctMonth.map(countAnctMonth => ({name:countAnctMonth.month, value:countAnctMonth.count}));
          this.graphSubMulti = data.graphmonthviewer.map(group => {
            group.series = group.series.map(dataItem => {
              dataItem.name === null || dataItem.name === '' ; 
              dataItem.value=== null || dataItem.value === '' ;
              return dataItem;
            })
            return group;
          })
          this.loading = false; 
         }, 
         error => {
          console.log('[ERROR] data null: ' + error);
         
      });
    }  

 
   //Download Report CSV
   
   downloadReport() {
    this.downloadAll = true;
    var csvData = this.ConvertToCSV(this.dataDownload);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type:  'text/csv' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    let todayDate = new Date();
    let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
    a.download = 'List of Announcement_' + dateToday + '.csv';
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

 

  
//View Announcement

dataDwPdf;
detailsInfo;
firstLayerArr= [];
overallArr = [];
apikey; viewResult; seclayer; secLayerArr;
globalburl; firstCom; overallRep;
prevLoading = false;

viewReport(newsItem){
 
  this.apikey = GlobalVariable.API_KEY;
  this.globalburl =  GlobalVariable.BASE_API_URL;

    let postData: any = {};
    postData = {
      newsid:newsItem
    }
   
    this.prevLoading = true;
    this._POST_api_Service.POST_HRC_data(hrcVars.postDownPdf, postData).subscribe(res => {
    this.dataDwPdf = res;
    this.detailsInfo = res.details;
    this.viewResult = res.newscount;
    this.overallRep = res.overall;
    this.seclayer =  res.second_layer;
    this.firstCom = res.first_layer;
    this.getCommAttachment(newsItem)
    this.prevLoading = false;
      
   //overall layer
    this.overallArr= [];
    
    for (let i= 0; i < this.overallRep.length; i++) {
    
      let ImgfisrtLyr = GlobalVariable.BASE_API_URL + '/get/image' + "/" + this.overallRep[i].image_url_firstlayer + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(ImgfisrtLyr).subscribe(data => {                        
          if (data) {
              this.overallArr.push({
                Name: this.overallRep[i].namefirstlayer, 
                image_url: ImgfisrtLyr,
                comment:this.overallRep[i].first_layer,
                update_on:this.overallRep[i].commentfirstupdate, 
                second_layer: this.overallRep[i].second_layer,
                news_id: this.overallRep[i].news_id,
                comm_id: this.overallRep[i].comm_id,
                deletecomment: this.overallRep[i].deletecomment,
            });
            
          }
          else {
            this.overallArr.push({
                image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                Name: this.overallRep[i].namefirstlayer, 
                comment:this.overallRep[i].first_layer,
                update_on:this.overallRep[i].commentfirstupdate,
                second_layer: this.overallRep[i].second_layer,
                news_id: this.overallRep[i].news_id,
                comm_id: this.overallRep[i].comm_id,
                deletecomment: this.overallRep[i].deletecomment,
            });
        }
    
        },err => {
            this.overallArr.push({
              image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
              Name: this.overallRep[i].namefirstlayer, 
              comment:this.overallRep[i].first_layer,
              update_on:this.overallRep[i].commentfirstupdate,
              second_layer: this.overallRep[i].second_layer,
              news_id: this.overallRep[i].news_id,
              comm_id: this.overallRep[i].comm_id,
              deletecomment: this.overallRep[i].deletecomment,
              
            });
          });

        } 
       });       
    }

    

 // download PDF

theDate; userId; imgDataUrl; titleReportPdf;
docDefinition; imgAnnMalUrl;
userRep: any;
resultArr;
remarksArr;
panelRemark; panelrole;
imgFirstLyr;
roleName;
downloading3 = true;
subjectAnn; cateAnn; subCateAnn; pubDateAnn; toAnn;
locAnn; imgEngAnn; imgMalAnn; contentAnn; pautAnn;
showImgFL; cAccess; cComment; cView; cLike; secLayerComm;
fName; fDate; fComm; sName; sDate; sComm;
imgFsLayer; imgScLayer;
detailsArr; secLyrArr; secLyrArrTwo; 
secLyrArrTwoName; secLyrArrTwoDate; secLyrArrTwoComm;
secLayerArray = [];

downloadAdminReport(itemId){
  let postData: any = {};
  postData = {
    newsid:itemId
  }
 
  this._POST_api_Service.POST_HRC_data(hrcVars.postDownPdf, postData).subscribe (res => {
  this.dataDwPdf = res;
  this.overallRep = res.overall;
  this.secLyrArr = res.second_layer;
  // console.log('this.dataDwPdf',this.dataDwPdf) 
  // console.log('this.secLyrArr',this.secLyrArr)
  this.detailsArr = res.details[0];
  this.subjectAnn = res.details[0].subject;
  this.cateAnn = res.details[0].category;
  this.subCateAnn = res.details[0].sub_category;
  this.locAnn = res.details[0].location;
  this.pubDateAnn = res.details[0].publish_date;
  this.toAnn = res.details[0].target_empl;
  this.imgEngAnn =  res.details[0].bodyImage_eng;
  this.imgMalAnn =  res.details[0].bodyImage_mal;
  this.cAccess = res.details[0].count_access,
  this.cComment = res.details[0].count_comment,
  this.cLike = res.details[0].count_like,
  this.cView = res.details[0].count_view,
  this.contentAnn = this.htmlString_mal;
  this.firstCom = res.first_layer;
  
    this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
      try {
      this.userId = JSON.parse(localStorage.getItem('currentUser')).userid;
    } catch (e) {
      console.error("Failed to get localStorage for currentUser");
    }
      this.titleReportPdf = `Announcement_${itemId}.pdf`;
      setTimeout(() => {
        this.downloading3 = false;
        let myRp_imgFL = this.imgDataUrl;
        let myRp_Subject = this.subjectAnn;
        let myRp_Category = this.cateAnn;
        let myRp_SubCategory = this.subCateAnn;
        let myRp_Location = this.locAnn;
        let myRp_Access = this.cAccess;
        let myRp_View = this.cView;
        let myRp_Like = this.cLike;
        let myRp_Comment = this.cComment;
        let myRp_To = this.toAnn;
        let myRp_Content = this.contentAnn;
        let myRp_PublishDate = this.datePipe.transform(this.pubDateAnn, 'dd-MM-yyyy h:mm a'); 
                                   
        this.docDefinition = {
          pageSize: 'A4',
          pageMargins: [20, 90],
          watermark: { text: `By: ${this.userId}@${this.theDate}`, color: '#e0e0d1', opacity: 0.3, bold: true },
          background: function(page) {
            if (page !== 1) {
              return [
                {
                  columns: [
                    {
                      width: 175,
                      alignment: 'center',
                      table: {
                        width: ['auto'],
                        body: [
                          [{ text: `\n` }],
                        ]
                      },
                      layout: 'noBorders',
                      margin: [20, 105, 0, 0]
                    }
                  ]
                }
              ]
            }
          },
          header: {},
          footer: function(currentPage, pageCount) {
            return {
              text: 'Page : ' + currentPage.toString() + ' / ' + pageCount,
              color: 'gray',
              bold: 'true',
              alignment: 'right',
              fontSize: 11,
              margin: 20
            }
          },
          content: [],
          images: {
            logoEra: 'data:image/png;base64,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',
            logoTM: 'data:image/png;base64,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'
          },
          styles: {
            
            era_title: {
              fontSize: 14,
              bold: true,
              alignment: 'center',
              margin: [0, 20, 0, 0]
            },
            profile_name: {
              bold: true,
              color: '#0000FF',
              fontSize: 14,
              alignment: 'left',
            },
            header: {
              color: '#fd5806',
              bold: true,
              fontSize: 14,
            },
            profile_header: {
              color: '#5e6063',
              bold: true,
              fontSize: 12,
              alignment: 'left',
            },
            name11: {
              bold: true,
              fontSize: 12,
              alignment: 'left',
            },
                     
             blackSize10: {
                fontSize: 10,
                bold: true,
                alignment: 'justify',
              },

              blackSize10Italic: {
                fontSize: 10,
                bold: false,
                alignment: 'justify',
                italics: true,
              },

              blackNoBoldSize10: {
                fontSize: 10,
                bold: false,
                alignment: 'left'
              },
                  
            }
          }

          // Populate the header of the PDF 
          this.docDefinition.header = {
            table: {
              widths: ['auto', '*', 'auto'],
              //headerRows: 1,
              body: [
                [{ rowSpan: 3, text: '' }, { rowSpan: 3, text: `${myRp_Subject}`, style: 'era_title' }, { rowSpan: 3,  text: ''}],
                [{ rowSpan: 1, text: `${myRp_Subject}`, style: 'era_title' }],
                [{ text: `` }, '', ''],
                [{ colSpan: 3, text: '', fillColor: '#808080' }]
              ]
            },
            layout: 'noBorders',
            margin: [20, 20, 20, 40]
          };

          // Populate the content of PDF
          let myReportContent;
          this.docDefinition.content = [];

          // We invoke another request to convert the blob to Base64
          myReportContent = [
            { // 0.
              table: {
                widths: [350],
                body: [
                  [{ text: '' }]
                ]
              },
              layout: 'noBorders',
              margin: [0, 20, 0, 5]
            },
            { // 1.
              columns: [
                {
                   width: 10,
                  // width: '*',
                  alignment: 'center',
                  table: {
                    width: ['auto'],
                    body: [
                       [{ text: `\n` }],
                    ]
                  },
                  layout: 'noBorders',
                },
                {
                  width: 'auto', margin: 0,
                  type: 'none',
                  ul: [
                    {   //ul[0]
                      table: {
                        body: [
                          [{ columns: [{ width: 90, text: `Title `, style: 'blackSize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myRp_Subject} `, style: 'blackNoBoldSize10' },] }],
                          [{ columns: [{ width: 90, text: 'Category ', style: 'blackSize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myRp_Category}`, style: 'blackNoBoldSize10' },] }],
                          [{ columns: [{ width: 90, text: 'Comm Type ', style: 'blackSize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myRp_SubCategory}`, style: 'blackNoBoldSize10' },] }],
                          [{ columns: [{ width: 90, text: 'To ', style: 'blackSize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myRp_To}`, style: 'blackNoBoldSize10' },] }],
                          [{ columns: [{ width: 90, text: 'Location ', style: 'blackSize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myRp_Location}`, style: 'blackNoBoldSize10' },] }],
                          [{ columns: [{ width: 90, text: 'Publish Date ', style: 'blackSize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${myRp_PublishDate}`, style: 'blackNoBoldSize10' },] }],
                          [{ text: `\n` }],
                          [{ colspan:'1', text: '', fillColor: 'grey' }],
                          [{ text: `\n` }],
                          [{text:[{ text: `${myRp_Like} likes | ${myRp_Comment} Comments | ${myRp_View} Views | ${myRp_Access} Access` , style: 'blackSize10'}]}],
                          [{ text: `\n` }],
                          [{ colspan:'1', text: '', fillColor: 'grey' }],
                        [{ text: `\n` }],
                        ]
                      }, 
                      layout: 'noBorders',
                    },          
                    {   //ul[1]
                      text:  '\n'
                     },
                   { //ul[2]
                      table: {
                        body: [
                          [{ text: `\n` }],
                        ],
                      }, 
                      layout: 'noBorders',
                    },
                    {   //ul[3]
                      text: '\n'
                    },
                    { //ul[4]
                      table: {
                        body: [
                          [{ text: `\n` }],
                        ],
                      }, 
                      layout: 'noBorders',
                    },
                    {   //ul[5]
                      text: '\n\n'
                    },
                    { //ul[6]
                      table: {
                        body: [
                          [{ text: `\n` }],
                        ],
                      }, 
                      layout: 'noBorders',
                    },
                  ]
                }
              ]
            },
          ];
        
          // Populate - Announcement detail
          if (this.overallRep.length > 0) {
            let overallRepList = {
              type: 'none',
               ul: []
            };
            this.overallRep.forEach(function (myVal) {
            let myRow = [];
            if((myVal.deletecomment != 0) && (myVal.second_layer[0].namesecondlayer != null)) {
                myRow.push({ text: [{ text: `${myVal.namefirstlayer}, ${myVal.commentfirstupdate.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' }] });
                myRow.push({ text: `${myVal.first_layer}`, style: 'blackSize10'});
                myRow.push({ text: '\n' }); 
                myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                    { text: `${myVal.second_layer[0].namesecondlayer}, ${myVal.second_layer[0].commentsecondlayer.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' }]}); 
                myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                      { text: `${myVal.second_layer[0].second_layer}`, style: 'blackSize10' }] });
                myRow.push({ text: '\n' });   
             }
            if((myVal.deletecomment != 0) && (myVal.second_layer[0].namesecondlayer == null)) {
                myRow.push({ text: [{ text: `${myVal.namefirstlayer}, ${myVal.commentfirstupdate.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' }] });
                myRow.push({ text: [{ text: `${myVal.first_layer}`, style: 'blackSize10' }] });
                myRow.push({ text: '\n' });
                myRow.push({ text: '\n' });
             }
             if((myVal.deletecomment == 0) && (myVal.second_layer[0].namesecondlayer != null)) {
                myRow.push({ text: `Removed`, style: 'blackSize10Italic'});
                myRow.push({ text: '\n' }); 
                myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                            { text: `${myVal.second_layer[0].namesecondlayer}, ${myVal.second_layer[0].commentsecondlayer.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' }]}); 
                myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                            { text: `${myVal.second_layer[0].second_layer}`, style: 'blackSize10' }] });
                myRow.push({ text: '\n' }); 
              }
             overallRepList.ul.push(myRow);  
            });
              myReportContent[1].columns[1].ul[2] = overallRepList;
            }

          // Comm only, No announcement
          if (this.overallRep.length < 0) {
            let overallCommList = {
              type: 'none',
               ul: []
            };
            let myRow = [];
            overallCommList.ul.push(myRow);  
            myReportContent[1].columns[1].ul[4] = overallCommList;
          }

          //  second Layer Array 
          if (this.secLyrArr.length > 0){
            let secLayerArrList = {
              type: 'none',
               ul: []
            };
            this.secLyrArr.forEach(function (myVal) {
            if(myVal.deletecomment == null){
            let myRow = [];
              myRow.push({ text: `${myVal.name_firstid} ${myVal.update_on_firstlayer.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' });
              myRow.push({ text: `${myVal.comment_firstlayer}`, style: 'blackSize10' });
              myRow.push({ text: '\n' });
              myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
              { text: `${myVal.Name}, ${myVal.update_on.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' }]}); 
              myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                          { text: `${myVal.comment}`, style: 'blackSize10' }] });
              myRow.push({ text: '\n' }); 
              myRow.push({ text: '\n' });
              secLayerArrList.ul.push(myRow); 
              } 
              else  
                  if(myVal.deletecomment == 0){
                  let myRow = [];
                    myRow.push({ text: `Removed`, style: 'blackSize10Italic'});
                    myRow.push({ text: '\n' }); 
                    myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                    { text: `${myVal.Name}, ${myVal.update_on.split("T")[0].split('-').reverse().join('/')}`, style: 'blackSize10' }]}); 
                    myRow.push({ columns: [{width: 20, text: ``, style: 'blackSize10' }, 
                                { text: `${myVal.comment}`, style: 'blackSize10' }] });
                    myRow.push({ text: '\n' }); 
                    myRow.push({ text: '\n' });
                    secLayerArrList.ul.push(myRow); 
                    } 
             }); 
             myReportContent[1].columns[1].ul[4] = secLayerArrList;
          }  
          
        this.docDefinition.content.push(myReportContent);
        this.downloadAdminForm();
      }, 1500)
    }, error => {
      console.log('[ERROR] Fail to fetch Report for Admin: ' + error);
    });
  }
    
  downloadAdminForm() {
    pdfMake.createPdf(this.docDefinition).download(this.titleReportPdf);
    this.imgDataUrl = '';  
  }  

 
  // Delete first layer Comment
    
    selnewsIdF: any = {};
    postDelFirst(itmFirst, newsIdF){
      this.selnewsIdS = newsIdF;
   
      let dataPost: any = {};
      dataPost = {
        comm_id: itmFirst
      }
     
      let dataDelFs: any = {};
       this._POST_api_Service.POST_HRC_data(hrcVars.postDelFirstLayer, dataPost).subscribe(data => {
        dataDelFs = data;
        // console.log('dataDelFs',dataDelFs)
        if (dataDelFs[0].del === 0 ) {
          this.notifier.notify('success', 'Successful');
          this.openAdminVModal( this.selnewsIdS);
        } else {
          this.notifier.notify('error', 'Error -delete comment!');
      }
      this.loading = false; 
      },
      error => {
          console.log('[ERROR + User Not Found: ' + error);
     }) 
    }
     
    // Delete second layer Comment
    selnewsIdS: any = {};
    postDelSec(itmSec, newsIdS){
   
      this.selnewsIdS = newsIdS;
      let dataPost: any = {};
      dataPost = {
        comm_id: itmSec
      }
     
      let dataDelSec: any = {};
       this._POST_api_Service.POST_HRC_data(hrcVars.postDelSecLayer, dataPost).subscribe(data => {
        dataDelSec = data;
        
        if (dataDelSec.status === "OK" ) {
          this.notifier.notify('success', 'Successful');
          this.openAdminVModal(this.selnewsIdS);
        } else {
          this.notifier.notify('error', 'Error -delete comment!');
      }
      this.loading = false; 
     
      },
      error => {
          console.log('[ERROR + User Not Found: ' + error);
     }) 
    }
  
  //Add New Category
   postNewCategory(){
    
    let dataPost: any = {};
      dataPost = {
        category: this.newCategoryForm.get('addNewCate').value,
        discription: this.newCategoryForm.get('addDescCate').value,
      }
     
      this.loading = true; 
      let dataPostCat: any = {};
      this._POST_api_Service.POST_HRC_data(hrcVars.postNewCategory, dataPost).subscribe(data => {
        dataPostCat = data;
        if (dataPostCat.status === "OK" ) {
          this.notifier.notify('success', 'Successful');
          this.loading = false; 
          this.getCategory();
          this.openAddModal();
         } else {
          this.notifier.notify('error', 'Error - Add New Category!');
      }
      this.loading = false; 
     },
      error => {
          console.log('[ERROR + User Not Found: ' + error);
    }) 
   }
    
   
   //Add New Comm Type
   postNewCommType(){
    
    let dataPost: any = {};
      dataPost = {
        type: this.newCommTypeForm.get('addNewCommType').value,
        discription: this.newCommTypeForm.get('addDescCommType').value,
      }
     
      this.loading = true; 
      let dataPostComm: any = {};
      this._POST_api_Service.POST_HRC_data(hrcVars.postNewCommType, dataPost).subscribe(data => {
        dataPostComm = data;
       
        if (dataPostComm.status === "OK" ) {
          this.notifier.notify('success', 'Successful');
          this.loading = false; 
          this.getCommType();
          this.openAddModal();
         } else {
          this.notifier.notify('error', 'Error - Add New Comm Type!');
      }
      this.loading = false; 
      },
      error => {
          console.log('[ERROR + User Not Found: ' + error);
    }) 
   }

   //Reset category
   resetCategory() {
    this.newCategoryForm.setValue({
      addNewCate: "",
      addDescCate: ""
    });
   }

    //Reset Comm Type
     resetCommType() {
      this.newCommTypeForm.setValue({
        addNewCommType: "",
        addDescCommType: ""
      });
     }

  //Reset Image
  resetImage(){
    this.commAddForm.setValue({
      addBodyTextInputMal:"",
      fileAddBodyImgMal:"",
    }) 
   }

   
   //download html to pdf
  @ViewChild('content') content: ElementRef;

  public downloadPDFtext() {
    const doc = new jspdf();
    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    const content = this.content.nativeElement;
    doc.fromHTML(content.innerHTML, 15, 15, {
      width: 150,
      'elementHandlers': specialElementHandlers
    });
     doc.save('test.pdf');
  }
        
}