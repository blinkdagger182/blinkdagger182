import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import * as moment from 'moment';

@Component({
    selector: 'app-ques',
    templateUrl: './ques.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../settings-css.css']
})

export class quesComponent implements OnInit {

    private readonly notifier: NotifierService;
    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        //private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        notifierService: NotifierService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver, private _script: ScriptLoaderService,
    ) {
        this.notifier = notifierService;
    }

    addNewQ: FormGroup;
    updateQs: FormGroup;
    filterForm : FormGroup;
    filterForm1 : FormGroup;

    modules = {
        // formula: true,
        // imageResize: {},
        // syntax: true,
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            ['bold', 'italic', 'underline'], //['bold', 'strike'],   // toggled buttons
            // ['blockquote', 'code-block'],          
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'align': [] }],
            // ['clean']       
        ],
        //   placeholder: 'Compose an epic...',
        //   theme: 'snow'
    }
    
    loading2;currentUser;
    currDt;startDt;
    currYr:number; 
    TCYear;
    loading = true;
    displayAdd = false;
    data: any[];
    data2: any[];
    overdue;
          
    ngOnInit() {
        //this.rmErr();
        this.loading2 = true;   
        this.currDt = moment(Date.now()).format("DD/MM/YYYY");
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currYr = new Date().getFullYear();
        this.getFAQ(this.currYr);          
        this.getStardesc();

        this.filterForm = new FormGroup({
            tc_year: new FormControl('', Validators.required),
        });
               
        this.filterForm.setValue({
            tc_year: "",
        });

        this.filterForm1 = new FormGroup({
            copyfrom: new FormControl('', Validators.required),
            copyto: new FormControl('', Validators.required),
        });
               
        this.filterForm1.setValue({
            copyfrom: "",
            copyto: "",
        });
        
        this.addNewQ = new FormGroup({         
            addYear: new FormControl({value: null, disabled: true}, Validators.required),
            addQuestion: new FormControl(null, Validators.required),
            addStarDesc: new FormControl(null, Validators.required),
            addNoofStar: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),

        });

        this.addNewQ.setValue({
            addYear: this.currYr,
            addQuestion: "",
            addStarDesc: "",
            addNoofStar: "",
        });

        this.updateQs = new FormGroup({
            updYear: new FormControl({value: null, disabled: true}, Validators.required),
            updQuestion: new FormControl(null, Validators.required),
            updStarDesc: new FormControl(null, Validators.required),
            updNoofStar: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
        });

        this.getBatch(); 
        
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-ques',
            [
                'assets/js/superadmin/delete-faq.js',
            ]);
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    // rmErr(){
    //     $('#erraddQuestion').addClass("m--hide");
    //     $('#erraddStarDesc').addClass("m--hide");
    //     $('#erraddNoofStar').addClass("m--hide");
    //     };

    //get QnA
    selQnA = {
        id: '',
        yr: '',
        qno: '',  
        ques: '', 
        star: '', 
        nostar: '',
        stDate: ''
    };
    selectQnA(item) {
        this.selQnA = {
            id: item.id,
            yr: item.yr,
            qno: item.qno,
            ques: item.ques,
            star: item.star,
            nostar: item.nostar,
            stDate: item.stDate
        };
        //console.log('this.selQnA', this.selQnA);
    }

    loadingSubmit = false;

    //add
    addExtra = false
    clickAdd() {
        this.addExtra = true;
    }
    
    batchInfo;
    getBatch() {
        this._GET_api_Service.GET_TC_DATA('/tc/admin/get_sessions').subscribe(data => {
            console.log(data)
            this.batchInfo = data;
            //this.sstartDt = moment(data[0].start_date).format("DD-MM-YYYY");
            let stat = this.batchInfo.find(x => x.year == this.currYr);

            if (stat) {
                this.filterForm.patchValue({ tc_year: this.currYr });
                // this.filterForm.patchValue({ fstartDt: this.sstartDt });
                this.TCYear = this.currYr;
                this.displayAdd = true;
            }
            
        }, error => {
            console.log('[ERROR - Fail to get session] ' + error);
        });
    }

    starDescInfo;
    getStardesc() {
        this._GET_api_Service.GET_TC_DATA('/tc/admin/getStarDesc').subscribe(data => {
            console.log(data)
            this.starDescInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get star desc] ' + error);
        });
    }

    changeyr() {
        this.loading2 = true;
        this.TCYear = this.filterForm.get('tc_year').value;       
        this.getFAQ(this.TCYear);
        this.displayAdd = true;
        this.addNewQ.patchValue({ addYear: this.TCYear });            
    }
    
    copySet(){       
        let dataPos;
        dataPos = {                   
                    year: this.filterForm1.get('copyfrom').value,
                    newyear: this.filterForm1.get('copyto').value
                }
     
        this._POST_api_Service.POST_TC_data('/tc/admin/copyTCQues', dataPos).subscribe(data => {
            console.log(data)
        
            if (data.status === 0) {
                this.notifier.notify('success', 'Success !');
            } else {
                this.notifier.notify('error', 'Unable to copy');
            }
        },
            error => {
                console.log('[ERROR', error);
            }
        )

    }

    //add new question
    addNewQsubmit() {
        if(this.addNewQ.status == 'VALID'){
        let data = {
            "year": this.addNewQ.get('addYear').value,
            //"ques_no": this.addNewQ.get('ques_no').value,
            "question": this.addNewQ.get('addQuestion').value,
            "star_desc": this.addNewQ.get('addStarDesc').value,
            "no_of_star": this.addNewQ.get('addNoofStar').value
        }
        this._POST_api_Service.POST_TC_data('/tc/admin/addTCQues', data).subscribe(res => {
            
            if (res.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New Question!');
                this.getFAQ(this.TCYear);

            } else {
                this.notifier.notify('error', 'Fail to Add Question!');
            }
            // this.addNewQ.reset(); 
            this.addNewQ.controls['addQuestion'].reset();
            this.addNewQ.controls['addStarDesc'].setValue('');
            this.addNewQ.controls['addNoofStar'].reset();
            this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR' + error);            
            }
        )
        }
        else{
            this.notifier.notify('error', 'Input error. Fail to Add Question!');
            // let j = this.addNewQ;
            //if(j.controls['addQuestion'].status == 'INVALID') $('#erraddQuestion').removeClass("m--hide"); else $('#erraddQuestion').addClass("m--hide");             
        }
    }

    //update question
    editQsubmit() {
        if(this.updateQs.status == 'VALID'){
        let data = {
            "year": this.updateQs.get('updYear').value,
            //"ques_no": this.addNewQ.get('ques_no').value,
            "question": this.updateQs.get('updQuestion').value,
            "star_desc": this.updateQs.get('updStarDesc').value,
            "no_of_star": this.updateQs.get('updNoofStar').value,
            "id": this.selQnA.id
        }
        this._POST_api_Service.POST_TC_data('/tc/admin/updateTCQues', data).subscribe(res => {
            
            if (res.status === "OK") {
                this.notifier.notify('success', 'Successfully Update Question!');
                this.getFAQ(this.TCYear);

            } else {
                this.notifier.notify('error', 'Fail to Update Question!');
            }
            this.updateQs.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR' + error);            
            }
        )
        }
        else{
            this.notifier.notify('error', 'Input error. Fail to Update Question!');
        }
    }

    //edit FAQ Extra submit
    // editFAQ_extrasubmit() {
    //     let data = {
    //         "id": this.selQnA.id
    //         // ,
    //         // "question": this.editFAQ_extra.get('editQextra').value === null ? this.selQnA.q : this.editFAQ_extra.get('editQextra').value,
    //         // "answer": this.editFAQ_extra.get('editAextra').value === null ? this.selQnA.a : this.editFAQ_extra.get('editAextra').value,
    //     }

    //     this._POST_api_Service.POST_data('/faq/edit', data).subscribe(dataFAQedit => {
    //         console.log(dataFAQedit)
    //         if (dataFAQedit.status === "OK") {
    //             this.notifier.notify('success', 'Successfully Edited FAQ!');

    //             this.getFAQ(this.TCYear);

    //         } else {
    //             this.notifier.notify('error', 'Failed to edit FAQ !');
    //         }
    //         this.editFAQ_extra.reset(); this.loadingSubmit = false;
    //     },
    //         error => {
    //             console.log('[ERROR + User Not Found: ' + error);

    //         }
    //     )
    // }

    delfaq() {
        let data = {
            ques_id: this.selQnA.id
        }
        let deletefaqextra = this._POST_api_Service.POST_TC_data('/tc/admin/delQues', data);
        let dataJUDel: any = {};
        let ret = deletefaqextra.subscribe(dataRes => {
            dataJUDel = dataRes;
            if (dataJUDel.status === 0) {
                this.notifier.notify('success', 'Successfully delete question');
                this.getFAQ(this.TCYear);
            } else {
                this.notifier.notify('error', 'Error - Unable to delete selected question');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )

    }

    //fuction to sequence UP ques 
    UPfaq(item) {
        console.log(item);
        let data = {
           
            id: item.id

        }
        console.log(data);
        let upfaq = this._POST_api_Service.POST_TC_data('/tc/admin/sequp', data);
        let dataupfaq: any = {};
        let ret = upfaq.subscribe(dataUp => {
            dataupfaq = dataUp;
            if (dataupfaq.status === "OK") {
                this.notifier.notify('success', 'Successfully UP Ques !');
                this.getFAQ(this.TCYear);
            } else {
                this.notifier.notify('error', 'Error');
            }
        },
            error => {
                console.log('[ERROR', error);
            }
        )

    }

    DOWNfaq(item){
        console.log(item);
        let data = {
           
            id: item.id 

        }
        console.log(data);
        let downfaq = this._POST_api_Service.POST_TC_data('/tc/admin/seqdown', data);
        let datadownfaq: any = {};
        let ret = downfaq.subscribe(dataUp => {
            datadownfaq = dataUp;
            if (datadownfaq.status === "OK") {
                this.notifier.notify('success', 'Successfully DOWN Ques !');
                this.getFAQ(this.TCYear);
            } else {
                this.notifier.notify('error', 'Error');
            }
        },
            error => {
                console.log('[ERROR', error);
            }
        )

    }

    //function get ques 
    getFAQ(yr) {
        //let yr= 2050;
        type TrackingData = {
            id: number, yr: number, qno: number, ques: string, star: string, nostar:number, stDate: any
        };
        let myarray2:TrackingData[] = [];
        this._GET_api_Service.GET_TC_DATA('/tc/admin/getQListByYr/'+yr)

            .subscribe(data => {
                this.loading = false;
                this.loading2 = false;
                for (let i = 0; i < data.length; i++) {       
                    myarray2.push({
                        id: data[i].id,
                        yr: data[i].year,
                        qno: data[i].ques_no,  
                        ques: data[i].question, 
                        star: data[i].star_desc, 
                        nostar: data[i].no_of_star,
                        stDate: data[i].start_date,
                        //a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                    });                               
                }
                
                this.data2 = myarray2;

                if(this.data2.length<1){ 
                    let yrr = this.batchInfo.findIndex(x => x.year == this.TCYear);
                    this.startDt = moment(this.batchInfo[yrr].start_date).format("DD/MM/YYYY");   
                }
                else{
                    this.startDt = moment(data[0].start_date).format("DD/MM/YYYY");                   
                }
                
                //this.overdue = this.currDt > this.startDt ? true : false;
                let arrSt = this.currDt.split("/");
                let arrEn = this.startDt.split("/");
                
                let sDt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]))
                let eDt = new Date(Date.parse(arrEn[1] + '-' + arrEn[0] + '-' + arrEn[2]));

                this.overdue = sDt >= eDt ? true : false;
              
                
                          
            },
                error => {
                    this.showAlert('alertError');
                    this._alertService.error("Loading TC Ques Failed");
                    console.log('[ERROR - TC Ques] ' + error);
                    this.loading = true;                  
                });

    };



}


