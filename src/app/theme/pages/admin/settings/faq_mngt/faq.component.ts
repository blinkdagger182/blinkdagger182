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

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../settings-css.css']
})

export class FaqComponent implements OnInit {

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

    addFAQ_extra: FormGroup;
    addFAQweb: FormGroup;
    addFAQapp: FormGroup;
    addFAQjobads: FormGroup;
    addFAQTmMove: FormGroup;
    editFAQ_extra: FormGroup;
    editfaqweb: FormGroup;
    editfaqapp: FormGroup;
    editFAQ_jobads: FormGroup;
    editFAQ_TmMove: FormGroup;
    //delextrafaq = JUVars.delextrafaq;

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
    currentUser;
    loading = true;
    data: any[];
    data2: any[];
    data3: any[];
    data4: any[];
    data5: any[];

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


        this.getFAQ();

        this.addFAQ_extra = new FormGroup({
            addQextra: new FormControl(null, Validators.required),//minLength(2)),
            addAextra: new FormControl(null, Validators.required),//minLength(2)),
        })

        this.addFAQ_extra.setValue({
            addQextra: "",
            addAextra: "",
        })


        this.addFAQweb = new FormGroup({
            addQweb: new FormControl(null, Validators.required),//minLength(2)),
            addAweb: new FormControl(null, Validators.required),//minLength(2)),
        })

        this.addFAQweb.setValue({
            addQweb: "",
            addAweb: "",
        })

        this.addFAQapp = new FormGroup({
            addQapp: new FormControl(null, Validators.required),//minLength(2)),
            addAapp: new FormControl(null, Validators.required),//minLength(2)),
        })

        this.addFAQapp.setValue({
            addQapp: "",
            addAapp: "",
        })

        this.addFAQjobads = new FormGroup({
            addQjobads: new FormControl(null, Validators.required),//minLength(2)),
            addAjobads: new FormControl(null, Validators.required),//minLength(2)),
        })

        this.addFAQjobads.setValue({
            addQjobads: "",
            addAjobads: "",
        })

        this.addFAQTmMove = new FormGroup({
            addQTmMove: new FormControl(null, Validators.required),//minLength(2)),
            addATmMove: new FormControl(null, Validators.required),//minLength(2)),
        })

        this.addFAQTmMove.setValue({
            addQTmMove: "",
            addATmMove: "",
        })

        this.editFAQ_extra = new FormGroup({
            editQextra: new FormControl(),
            editAextra: new FormControl(),
        })

        this.editfaqweb = new FormGroup({
            editQweb: new FormControl(),
            editAweb: new FormControl(),
        })

        this.editfaqapp = new FormGroup({
            editQapp: new FormControl(),
            editAapp: new FormControl(),
        })

        this.editFAQ_jobads = new FormGroup({
            editQjobads: new FormControl(),
            editAjobads: new FormControl(),
        });

        this.editFAQ_TmMove = new FormGroup({
            editQTmMove: new FormControl(),
            editATmMove: new FormControl(),
        });

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-faq',
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

    //get QnA
    selQnA = {
        id: '',
        q: '',
        a: '',
    };
    selectQnA(item) {
        this.selQnA = {
            id: item.id,
            q: item.q,
            a: item.a,
        };
        console.log('this.selQnA', this.selQnA);
    }

    loadingSubmit = false;

    //add
    addExtra = false
    clickAdd() {
        this.addExtra = true;
    }

    //add FAQ Extra submit
    addFAQ_extrasubmit() {
        let data = {
            "type": "4",
            "question": this.addFAQ_extra.get('addQextra').value,
            "answer": this.addFAQ_extra.get('addAextra').value
        }
        this._POST_api_Service.POST_data('/faq/add', data).subscribe(dataFAQe => {
            if (dataFAQe.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Error - Cannot add new FAQ!');
            }
            this.addFAQ_extra.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

    //add FAQ Web submit
    addFAQ_websubmit() {
        let data = {
            "type": "3",
            "question": $("#addQweb").val().toString(),
            "answer": this.addFAQweb.get('addAweb').value
        }
        this._POST_api_Service.POST_data('/faq/add', data).subscribe(dataFAQw => {
            if (dataFAQw.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Error - Cannot add new FAQ!');
            }
            this.addFAQweb.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

    //add FAQ  App submit
    addFAQ_appsubmit() {
        let data = {
            "type": "2",
            "question": $("#addQapp").val().toString(),
            "answer": this.addFAQapp.get('addAapp').value
        }
        this._POST_api_Service.POST_data('/faq/add', data).subscribe(dataFAQapp => {
            if (dataFAQapp.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Error - Cannot add new FAQ!');
            }
            this.addFAQ_extra.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }



    //add FAQ Job ads submit
    addFAQ_jobadssubmit() {
        let data = {
            "type": "1",
            "question": this.addFAQjobads.get('addQjobads').value,
            "answer": this.addFAQjobads.get('addAjobads').value
        }
        this._POST_api_Service.POST_data('/faq/add', data).subscribe(dataFAQjobads => {
            if (dataFAQjobads.status === "OK") {
                this.notifier.notify('success', 'Successfully Add New Job Ads FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Error - Cannot add new FAQ!');
            }
            this.addFAQjobads.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found:' + error);

            }
        )
    }

    //edit FAQ Extra submit
    editFAQ_extrasubmit() {
        let data = {
            "id": this.selQnA.id,
            "question": this.editFAQ_extra.get('editQextra').value === null ? this.selQnA.q : this.editFAQ_extra.get('editQextra').value,
            "answer": this.editFAQ_extra.get('editAextra').value === null ? this.selQnA.a : this.editFAQ_extra.get('editAextra').value,
        }

        this._POST_api_Service.POST_data('/faq/edit', data).subscribe(dataFAQedit => {
            console.log(dataFAQedit)
            if (dataFAQedit.status === "OK") {
                this.notifier.notify('success', 'Successfully Edited FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Failed to edit FAQ !');
            }
            this.editFAQ_extra.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

    //edit FAQ Web submit
    editFAQ_websubmit() {
        let data = {
            "id": this.selQnA.id,
            "question": this.editfaqweb.get('editQweb').value === null ? this.selQnA.q : this.editfaqweb.get('editQweb').value,
            "answer": this.editfaqweb.get('editAweb').value === null ? this.selQnA.a : this.editfaqweb.get('editAweb').value,
        }

        this._POST_api_Service.POST_data('/faq/edit', data).subscribe(FAQwebedit => {
            // console.log(FAQwebedit)
            if (FAQwebedit.status === "OK") {
                this.notifier.notify('success', 'Successfully Edited FAQ!'); //popout

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Failed to edit FAQ!');
            }
            this.editfaqweb.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

    //edit FAQ App submit
    editFAQ_appsubmit() {
        let data = {
            "id": this.selQnA.id,
            "question": this.editfaqapp.get('editQapp').value === null ? this.selQnA.q : this.editfaqapp.get('editQapp').value,
            "answer": this.editfaqapp.get('editAapp').value,
        }

        this._POST_api_Service.POST_data('/faq/edit', data).subscribe(FAQappedit => {
            console.log(FAQappedit)
            if (FAQappedit.status === "OK") {
                this.notifier.notify('success', 'Successfully Edited FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Failed to edit FAQ !');
            }
            this.editfaqapp.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

    //edit FAQ Job Ads submit
    editFAQ_jobadssubmit() {
        let data = {
            "id": this.selQnA.id,
            "question": this.editFAQ_jobads.get('editQjobads').value === null ? this.selQnA.q : this.editFAQ_jobads.get('editQjobads').value,
            "answer": this.editFAQ_jobads.get('editAjobads').value,
        }

        this._POST_api_Service.POST_data('/faq/edit', data).subscribe(dataFAQJobadsedit => {
            console.log(dataFAQJobadsedit)
            if (dataFAQJobadsedit.status === "OK") {
                this.notifier.notify('success', 'Successfully Edited FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Failed to edit FAQ !');
            }
            this.editFAQ_jobads.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

        //add FAQ Job ads submit
        addFAQ_TmMoveSubmit() {
            let data = {
                "type": "5",
                "question": this.addFAQTmMove.get('addQTmMove').value,
                "answer": this.addFAQTmMove.get('addATmMove').value
            }
            this._POST_api_Service.POST_data('/faq/add', data).subscribe(dataFAQTmMove => {
                if (dataFAQTmMove.status === "OK") {
                    this.notifier.notify('success', 'Successfully Add New TM On The Move FAQ!');
    
                    this.getFAQ();
    
                } else {
                    this.notifier.notify('error', 'Error - Cannot add new FAQ!');
                }
                this.addFAQTmMove.reset(); this.loadingSubmit = false;
            },
                error => {
                    console.log('[ERROR + User Not Found:' + error);
    
                }
            )
        }

    //edit FAQ Job Ads submit
    editFAQ_TmMoveSubmit() {
        let data = {
            "id": this.selQnA.id,
            "question": this.editFAQ_TmMove.get('editQTmMove').value === null ? this.selQnA.q : this.editFAQ_TmMove.get('editQTmMove').value,
            "answer": this.editFAQ_TmMove.get('editATmMove').value,
        }

        this._POST_api_Service.POST_data('/faq/edit', data).subscribe(dataFAQJobadsedit => {
            console.log(dataFAQJobadsedit)
            if (dataFAQJobadsedit.status === "OK") {
                this.notifier.notify('success', 'Successfully Edited FAQ!');

                this.getFAQ();

            } else {
                this.notifier.notify('error', 'Failed to edit FAQ !');
            }
            this.editFAQ_TmMove.reset(); this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR + User Not Found: ' + error);

            }
        )
    }

    //fuction to delete FAQ 

    delfaq() {
        let data = {
            id: this.selQnA.id
        }
        let deletefaqextra = this._POST_api_Service.POST_data('/faq/del', data);
        let dataJUDel: any = {};
        let ret = deletefaqextra.subscribe(dataRes => {
            dataJUDel = dataRes;
            if (dataJUDel.status === "OK") {
                this.notifier.notify('success', 'Successfully Delete FAQ !');
                this.getFAQ();
            } else {
                this.notifier.notify('error', 'Error - Fail to delete FAQ!');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )

    }

    //fuction to sequence UP FAQ 

    UPfaq(item) {
        console.log(item);
        let data = {
           
            id: item.id

        }
        console.log(data);
        let upfaq = this._POST_api_Service.POST_data('/faq/seq/up', data);
        let dataupfaq: any = {};
        let ret = upfaq.subscribe(dataUp => {
            dataupfaq = dataUp;
            if (dataupfaq.status === "OK") {
                this.notifier.notify('success', 'Successfully UP FAQ !');
                this.getFAQ();
            } else {
                this.notifier.notify('error', 'Error - !');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )

    }

    DOWNfaq(item){
        console.log(item);
        let data = {
           
            id: item.id 

        }
        console.log(data);
        let downfaq = this._POST_api_Service.POST_data('/faq/seq/down', data);
        let datadownfaq: any = {};
        let ret = downfaq.subscribe(dataUp => {
            datadownfaq = dataUp;
            if (datadownfaq.status === "OK") {
                this.notifier.notify('success', 'Successfully DOWN FAQ !');
                this.getFAQ();
            } else {
                this.notifier.notify('error', 'Error - !');
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            }
        )

    }

    //function get FAQ 
    getFAQ() {
        type TrackingData = {
            id: number, q: string, a: string
        };
        let myarray: TrackingData[] = [];
        let myarray2 = [];
        let myarray3 = [];
        let myarray4 = [];
        let myarray5 = [];

        this._GET_api_Service.GET_data('/faq/all')
            .subscribe(data => {
                this.loading = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].category === 'Era') {
                        myarray.push({
                            id: data[i].id, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'Extraordinaire') {
                        myarray2.push({
                            id: data[i].id, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'EraApp') {
                        myarray3.push({
                            id: data[i].id, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'JobAds') {
                        myarray4.push({
                            id: data[i].id, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                    else if (data[i].category === 'TmMove') {
                        myarray5.push({
                            id: data[i].id, q: data[i].question, a: data[i].answer_html !== null ? data[i].answer_html : data[i].answer
                        });
                    }
                }
                this.data = myarray;
                this.data2 = myarray2;
                this.data3 = myarray3;
                this.data4 = myarray4;
                this.data5= myarray5;
            },
                error => {
                    this.showAlert('alertError');
                    this._alertService.error("Loading FAQ Failed");
                    console.log('[ERROR - FAQ] ' + error);
                    this.loading = false;


                });

    };



}


